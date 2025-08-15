import { useQuery } from '@tanstack/react-query';
import { getUptime } from '../services';

export const useUptimeQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ['metrics', 'uptime'],
    queryFn: getUptime,
    enabled: enabled,
  });
};
