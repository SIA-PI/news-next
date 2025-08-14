import { FeedItemType } from '@/types';
import { faEllipsisV, faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardContent } from './ui/Card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/DropdownMenu';

type FeedCardProps = FeedItemType & {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
};

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
  onEdit,
  onDelete,
  onView,
}: FeedCardProps) {
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
              <h4 className="font-semibold text-[rgb(var(--text-primary))]">
                {title}
              </h4>
              {/* <p className="text-sm text-[rgb(var(--text-muted))]">
                {count} artigos hoje
              </p> */}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))] transition-colors">
              <FontAwesomeIcon icon={faEllipsisV} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[rgb(var(--muted))] border-[rgb(var(--border))]"
            >
              {onView && (
                <DropdownMenuItem onClick={onView} className="cursor-pointer">
                  <FontAwesomeIcon icon={faEye} className="mr-2" />
                  Visualizar
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                  <FontAwesomeIcon icon={faPen} className="mr-2" />
                  Editar
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                onClick={onDelete}
                className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
            <span className="text-[rgb(var(--text-muted))]">
              Última atualização:
            </span>
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
