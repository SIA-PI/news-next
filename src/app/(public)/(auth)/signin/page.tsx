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
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('password');
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: () => {
      toast.success('Login bem-sucedido!');
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading('Entrando...');
    mutate({ email, password });
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
                <label htmlFor="email" className="text-sm font-medium text-[rgb(var(--text-muted))]">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
