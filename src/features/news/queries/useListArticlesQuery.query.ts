import { useQuery } from '@tanstack/react-query';
import { listArticles, ListArticlesParams } from '../services/listArticles';

export const useListArticlesQuery = (params: ListArticlesParams) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => listArticles(params),
    enabled: !!params.feedId,
  });
};
