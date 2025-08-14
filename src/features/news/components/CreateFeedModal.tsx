'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'; // Importando o componente Select
import { useCreateFeedMutation } from '@/features/news/mutations/useCreateFeedMutation.mutation';
import { useSession } from 'next-auth/react'; // Importando o hook da sessão
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface CreateFeedModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// Supondo que você tenha uma lista de categorias pré-definida
const feedCategories = [
  'General',
  'Technology',
  'Business',
  'Entertainment',
  'Sports',
  'Science',
  'Health',
];

export const CreateFeedModal = ({
  isOpen,
  setIsOpen,
}: CreateFeedModalProps) => {
  const { data: session } = useSession(); // Obtendo os dados da sessão
  const createMutation = useCreateFeedMutation();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [interval, setInterval] = useState('0 * * * *');
  const [category, setCategory] = useState(''); // Estado para a nova categoria
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isOpen || !isClient) return null;

  const handleCreateFeed = async () => {
    if (!session?.user?.id) {
      alert('Erro: Usuário não autenticado.');
      return;
    }

    await createMutation.mutateAsync({
      name,
      url,
      interval,
      category,
      userId: session.user.id, // Passando o userId da sessão
    });
    setIsOpen(false);
    // Limpar os campos após a criação bem-sucedida
    setName('');
    setUrl('');
    setInterval('0 * * * *');
    setCategory('');
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-xl bg-[rgb(var(--muted))] border border-[rgb(var(--border))] p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Criar Novo Feed</h3>
        <div className="space-y-4">
          {/* Campo Nome */}
          <div>
            <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">
              Nome
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Meu feed RSS"
            />
          </div>
          {/* Campo URL */}
          <div>
            <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">
              URL
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.exemplo.com/rss"
            />
          </div>
          {/* Campo Categoria */}
          <div>
            <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">
              Categoria
            </label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {feedCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Campo Intervalo */}
          <div>
            <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">
              Intervalo (cron)
            </label>
            <Input
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
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
            disabled={createMutation.isPending || !name || !url || !category}
            onClick={handleCreateFeed}
          >
            {createMutation.isPending ? 'Criando...' : 'Criar'}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modal-root')!);
};
