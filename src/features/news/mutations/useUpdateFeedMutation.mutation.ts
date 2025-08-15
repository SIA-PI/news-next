import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFeed } from '../services/updateFeed';

export const useUpdateFeedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        name?: string;
        url?: string;
        interval?: string;
        status?: string;
      };
    }) => updateFeed(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['feeds', 'list'] }),
  });
};
