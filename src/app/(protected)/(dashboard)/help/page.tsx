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
    bg: 'bg-indigo-500/20',
    text: 'text-indigo-400',
    title: 'Documentação',
    desc: 'Guias completos e referência da API',
    action: 'Ver Docs →',
  },
  {
    icon: faVideo,
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    title: 'Tutoriais',
    desc: 'Vídeos passo a passo',
    action: 'Assistir →',
  },
  {
    icon: faHeadset,
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
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
              <h4 className="font-semibold mb-4">Perguntas Frequentes</h4>
              <div className="space-y-4">
                {faqQuestions.map((q) => (
                  <div key={q} className="glassmorphism-strong rounded-xl p-4">
                    <button className="w-full text-left flex items-center justify-between">
                      <span className="font-medium">{q}</span>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="text-gray-400"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Status do Sistema */}
            <div>
              <h4 className="font-semibold mb-4">Status do Sistema</h4>
              <div className="glassmorphism-strong rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium">
                    Todos os Sistemas Operacionais
                  </h5>
                  <span className="text-green-400 flex items-center gap-2">
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
                      <span className="text-gray-400">{service.name}</span>
                      <span
                        className={
                          service.isOperational
                            ? 'text-green-400'
                            : 'text-yellow-400'
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
