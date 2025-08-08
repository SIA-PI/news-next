import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from './ui/Button';

interface HelpCardProps {
  icon: IconProp;
  bg: string;
  text: string;
  title: string;
  desc: string;
  action: string;
}

export default function HelpCard({
  icon,
  bg,
  text,
  title,
  desc,
  action,
}: HelpCardProps) {
  return (
    <div className="feature-card rounded-xl p-6 text-center">
      <div
        className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
      >
        <FontAwesomeIcon icon={icon} className={`${text} text-2xl`} />
      </div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-gray-400 text-sm mb-4">{desc}</p>
      <Button variant="ghost" className={`${text} hover:opacity-80`}>
        {action}
      </Button>
    </div>
  );
}
