import { useQuery } from '@tanstack/react-query';
import { getArticlesToday } from '../services';

export const useArticlesTodayQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ['metrics', 'articlesToday'],
    queryFn: () => getArticlesToday(),
    enabled: enabled,
  });
};
