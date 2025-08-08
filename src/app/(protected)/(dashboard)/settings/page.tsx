import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="org-name"
                className="text-sm font-medium text-gray-300"
              >
                Nome da Organização
              </label>
              <Input
                id="org-name"
                type="text"
                defaultValue="Flux Consultoria.ia"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="main-email"
                className="text-sm font-medium text-gray-300"
              >
                Email Principal
              </label>
              <Input
                id="main-email"
                type="email"
                defaultValue="contato@fluxconsultoria.ia"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="timezone"
              className="text-sm font-medium text-gray-300"
            >
              Fuso Horário
            </label>
            <Select defaultValue="br-sp">
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Selecione um fuso horário..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="br-sp">America/Sao_Paulo (UTC-3)</SelectItem>
                <SelectItem value="us-ny">America/New_York (UTC-5)</SelectItem>
                <SelectItem value="eu-ln">Europe/London (UTC+0)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="font-semibold">Notificações</h4>
            <div className="space-y-3">
              <label
                htmlFor="feed-fail-notification"
                className="flex items-center gap-3 cursor-pointer"
              >
                <Checkbox id="feed-fail-notification" defaultChecked />
                <span>Notificar quando um feed falhar</span>
              </label>
              <label
                htmlFor="daily-report-notification"
                className="flex items-center gap-3 cursor-pointer"
              >
                <Checkbox id="daily-report-notification" defaultChecked />
                <span>Relatório diário por email</span>
              </label>
              <label
                htmlFor="security-alerts-notification"
                className="flex items-center gap-3 cursor-pointer"
              >
                <Checkbox id="security-alerts-notification" />
                <span>Alertas de segurança</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API & Integrações */}
      <Card>
        <CardHeader>
          <CardTitle>API & Integrações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="api-key"
              className="text-sm font-medium text-gray-300"
            >
              Chave da API
            </label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type="password"
                defaultValue="npulse_xxxxxxxxxxxxxxxxxxxxxxxx"
                readOnly
              />
              <Button>Gerar Nova</Button>
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="rate-limit"
              className="text-sm font-medium text-gray-300"
            >
              Rate Limit
            </label>
            <Select defaultValue="100">
              <SelectTrigger id="rate-limit">
                <SelectValue placeholder="Selecione um limite..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100 requisições/hora</SelectItem>
                <SelectItem value="500">500 requisições/hora</SelectItem>
                <SelectItem value="1000">1000 requisições/hora</SelectItem>
                <SelectItem value="unlimited">Ilimitado (Pro)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Zona de Perigo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-400">Zona de Perigo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-red-400">Exportar Dados</h4>
              <p className="text-gray-400 text-sm">
                Baixe todos os seus dados em formato JSON.
              </p>
            </div>
            <Button
              variant="danger"
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 !transform-none"
            >
              Exportar
            </Button>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-red-400">
                Resetar Configurações
              </h4>
              <p className="text-gray-400 text-sm">
                Retorna todas as configurações ao padrão.
              </p>
            </div>
            <Button
              variant="danger"
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 !transform-none"
            >
              Resetar Tudo
            </Button>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-red-400">Excluir Conta</h4>
              <p className="text-gray-400 text-sm">
                Esta ação é irreversível e apagará todos os dados.
              </p>
            </div>
            <Button variant="danger" className="!transform-none">
              Excluir Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
