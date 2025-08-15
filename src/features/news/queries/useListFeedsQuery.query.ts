import { useQuery } from '@tanstack/react-query';
import { listFeeds } from '../services/listFeeds';

export const useListFeedsQuery = () => {
  return useQuery({
    queryKey: ['feeds', 'list'],
    queryFn: listFeeds,
  });
};
