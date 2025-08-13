'use client';

import ArticleCard from '@/components/ArticleCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { usePageMeta } from '@/context/PageMetaContext'; // Importe o hook do contexto
import { useFeedByIdQuery } from '@/features/news/queries/useFeedByIdQuery.query';
import {
  faCalendarAlt,
  faSearch,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react'; // Importe o useEffect

// Mock da lista de notícias...
const mockArticles = Array.from({ length: 25 }, (_, i) => ({
  id: `a1b2c3d4-e5f6-7890-1234-${i.toString().padStart(12, '0')}`,
  title: `Notícia de Exemplo ${i + 1}`,
  link: `https://www.example.com/article/${i + 1}`,
  pubDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  summary: `Este é um resumo do artigo de exemplo número ${i + 1}.`,
  feedId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
}));

const ITEMS_PER_PAGE = 10;

export default function FeedDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: feed, isLoading, isError } = useFeedByIdQuery(id);
  const { setMeta } = usePageMeta(); // Use o hook do contexto

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Efeito para atualizar o título do cabeçalho
  useEffect(() => {
    if (feed?.name) {
      setMeta({
        title: feed.name,
        subtitle: 'Detalhes e artigos recentes do feed',
      });
    }
  }, [feed, setMeta]);

  const articles = mockArticles;

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate =
        !dateFilter ||
        new Date(article.pubDate).toISOString().startsWith(dateFilter);

      return matchesSearch && matchesDate;
    });
  }, [articles, searchQuery, dateFilter]);

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, endIndex);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const handleClearFeed = () => {
    if (
      confirm(
        'Tem certeza de que deseja limpar todos os artigos deste feed? Esta ação não pode ser desfeita.',
      )
    ) {
      console.log(`Limpando artigos do feed ${id}...`);
      alert('Artigos do feed limpos com sucesso! (Simulação)');
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (isError || !feed) {
    return <div>Feed não encontrado.</div>;
  }

  return (
    // ... O resto do seu JSX permanece o mesmo
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
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
          <div className="relative w-full md:w-auto">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))] pointer-events-none"
            />
            <Input
              type="date"
              className="pl-10"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <Button
            variant="danger"
            onClick={handleClearFeed}
            className="w-full md:w-auto"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
            Limpar Feed
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Artigos Recentes</h3>
        {paginatedArticles.length > 0 ? (
          paginatedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="text-center text-[rgb(var(--text-muted))] py-8">
            Nenhum artigo encontrado.
          </p>
        )}
      </div>

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
