'use client';

import ArticleCard from '@/components/ArticleCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { usePageMeta } from '@/context/PageMetaContext';
import { useFeedByIdQuery } from '@/features/news/queries/useFeedByIdQuery.query';
import { useListArticlesQuery } from '@/features/news/queries/useListArticlesQuery.query';
import { api } from '@/lib/http-client';
import { endpoints } from '@/features/news/endpoints';
import { faSearch, faTrashAlt, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

const ITEMS_PER_PAGE = 10;

export default function FeedDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { setMeta } = usePageMeta();

  // Estados para os filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [currentPage, setCurrentPage] = useState(1);

  // Query para buscar os detalhes do feed (usado no título)
  const { data: feed } = useFeedByIdQuery(id);

  // Query para buscar os artigos com filtros e paginação
  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    isError: isErrorArticles,
    refetch,
  } = useListArticlesQuery({
    feedId: id,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearchQuery,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  // Acessa os dados da API na estrutura correta
  const articles = articlesData?.articles ?? [];
  const totalArticles = articlesData?.total ?? 0;
  const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);

  // Efeito para atualizar o título do cabeçalho dinamicamente
  useEffect(() => {
    if (feed?.name) {
      setMeta({
        title: feed.name,
        subtitle: 'Detalhes e artigos recentes do feed',
      });
    }
  }, [feed, setMeta]);

  const handleClearFeed = () => {
    if (
      confirm(
        'Tem certeza de que deseja limpar todos os artigos deste feed? Esta ação não pode ser desfeita.',
      )
    ) {
      // TODO: Implementar a chamada da API para limpar os artigos do feed
      console.log(`Limpando artigos do feed ${id}...`);
      alert('Artigos do feed limpos com sucesso! (Simulação)');
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await api.post(endpoints.news.feeds.refresh(id));
      await refetch();
    } catch (err) {
      console.error('Falha ao atualizar o feed:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDateTimeBR = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleGeneratePdf = () => {
    const now = new Date();
    const titleKey = (debouncedSearchQuery || feed?.name || 'Sem chave').toString();
    const appliedFilters = `Período: ${startDate} até ${endDate}`;
    const defaultNote = 'Padrão: notícias de 1 dia atrás';

    const articleItems = (articles || []).slice(0, 50).map((a) => {
      const dt = new Date(a.pubDate);
      const dateBr = formatDateTimeBR(dt);
      let host = '';
      try { host = new URL(a.link).hostname.replace(/^www\./, ''); } catch {}
      const meta = [dateBr, host || null, a.source || null].filter(Boolean).join(' • ');
      return `
        <div class="item">
          <div class="title"><a href="${a.link}" target="_blank" rel="noopener noreferrer">${a.title}</a></div>
          <div class="meta">${meta}</div>
        </div>
      `;
    }).join('');

    const html = `<!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Relatório de Notícias</title>
        <style>
          :root { color-scheme: light; }
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif; margin: 24px; color: #0f172a; background: #ffffff; }
          .container { max-width: 980px; margin: 0 auto; }
          header { display: flex; flex-direction: column; gap: 6px; padding-bottom: 12px; border-bottom: 2px solid #e5e7eb; }
          h1 { font-size: 22px; margin: 0; color: #111827; }
          .muted { color: #6b7280; font-size: 12px; }
          .section { margin-top: 18px; }
          .filters { background: #f9fafb; padding: 14px; border-radius: 10px; border: 1px solid #e5e7eb; }
          .pill { display: inline-block; background: #eef2ff; color: #374151; border: 1px solid #c7d2fe; border-radius: 999px; padding: 6px 10px; font-size: 12px; margin-right: 8px; }
          .list { margin-top: 14px; display: grid; grid-template-columns: 1fr; gap: 10px; }
          .item { padding: 12px 14px; border-radius: 10px; border: 1px solid #e5e7eb; background: #ffffff; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
          .title { font-size: 14px; font-weight: 600; color: #111827; line-height: 1.4; }
          .title a { color: #1d4ed8; text-decoration: none; }
          .title a:hover { text-decoration: underline; }
          .meta { margin-top: 6px; font-size: 12px; color: #6b7280; }
          hr { border: none; border-top: 1px solid #e5e7eb; margin: 18px 0; }
          @media print { .title a { color: #1d4ed8; text-decoration: underline; } }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Relatório de Notícias — ${titleKey}</h1>
            <div class="muted">Gerado em ${formatDateTimeBR(now)}</div>
          </header>
          <div class="section filters">
            <div class="pill">${appliedFilters}</div>
            <div class="pill">${defaultNote}</div>
          </div>
          <hr />
          <div class="section">
            <strong>Artigos</strong>
            <div class="list">${articleItems || '<div class="muted">Nenhum artigo no período.</div>'}</div>
          </div>
        </div>
        <script>window.print();</script>
      </body>
      </html>`;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Card com os controles de Filtro e Ações */}
      <Card>
        <CardContent className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:flex-1">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))]"
            />
            <Input
              type="text"
              placeholder="Pesquisar artigos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Data de início"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="Data de fim"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="secondary"
              onClick={handleRefresh}
              className="w-full md:w-auto"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <span className="inline-flex items-center">
                  <FontAwesomeIcon icon={faRotateRight} className="mr-2 animate-spin" />
                  Atualizando...
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <FontAwesomeIcon icon={faRotateRight} className="mr-2" />
                  Atualizar
                </span>
              )}
            </Button>
            <Button
              variant="primary"
              onClick={handleGeneratePdf}
              className="w-full md:w-auto"
            >
              Gerar PDF
            </Button>
            <Button
              variant="danger"
              onClick={handleClearFeed}
              className="w-full md:w-auto"
            >
              <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seção da Listagem de Artigos */}
      <div className="space-y-4 flex flex-col gap-2">
        {isLoadingArticles && (
          <p className="text-center text-[rgb(var(--text-muted))] py-8">
            Carregando artigos...
          </p>
        )}
        {isErrorArticles && (
          <p className="text-center text-red-400 py-8">
            Erro ao carregar os artigos.
          </p>
        )}
        {!isLoadingArticles &&
          !isErrorArticles &&
          (articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <p className="text-center text-[rgb(var(--text-muted))] py-8">
              Nenhum artigo encontrado.
            </p>
          ))}
      </div>

      {/* Controles de Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-[rgb(var(--text-muted))]">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
