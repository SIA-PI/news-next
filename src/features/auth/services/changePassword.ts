import { api } from '@/lib/http-client';
import { endpoints } from '../endpoints';
import { ChangePasswordCredentials } from '../types';

export const changePassword = async (
  credentials: ChangePasswordCredentials,
) => {
  const { data } = await api.post(endpoints.auth.changePassword(), credentials);
  return data;
};
