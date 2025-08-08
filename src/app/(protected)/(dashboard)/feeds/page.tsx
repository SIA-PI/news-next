import FeedCard from '@/components/FeedCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FeedItemType } from '@/types';
import {
  faChartLine,
  faCircle,
  faFutbol,
  faMicrochip,
  faPause,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const feedsData: FeedItemType[] = [
  {
    title: 'Tecnologia Brasil',
    count: 156,
    icon: faMicrochip,
    bg: 'bg-indigo-500/20',
    text: 'text-indigo-400',
    status: { text: 'Ativo', cls: 'text-green-400', icon: faCircle },
    last: 'Há 5 min',
    webhook: { text: 'Conectado', cls: 'text-cyan-400' },
    progress: true,
  },
  {
    title: 'Negócios Global',
    count: 89,
    icon: faChartLine,
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    status: { text: 'Ativo', cls: 'text-green-400', icon: faCircle },
    last: 'Há 12 min',
    webhook: { text: 'Conectado', cls: 'text-cyan-400' },
    progress: true,
  },
  {
    title: 'Esportes BR',
    count: 23,
    icon: faFutbol,
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    status: { text: 'Pausado', cls: 'text-yellow-400', icon: faPause },
    last: 'Há 2 horas',
    webhook: { text: 'Desconectado', cls: 'text-gray-400' },
    progress: false,
  },
];

export default function FeedsPage() {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Meus Feeds RSS</CardTitle>
        <Button size="sm">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Novo Feed
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {feedsData.map((feed) => (
            <FeedCard key={feed.title} {...feed} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
