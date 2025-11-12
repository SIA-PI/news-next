'use client'

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/http-client';
import { endpoints } from '@/features/auth/endpoints';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = Array.isArray(params?.token) ? params.token[0] : (params?.token as string);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Trocar senha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="text-sm font-medium">Nova senha</label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <label htmlFor="confirm" className="text-sm font-medium">Confirmar senha</label>
                <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              <Button
                className="w-full"
                disabled={isPending || !password || password !== confirm}
                onClick={async () => {
                  try {
                    setIsPending(true);
                    await api.post(endpoints.auth.resetPassword(), { token, newPassword: password });
                    toast.success('Senha alterada com sucesso');
                    router.push('/signin');
                  } catch (e) {
                    toast.error('Não foi possível alterar a senha');
                  } finally {
                    setIsPending(false);
                  }
                }}
              >
                Alterar senha
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}