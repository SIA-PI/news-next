'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  faCalendar,
  faChartLine,
  faCheck,
  faCheckCircle,
  faCog,
  faCopy,
  faEye,
  faFutbol,
  faGlobe,
  faHeartbeat,
  faLanguage,
  faMagic,
  faMicrochip,
  faPaperPlane,
  faRocket,
  faSave,
  faSearch,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BR, PT, US } from 'country-flag-icons/react/3x2';
import { FormEvent, useReducer } from 'react';

type WebhookStatus = 'idle' | 'loading' | 'ok' | 'error';

interface GeneratorState {
  topic: string;
  country: string;
  language: string;
  period: string;
  loading: boolean;
  url: string;
  sentWebhook: WebhookStatus;
  saved: boolean;
}

const initialState: GeneratorState = {
  topic: '',
  country: 'BR',
  language: 'pt-BR',
  period: 'all',
  loading: false,
  url: '',
  sentWebhook: 'idle',
  saved: false,
};

type GeneratorAction =
  | { type: 'SET_FIELD'; field: keyof GeneratorState; payload: string }
  | {
      type: 'SET_TEMPLATE';
      payload: { topic: string; country: string; language: string };
    }
  | { type: 'GENERATE_START' }
  | { type: 'GENERATE_SUCCESS'; payload: string }
  | { type: 'SET_WEBHOOK_STATUS'; payload: WebhookStatus }
  | { type: 'SET_SAVED'; payload: boolean };

function generatorReducer(
  state: GeneratorState,
  action: GeneratorAction,
): GeneratorState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.payload };
    case 'SET_TEMPLATE':
      return { ...state, ...action.payload };
    case 'GENERATE_START':
      return { ...state, loading: true, url: '' };
    case 'GENERATE_SUCCESS':
      return { ...state, loading: false, url: action.payload };
    case 'SET_WEBHOOK_STATUS':
      return { ...state, sentWebhook: action.payload };
    case 'SET_SAVED':
      return { ...state, saved: action.payload };
    default:
      return state;
  }
}

function generateRssUrl(
  topic: string,
  country: string,
  language: string,
  period = '',
): string {
  let url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    topic,
  )}&hl=${language}&gl=${country}&ceid=${country}:${language}`;
  if (period && period !== 'all') {
    url += `&when=${period}`;
  }
  return url;
}

const templates = {
  tech: {
    topic: 'tecnologia inteligência artificial',
    country: 'BR',
    language: 'pt-BR',
    icon: faMicrochip,
    label: 'Tecnologia',
    desc: 'IA, startups, inovação',
    color: 'text-indigo-400',
  },
  business: {
    topic: 'negócios economia mercado',
    country: 'BR',
    language: 'pt-BR',
    icon: faChartLine,
    label: 'Negócios',
    desc: 'Mercado, economia, empresas',
    color: 'text-green-400',
  },
  sports: {
    topic: 'esportes futebol',
    country: 'BR',
    language: 'pt-BR',
    icon: faFutbol,
    label: 'Esportes',
    desc: 'Futebol, olimpíadas',
    color: 'text-orange-400',
  },
  health: {
    topic: 'saúde medicina',
    country: 'BR',
    language: 'pt-BR',
    icon: faHeartbeat,
    label: 'Saúde',
    desc: 'Medicina, bem-estar',
    color: 'text-red-400',
  },
};

export default function GeneratorPage() {
  const [state, dispatch] = useReducer(generatorReducer, initialState);
  const { topic, country, language, period, loading, url, sentWebhook, saved } =
    state;

  const onGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!topic) {
      alert('Por favor, digite um tópico!');
      return;
    }
    dispatch({ type: 'GENERATE_START' });
    await new Promise((r) => setTimeout(r, 800));
    const newUrl = generateRssUrl(topic, country, language, period);
    dispatch({ type: 'GENERATE_SUCCESS', payload: newUrl });
  };

  const onCopy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
  };

  const onWebhook = async () => {
    if (!url) return;
    dispatch({ type: 'SET_WEBHOOK_STATUS', payload: 'loading' });
    console.log(`Enviando para: ${process.env.NEXT_PUBLIC_WEBHOOK_URL}`);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      dispatch({ type: 'SET_WEBHOOK_STATUS', payload: 'ok' });
    } catch {
      dispatch({ type: 'SET_WEBHOOK_STATUS', payload: 'error' });
    } finally {
      setTimeout(
        () => dispatch({ type: 'SET_WEBHOOK_STATUS', payload: 'idle' }),
        1500,
      );
    }
  };

  const onSave = () => {
    if (!topic) return;
    dispatch({ type: 'SET_SAVED', payload: true });
    setTimeout(() => dispatch({ type: 'SET_SAVED', payload: false }), 1500);
  };

  const handleFieldChange = (field: keyof GeneratorState, value: string) => {
    dispatch({ type: 'SET_FIELD', field, payload: value });
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FontAwesomeIcon icon={faMagic} className="text-indigo-400" />
            Gerador Avançado de RSS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={onGenerate}>
            <div className="space-y-2">
              <label
                htmlFor="topic-input"
                className="text-sm font-medium text-gray-300 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSearch} className="text-indigo-400" />{' '}
                Tópico
              </label>
              <Input
                id="topic-input"
                value={topic}
                onChange={(e) => handleFieldChange('topic', e.target.value)}
                type="text"
                placeholder="Ex: inteligência artificial"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faGlobe} className="text-cyan-400" />{' '}
                  País
                </label>
                <Select
                  value={country}
                  onValueChange={(value) => handleFieldChange('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um país..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BR">
                      <div className="flex items-center gap-2">
                        <BR className="w-5 h-auto rounded-sm" />
                        <span>Brasil</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="US">
                      <div className="flex items-center gap-2">
                        <US className="w-5 h-auto rounded-sm" />
                        <span>Estados Unidos</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="PT">
                      <div className="flex items-center gap-2">
                        <PT className="w-5 h-auto rounded-sm" />
                        <span>Portugal</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faLanguage}
                    className="text-purple-400"
                  />{' '}
                  Linguagem
                </label>
                <Select
                  value={language}
                  onValueChange={(value) =>
                    handleFieldChange('language', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="pt-PT">Português (Portugal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-orange-400"
                  />{' '}
                  Período
                </label>
                <Select
                  value={period}
                  onValueChange={(value) => handleFieldChange('period', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="h">Última hora</SelectItem>
                    <SelectItem value="d">Últimas 24h</SelectItem>
                    <SelectItem value="w">Última semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faRocket} /> Gerar RSS
                  </span>
                )}
              </Button>
              <Button
                type="button"
                onClick={onSave}
                variant="secondary"
                size="lg"
              >
                <FontAwesomeIcon icon={saved ? faCheck : faSave} />
              </Button>
            </div>
          </form>

          {url && (
            <div className="mt-8 p-6 glassmorphism-strong rounded-xl">
              <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} /> RSS Gerado com Sucesso!
              </h4>
              <div className="space-y-4">
                <div className="relative">
                  <Input type="text" readOnly value={url} className="pr-24" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                    <button
                      onClick={onCopy}
                      className="text-cyan-400 hover:text-cyan-300 p-2"
                      title="Copiar"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                    <button
                      onClick={onWebhook}
                      className="text-indigo-400 hover:text-indigo-300 p-2"
                      title="Enviar Webhook"
                    >
                      {sentWebhook === 'loading' && (
                        <div className="loading-spinner" />
                      )}
                      {sentWebhook === 'ok' && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-green-400"
                        />
                      )}
                      {sentWebhook === 'error' && (
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="text-red-400"
                        />
                      )}
                      {sentWebhook === 'idle' && (
                        <FontAwesomeIcon icon={faPaperPlane} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    asChild
                    variant="ghost"
                    className="flex-1 text-center"
                  >
                    <a href={url} target="_blank" rel="noreferrer">
                      <FontAwesomeIcon icon={faEye} className="mr-2" />{' '}
                      Visualizar Feed
                    </a>
                  </Button>
                  <Button variant="ghost" className="flex-1">
                    <FontAwesomeIcon icon={faCog} className="mr-2" /> Configurar
                    Automação
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Templates Rápidos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(templates).map((val) => (
            <button
              key={val.label}
              onClick={() => dispatch({ type: 'SET_TEMPLATE', payload: val })}
              className="feature-card rounded-xl p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={val.icon}
                  className={`${val.color} text-2xl`}
                />
                <div>
                  <h4 className="font-semibold">{val.label}</h4>
                  <p className="text-sm text-gray-400">{val.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
