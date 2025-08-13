'use client';
import FeedCard from '@/components/FeedCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useDeleteFeedMutation } from '@/features/news/mutations/useDeleteFeedMutation.mutation';
import { useUpdateFeedMutation } from '@/features/news/mutations/useUpdateFeedMutation.mutation';
import { useListFeedsQuery } from '@/features/news/queries/useListFeedsQuery.query';
import { createFeed } from '@/features/news/services/createFeed';
import { FeedItemType } from '@/types';
import { faCircle, faPause, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const [createName, setCreateName] = useState('');
  const [createUrl, setCreateUrl] = useState('');
  const [createInterval, setCreateInterval] = useState('0 * * * *');

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
          <div className="text-[rgb(var(--text-muted))]">Carregando...</div>
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

        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-[rgb(var(--muted))] border border-[rgb(var(--border))] p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Criar Novo Feed</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">
                    Nome
                  </label>
                  <Input
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="My Awesome Feed"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">
                    URL
                  </label>
                  <Input
                    value={createUrl}
                    onChange={(e) => setCreateUrl(e.target.value)}
                    placeholder="https://www.example.com/rss"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">
                    Intervalo (cron)
                  </label>
                  <Input
                    value={createInterval}
                    onChange={(e) => setCreateInterval(e.target.value)}
                    placeholder="0 * * * *"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  disabled={createMutation.isPending}
                  onClick={() => {
                    createMutation.mutate({
                      name: createName,
                      url: createUrl,
                      interval: createInterval,
                    });
                  }}
                >
                  Criar
                </Button>
              </div>
            </div>
          </div>
        )}

        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-[rgb(var(--muted))] border border-[rgb(var(--border))] p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Editar Feed</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">
                    Nome
                  </label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nome do feed"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">
                    URL
                  </label>
                  <Input
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">
                    Intervalo (cron)
                  </label>
                  <Input
                    value={editInterval}
                    onChange={(e) => setEditInterval(e.target.value)}
                    placeholder="0 * * * *"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditId(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  disabled={updateMutation.isPending || !editId}
                  onClick={async () => {
                    if (!editId) return;
                    await updateMutation.mutateAsync({
                      id: editId,
                      payload: {
                        name: editName || undefined,
                        url: editUrl || undefined,
                        interval: editInterval || undefined,
                      },
                    });
                    setIsEditOpen(false);
                    setEditId(null);
                  }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
