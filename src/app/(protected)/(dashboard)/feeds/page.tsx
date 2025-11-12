'use client';
import FeedCard from '@/components/FeedCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CreateFeedModal } from '@/features/news/components/CreateFeedModal';
import { EditFeedModal } from '@/features/news/components/EditFeedModal';
import { useDeleteFeedMutation } from '@/features/news/mutations/useDeleteFeedMutation.mutation';
import { useListFeedsQuery } from '@/features/news/queries/useListFeedsQuery.query';
import { FeedItemType } from '@/types';
import { getCronDescription } from '@/lib/utils';
import { faCircle, faPause, faPlus, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { api } from '@/lib/http-client';
import { endpoints } from '@/features/news/endpoints';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

function mapToFeedItem(feed: {
  id: string;
  name?: string;
  url: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  interval: string;
}): FeedItemType {
  return {
    title: feed.name ?? new URL(feed.url).hostname.replace(/^www\./, ''),
    count: 0,
    icon: faCircle,
    bg: 'bg-[rgb(var(--primary))]/20',
    text: 'text-[rgb(var(--primary))]',
    status: {
      text: feed.status === 'ACTIVE' ? 'Ativo' : feed.status,
      cls: feed.status === 'ACTIVE' ? 'status-online' : 'status-offline',
      icon: feed.status === 'ACTIVE' ? faCircle : faPause,
    },
    last: new Date(feed.updatedAt || feed.createdAt).toLocaleString(),
    webhook: {
      text: `Intervalo: ${getCronDescription(feed.interval)}`,
      cls: 'text-[rgb(var(--text-muted))]',
    },
    progress: feed.status === 'ACTIVE',
  };
}

export default function FeedsPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useListFeedsQuery();
  const deleteMutation = useDeleteFeedMutation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editInterval, setEditInterval] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      const ids = (data ?? []).map((f) => f.id);
      await Promise.allSettled(ids.map((id) => api.post(endpoints.news.feeds.refresh(id))));
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Meus Feeds RSS</CardTitle>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={handleRefreshAll} disabled={isRefreshing}>
            {isRefreshing ? (
              <span className="inline-flex items-center">
                <FontAwesomeIcon icon={faRotateRight} className="mr-2 animate-spin" />
                Atualizando
              </span>
            ) : (
              <span className="inline-flex items-center">
                <FontAwesomeIcon icon={faRotateRight} className="mr-2" />
                Atualizar
              </span>
            )}
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Novo Feed
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-[rgb(var(--text-muted)))]">Carregando...</div>
        )}
        {isError && (
          <div className="text-red-400">
            Erro ao carregar feeds. Tente novamente.
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {(data ?? []).map((f) => {
            const item = mapToFeedItem({
              id: f.id,
              name: f.name,
              url: f.url,
              status: f.status,
              createdAt: f.createdAt,
              updatedAt: f.updatedAt,
              interval: f.interval,
            });
            return (
              <FeedCard
                key={f.id}
                {...item}
                onView={() => router.push(`/feeds/details/${f.id}`)}
                onEdit={() => {
                  setEditId(f.id);
                  setEditName(f.name ?? '');
                  setEditUrl(f.url);
                  setEditInterval(f.interval);
                  setIsEditOpen(true);
                }}
                onDelete={() => {
                  if (confirm('Deseja excluir este feed?')) {
                    deleteMutation.mutate(f.id);
                  }
                }}
              />
            );
          })}
        </div>

        <CreateFeedModal isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />

        <EditFeedModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          feedId={editId}
          initialName={editName}
          initialUrl={editUrl}
          initialInterval={editInterval}
          setEditId={setEditId}
        />
      </CardContent>
    </Card>
  );
}
