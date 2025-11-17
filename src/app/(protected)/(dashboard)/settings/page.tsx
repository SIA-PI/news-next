'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useChangePasswordMutation } from '@/features/auth/mutations/useChangePasswordMutation.mutation';
import { api } from '@/lib/http-client';
import { whatsappEndpoints } from '@/features/whatsapp/endpoints';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappInterval, setWhatsappInterval] = useState('*/30 * * * *');
  const [qrData, setQrData] = useState<string | null>(null);
  const [statusState, setStatusState] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const isAdmin = (session?.user?.username || '').toLowerCase() === 'admin';

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

  const handleWhatsappSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {};
    if (whatsappNumber) payload.whatsappNumber = whatsappNumber;
    payload.enabled = whatsappEnabled;
    if (whatsappInterval) payload.whatsappInterval = whatsappInterval;
    const promise = api.put(whatsappEndpoints.settings(), payload);
    toast.promise(promise, {
      loading: 'Salvando configurações do WhatsApp...',
      success: () => 'Configurações salvas com sucesso!',
      error: (error) => error.message,
    });
  };

  const handleGetQr = async () => {
    setQrData(null);
    const { data } = await api.get<{ data: string; accountId: string }>(whatsappEndpoints.qr());
    setQrData(data.data);
    setAccountId(data.accountId);
    toast.success('QR code obtido');
  };

  const handleGetStatus = async () => {
    const { data } = await api.get<{ state: string }>(whatsappEndpoints.status());
    setStatusState(data.state);
    toast.success('Status atualizado');
  };

  const handleEnsureAccount = async () => {
    const { data } = await api.post<{ accountId: string }>(whatsappEndpoints.ensureAccount());
    setAccountId(data.accountId);
    toast.success('Conta mestre pronta');
  };

  const handleStartSession = async () => {
    toast.error('Endpoint de início de sessão não implementado.');
  };

  const handleStopSession = async () => {
    toast.error('Endpoint de encerramento de sessão não implementado.');
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium text-[rgb(var(--text-muted))]">Nova Senha</label>
                <Input id="new-password" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={isPending} />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium text-[rgb(var(--text-muted))]">Confirmar Nova Senha</label>
                <Input id="confirm-password" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isPending} />
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending || !session?.user?.username}>{isPending ? (<div className="loading-spinner mx-auto" />) : ('Alterar Senha')}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <form onSubmit={handleWhatsappSave} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="whatsapp-number" className="text-sm font-medium text-[rgb(var(--text-muted))]">Número do WhatsApp</label>
                  <Input id="whatsapp-number" type="text" placeholder="+55 11 91234-5678" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[rgb(var(--text-muted))]">Habilitar envio</label>
                    <Select value={whatsappEnabled ? 'true' : 'false'} onValueChange={(v) => setWhatsappEnabled(v === 'true')}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Habilitado</SelectItem>
                        <SelectItem value="false">Desabilitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[rgb(var(--text-muted))]">Intervalo</label>
                    <Select value={whatsappInterval} onValueChange={(v) => setWhatsappInterval(v)}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="*/5 * * * *">5 min</SelectItem>
                        <SelectItem value="*/30 * * * *">30 min</SelectItem>
                        <SelectItem value="0 */6 * * *">6 horas</SelectItem>
                        <SelectItem value="0 */12 * * *">12 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full">Salvar Preferências</Button>
              </form>

              {isAdmin && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="secondary" onClick={handleEnsureAccount}>Criar/garantir conta</Button>
                    <Button variant="secondary" onClick={handleGetQr}>Obter QR</Button>
                    <Button variant="secondary" onClick={handleGetStatus}>Ver Status</Button>
                    {/* <Button variant="outline" onClick={handleStartSession}>Iniciar Sessão</Button>
                    <Button variant="outline" onClick={handleStopSession}>Encerrar Sessão</Button> */}
                  </div>
                  {accountId && (
                    <div className="mt-2">
                      <Input readOnly value={accountId} />
                    </div>
                  )}
                  {qrData && (
                    <div className="mt-2">
                      {qrData.startsWith('data:image') ? (
                        <img src={qrData} alt="QR code" className="w-full max-h-64 object-contain rounded-lg" />
                      ) : (
                        <Input readOnly value={qrData} />
                      )}
                    </div>
                  )}
                  {statusState && (
                    <div className="mt-2">
                      <Input readOnly value={statusState} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
