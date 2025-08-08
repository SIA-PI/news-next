import HelpCard from '@/components/HelpCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  faBook,
  faChevronDown,
  faCircle,
  faHeadset,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const helpCards = [
  {
    icon: faBook,
    bg: 'bg-[rgb(var(--primary))]/20',
    text: 'text-[rgb(var(--primary))]',
    title: 'Documentação',
    desc: 'Guias completos e referência da API',
    action: 'Ver Docs →',
  },
  {
    icon: faVideo,
    bg: 'bg-green-500/20',
    text: 'text-green-500',
    title: 'Tutoriais',
    desc: 'Vídeos passo a passo',
    action: 'Assistir →',
  },
  {
    icon: faHeadset,
    bg: 'bg-purple-500/20',
    text: 'text-purple-500',
    title: 'Suporte',
    desc: 'Fale com nossa equipe',
    action: 'Contatar →',
  },
];

const faqQuestions = [
  'Como configurar meu primeiro feed RSS?',
  'Qual é o limite de feeds na versão gratuita?',
  'Como integrar com n8n?',
  'Posso usar webhooks personalizados?',
];

const systemServices = [
  { name: 'API RSS', isOperational: true },
  { name: 'Webhooks', isOperational: true },
  { name: 'Dashboard', isOperational: true },
  { name: 'Automação', isOperational: false },
];

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Central de Ajuda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {helpCards.map((card) => (
              <HelpCard key={card.title} {...card} />
            ))}
          </div>

          <div className="space-y-6">
            {/* Perguntas Frequentes */}
            <div>
              <h4 className="font-semibold mb-4 text-[rgb(var(--text-primary))]">Perguntas Frequentes</h4>
              <div className="space-y-4">
                {faqQuestions.map((q) => (
                  <div key={q} className="glassmorphism-strong rounded-xl p-4">
                    <button className="w-full text-left flex items-center justify-between">
                      <span className="font-medium text-[rgb(var(--text-primary))]">{q}</span>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="text-[rgb(var(--text-muted))]"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Status do Sistema */}
            <div>
              <h4 className="font-semibold mb-4 text-[rgb(var(--text-primary))]">Status do Sistema</h4>
              <div className="glassmorphism-strong rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-[rgb(var(--text-primary))]">
                    Todos os Sistemas Operacionais
                  </h5>
                  <span className="status-online flex items-center gap-2">
                    <FontAwesomeIcon icon={faCircle} className="text-xs" />
                    Online
                  </span>
                </div>
                <div className="space-y-3">
                  {systemServices.map((service) => (
                    <div
                      key={service.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[rgb(var(--text-muted))]">{service.name}</span>
                      <span
                        className={
                          service.isOperational
                            ? 'status-online'
                            : 'status-offline'
                        }
                      >
                        {service.isOperational ? 'Operacional' : 'Manutenção'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
