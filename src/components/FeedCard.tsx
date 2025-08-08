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
              <h4 className="font-semibold text-[rgb(var(--text-primary))]">{title}</h4>
              <p className="text-sm text-[rgb(var(--text-muted))]">{count} artigos hoje</p>
            </div>
          </div>
          <button className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))] transition-colors">
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[rgb(var(--text-muted))]">Status:</span>
            <span className={`${status.cls} flex items-center gap-1`}>
              <FontAwesomeIcon icon={status.icon} className="text-xs" />
              {status.text}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[rgb(var(--text-muted))]">Última atualização:</span>
            <span className="text-[rgb(var(--text-primary))]">{last}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[rgb(var(--text-muted))]">Webhook:</span>
            <span className={webhook.cls}>{webhook.text}</span>
          </div>
        </div>
        {progress ? (
          <div className="progress-bar h-1 rounded-full mt-4" />
        ) : (
          <div className="bg-[rgb(var(--muted))] h-1 rounded-full mt-4" />
        )}
      </CardContent>
    </Card>
  );
}
