import { useQuery } from '@tanstack/react-query';
import { getWebhooks } from '../services';

export const useWebhooksQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ['metrics', 'webhooks'],
    queryFn: getWebhooks,
    enabled: enabled,
  });
};
