'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { login } from '@/features/auth/services/login';
import { LoginCredentials } from '@/features/auth/types';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const promise = mutateAsync({ username, password });

    toast.promise(promise, {
      loading: 'Verificando credenciais...',
      success: () => {
        router.push('/dashboard');
        return 'Login bem-sucedido! Redirecionando...';
      },
      error: (error) => error.message,
    });
  };

  return (
    <div className="gradient-bg flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="glassmorphism-strong">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[rgb(var(--primary))] to-cyan-400 pulse-glow">
              <FontAwesomeIcon icon={faRss} className="text-3xl text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Bem-vindo ao NewsPulse</CardTitle>
            <p className="text-[rgb(var(--text-muted))]">Faça login para continuar</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-[rgb(var(--text-muted))]">
                  Usuário
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="seu-usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[rgb(var(--text-muted))]"
                >
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
                {isPending ? <div className="loading-spinner mx-auto" /> : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
