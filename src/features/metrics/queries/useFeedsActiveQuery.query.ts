import { useQuery } from '@tanstack/react-query';
import { getFeedsActive } from '../services';

export const useFeedsActiveQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ['metrics', 'feedsActive'],
    queryFn: getFeedsActive,
    enabled: enabled,
  });
};
