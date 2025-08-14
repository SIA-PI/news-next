'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { CronIntervals } from '@/enums';
import { useUpdateFeedMutation } from '@/features/news/mutations/useUpdateFeedMutation.mutation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface EditFeedModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  feedId: string | null;
  initialName: string;
  initialUrl: string;
  initialInterval: string;
  setEditId: (id: string | null) => void;
}

export const EditFeedModal = ({
  isOpen,
  setIsOpen,
  feedId,
  initialName,
  initialUrl,
  initialInterval,
  setEditId,
}: EditFeedModalProps) => {
  const [editName, setEditName] = useState(initialName);
  const [editUrl, setEditUrl] = useState(initialUrl);
  const [editInterval, setEditInterval] = useState(initialInterval);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setEditName(initialName);
    setEditUrl(initialUrl);
    setEditInterval(initialInterval);
  }, [initialName, initialUrl, initialInterval]);

  const updateMutation = useUpdateFeedMutation();

  if (!isOpen || !isClient) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
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
              Intervalo
            </label>
            <Select onValueChange={setEditInterval} value={editInterval}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um intervalo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CronIntervals).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setIsOpen(false);
              setEditId(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={updateMutation.isPending || !feedId}
            onClick={async () => {
              if (!feedId) return;
              await updateMutation.mutateAsync({
                id: feedId,
                payload: {
                  name: editName || undefined,
                  url: editUrl || undefined,
                  interval: editInterval || undefined,
                },
              });
              setIsOpen(false);
              setEditId(null);
            }}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modal-root')!);
};