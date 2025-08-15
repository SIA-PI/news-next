import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../services/changePassword';
import { ChangePasswordCredentials } from '../types';

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (credentials: ChangePasswordCredentials) =>
      changePassword(credentials),
  });
};
