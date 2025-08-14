'use client';

import ArticleCard from '@/components/ArticleCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { usePageMeta } from '@/context/PageMetaContext';
import { useFeedByIdQuery } from '@/features/news/queries/useFeedByIdQuery.query';
import { useListArticlesQuery } from '@/features/news/queries/useListArticlesQuery.query';
import { faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Query para buscar os detalhes do feed (usado no título)
  const { data: feed } = useFeedByIdQuery(id);

  // Query para buscar os artigos com filtros e paginação
  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    isError: isErrorArticles,
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
          <Button
            variant="danger"
            onClick={handleClearFeed}
            className="w-full md:w-auto"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
            Limpar
          </Button>
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
