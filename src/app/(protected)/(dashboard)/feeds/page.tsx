'use client';
import FeedCard from '@/components/FeedCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CreateFeedModal } from '@/features/news/components/CreateFeedModal';
import { EditFeedModal } from '@/features/news/components/EditFeedModal';
import { useDeleteFeedMutation } from '@/features/news/mutations/useDeleteFeedMutation.mutation';
import { useUpdateFeedMutation } from '@/features/news/mutations/useUpdateFeedMutation.mutation';
import { useListFeedsQuery } from '@/features/news/queries/useListFeedsQuery.query';
import { createFeed } from '@/features/news/services/createFeed';
import { FeedItemType } from '@/types';
import { faCircle, faPause, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
      text: `Intervalo: ${feed.interval}`,
      cls: 'text-[rgb(var(--text-muted))]',
    },
    progress: feed.status === 'ACTIVE',
  };
}

export default function FeedsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useListFeedsQuery();
  const updateMutation = useUpdateFeedMutation();

  const deleteMutation = useDeleteFeedMutation();

  const createMutation = useMutation({
    mutationFn: createFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds', 'list'] });
      setIsCreateOpen(false);
    },
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editInterval, setEditInterval] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const items: FeedItemType[] = (data ?? []).map((f) =>
    mapToFeedItem({
      id: f.id,
      name: f.name,
      url: f.url,
      status: f.status,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      interval: f.interval,
    }),
  );

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Meus Feeds RSS</CardTitle>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Novo Feed
        </Button>
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
