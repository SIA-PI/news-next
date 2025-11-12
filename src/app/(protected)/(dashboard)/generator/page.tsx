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
import { feedCategories } from '@/constants';
import { createFeed } from '@/features/news/services/createFeed';
import {
  faBolt,
  faCalendar,
  faChartLine,
  faCheck,
  faCheckCircle,
  faCog,

  faEye,
  faFutbol,
  faGlobe,
  faHeartbeat,
  faLanguage,
  faMagic,
  faMicrochip,
  faPaperPlane,
  faRocket,

  faSearch,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BR, PT, US } from 'country-flag-icons/react/3x2';
import { useSession } from 'next-auth/react'; // Importado para obter o userId
import { useRouter } from 'next/navigation';
import { FormEvent, useReducer } from 'react';
import { toast } from 'sonner';

type WebhookStatus = 'idle' | 'loading' | 'ok' | 'error';

// --- ESTADO ATUALIZADO ---
interface GeneratorState {
  topic: string;
  country: string;
  language: string;
  period: string;
  afterDate?: string;
  beforeDate?: string;
  sourceSite?: string;
  category: string; // Novo campo
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
  afterDate: '',
  beforeDate: '',
  sourceSite: '',
  category: '', // Novo campo
  loading: false,
  url: '',
  sentWebhook: 'idle',
  saved: false,
};

// ... (Reducer e outras funções permanecem os mesmos)
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
  opts?: { afterDate?: string; beforeDate?: string; sourceSite?: string }
): string {
  const parts: string[] = [];
  if (topic) parts.push(topic);
  if (opts?.sourceSite) parts.push(`site:${opts.sourceSite}`);
  if (opts?.afterDate) parts.push(`after:${opts.afterDate}`);
  if (opts?.beforeDate) parts.push(`before:${opts.beforeDate}`);

  const q = encodeURIComponent(parts.join(' '));
  let url = `https://news.google.com/rss/search?q=${q}&hl=${language}&gl=${country}&ceid=${country}:${language}`;
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
  const router = useRouter()
  const [state, dispatch] = useReducer(generatorReducer, initialState);
  const { data: session } = useSession();
  const {
    topic,
    country,
    language,
    period,
    afterDate,
    beforeDate,
    sourceSite,
    category,
    loading,
    url,
    sentWebhook,
  } = state;

  // --- LÓGICA DE CRIAÇÃO ATUALIZADA ---
  const handleCreateFeed = async (feedUrl: string) => {
    if (!session?.user?.id) {
      toast.error('Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    if (!category) {
      toast.warning('Por favor, selecione uma categoria para o feed.');
      return;
    }

    const payload = {
      name: topic ? `RSS: ${topic}` : 'Meu Feed RSS',
      url: feedUrl,
      interval: '0 * * * *',
      category: category,
      // userId: session.user.id,
    };

    dispatch({ type: 'SET_WEBHOOK_STATUS', payload: 'loading' });
    try {
      await createFeed(payload);
      dispatch({ type: 'SET_WEBHOOK_STATUS', payload: 'ok' });
      toast.success('Feed salvo com sucesso na sua lista!');
      router.push('/feeds');
    } catch (err) {
      console.error('Erro ao criar feed:', err);
      dispatch({ type: 'SET_WEBHOOK_STATUS', payload: 'error' });
      toast.error('Falha ao salvar o feed. Tente novamente.');
    } finally {
      setTimeout(
        () => dispatch({ type: 'SET_WEBHOOK_STATUS', payload: 'idle' }),
        1500,
      );
    }
  };

  const onGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!topic) {
      toast.warning('Por favor, digite um tópico para gerar o feed.');
      return;
    }
    dispatch({ type: 'GENERATE_START' });
    await new Promise((r) => setTimeout(r, 800));
    const newUrl = generateRssUrl(topic, country, language, period, {
      afterDate,
      beforeDate,
      sourceSite,
    });
    dispatch({ type: 'GENERATE_SUCCESS', payload: newUrl });

    // A chamada para salvar o feed foi movida para o botão de webhook/salvar
  };



  const onSaveAndWebhook = () => {
    if (!url) return;
    handleCreateFeed(url);
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
            {/* Tópico */}
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

            {/* --- NOVO CAMPO DE CATEGORIA --- */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <FontAwesomeIcon icon={faBolt} className="text-yellow-400" />{' '}
                Categoria
              </label>
              <Select
                value={category}
                onValueChange={(value) => handleFieldChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria..." />
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* País */}
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
                    <SelectValue placeholder="Selecione..." />
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
                        <span>EUA</span>
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
              {/* Linguagem */}
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
              {/* Período */}
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
                    <SelectItem value="1h">Última hora</SelectItem>
                    <SelectItem value="1d">Últimas 24h</SelectItem>
                    <SelectItem value="7d">Última semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filtros Avançados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fonte específica */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faGlobe} className="text-cyan-400" />{' '}
                  Fonte (site:)
                </label>
                <Input
                  value={sourceSite ?? ''}
                  onChange={(e) => handleFieldChange('sourceSite', e.target.value)}
                  type="text"
                  placeholder="Ex: reuters.com"
                />
              </div>
              {/* Data inicial (after) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendar} className="text-orange-400" />{' '}
                  Data inicial (after)
                </label>
                <Input
                  value={afterDate ?? ''}
                  onChange={(e) => handleFieldChange('afterDate', e.target.value)}
                  type="date"
                  placeholder="YYYY-MM-DD"
                />
              </div>
              {/* Data final (before) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendar} className="text-orange-400" />{' '}
                  Data final (before)
                </label>
                <Input
                  value={beforeDate ?? ''}
                  onChange={(e) => handleFieldChange('beforeDate', e.target.value)}
                  type="date"
                  placeholder="YYYY-MM-DD"
                />
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
              {/* <Button
                type="button"
                onClick={onSave}
                variant="secondary"
                size="lg"
              >
                <FontAwesomeIcon icon={saved ? faCheck : faSave} />
              </Button> */}
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
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-6">
                    {/* <button
                      onClick={onCopy}
                      className="text-cyan-400 hover:text-cyan-300 p-2"
                      title="Copiar URL"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </button> */}
                    {/* Botão de salvar/webhook atualizado */}
                    <button
                      onClick={onSaveAndWebhook}
                      className="text-indigo-400 hover:text-indigo-300 p-2"
                      title="Salvar Feed"
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
                      Salvar
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
