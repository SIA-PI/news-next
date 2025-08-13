import { useQuery } from '@tanstack/react-query';
import { getFeedsByCategory } from '../services';

export const useFeedsByCategoryQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ['metrics', 'feedsByCategory'],
    queryFn: getFeedsByCategory,
    enabled: enabled,
  });
};
