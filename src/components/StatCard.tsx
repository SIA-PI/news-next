import { Card, CardContent } from '@/components/ui/Card';
import { StatCardType } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function StatCard({
  icon,
  bg,
  text,
  value,
  label,
  trend,
}: StatCardType) {
  return (
    <Card className="stat-card">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}
          >
            <FontAwesomeIcon icon={icon} className={`${text} text-xl`} />
          </div>
          <span className="text-xs text-green-400">{trend}</span>
        </div>
        <h3 className="text-2xl font-bold mb-1">{value}</h3>
        <p className="text-gray-400 text-sm">{label}</p>
      </CardContent>
    </Card>
  );
}
