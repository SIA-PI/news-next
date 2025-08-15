import { useQuery } from '@tanstack/react-query';
import { getFeedById } from '../services/getFeedById';

export const useFeedByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['feeds', id],
    queryFn: () => getFeedById(id),
    enabled: !!id,
  });
};
