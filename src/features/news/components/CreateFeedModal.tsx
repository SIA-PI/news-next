'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCreateFeedMutation } from '@/features/news/mutations/useCreateFeedMutation.mutation';
import { useState } from 'react';

interface CreateFeedModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialName?: string;
  initialUrl?: string;
  initialInterval?: string;
}

export const CreateFeedModal = ({
  isOpen,
  setIsOpen,
  initialName = '',
  initialUrl = '',
  initialInterval = '0 * * * *',
}: CreateFeedModalProps) => {
  const [createName, setCreateName] = useState(initialName);
  const [createUrl, setCreateUrl] = useState(initialUrl);
  const [createInterval, setCreateInterval] = useState(initialInterval);

  const createMutation = useCreateFeedMutation();

  if (!isOpen) return null;

  return (
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
              placeholder="Meu feed RSS"
            />
          </div>
          <div>
            <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">
              URL
            </label>
            <Input
              value={createUrl}
              onChange={(e) => setCreateUrl(e.target.value)}
              placeholder="https://www.exemplo.com/rss"
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
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={createMutation.isPending}
            onClick={async () => {
              await createMutation.mutateAsync({
                name: createName,
                url: createUrl,
                interval: createInterval,
              });
              setIsOpen(false);
            }}
          >
            Criar
          </Button>
        </div>
      </div>
    </div>
  );
};
