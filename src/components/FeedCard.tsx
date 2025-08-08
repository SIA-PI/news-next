import { FeedItemType } from '@/types';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardContent } from './ui/Card';

export default function FeedCard({
  title,
  count,
  icon,
  bg,
  text,
  status,
  last,
  webhook,
  progress,
}: FeedItemType) {
  return (
    <Card className="glassmorphism-strong">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}
            >
              <FontAwesomeIcon icon={icon} className={text} />
            </div>
            <div>
              <h4 className="font-semibold">{title}</h4>
              <p className="text-sm text-gray-400">{count} artigos hoje</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white">
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Status:</span>
            <span className={`${status.cls} flex items-center gap-1`}>
              <FontAwesomeIcon icon={status.icon} className="text-xs" />
              {status.text}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Última atualização:</span>
            <span>{last}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Webhook:</span>
            <span className={webhook.cls}>{webhook.text}</span>
          </div>
        </div>
        {progress ? (
          <div className="progress-bar h-1 rounded-full mt-4" />
        ) : (
          <div className="bg-gray-600 h-1 rounded-full mt-4" />
        )}
      </CardContent>
    </Card>
  );
}
