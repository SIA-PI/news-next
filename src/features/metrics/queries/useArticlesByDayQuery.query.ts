import { useQuery } from '@tanstack/react-query';
import { getArticlesByDay } from '../services';

export const useArticlesByDayQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ['metrics', 'articlesByDay'],
    queryFn: () => getArticlesByDay({ days: 7 }),
    enabled: enabled,
  });
};
