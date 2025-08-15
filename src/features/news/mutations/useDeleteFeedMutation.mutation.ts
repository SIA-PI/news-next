import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFeed } from '../services/deleteFeed';

export const useDeleteFeedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFeed(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['feeds', 'list'] }),
  });
};
