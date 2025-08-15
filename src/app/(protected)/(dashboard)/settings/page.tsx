'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useChangePasswordMutation } from '@/features/auth/mutations/useChangePasswordMutation.mutation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { mutateAsync, isPending } = useChangePasswordMutation();

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.username) {
      toast.error('Sessão inválida. Por favor, faça login novamente.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    const promise = mutateAsync({
      username: session.user.username,
      newPassword,
    });

    toast.promise(promise, {
      loading: 'Alterando a senha...',
      success: () => {
        setNewPassword('');
        setConfirmPassword('');
        return 'Senha alterada com sucesso!';
      },
      error: (err: Error | { response?: { data?: { message?: string } } }) => {
        return (
          ('response' in err ? err.response?.data?.message : undefined) ||
          'Erro ao alterar a senha. Verifique os dados e tente novamente.'
        );
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="text-sm font-medium text-[rgb(var(--text-muted))]"
              >
                Nova Senha
              </label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium text-[rgb(var(--text-muted))]"
              >
                Confirmar Nova Senha
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isPending || !session?.user?.username}
            >
              {isPending ? (
                <div className="loading-spinner mx-auto" />
              ) : (
                'Alterar Senha'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
