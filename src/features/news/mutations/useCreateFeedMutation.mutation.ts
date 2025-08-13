import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFeed } from '../services/createFeed';

export const useCreateFeedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds', 'list'] });
    },
  });
};
