import { signIn } from 'next-auth/react';
import { LoginCredentials } from '../types';

export const login = async (credentials: LoginCredentials) => {
  const result = await signIn('credentials', {
    redirect: true,
    callbackUrl: '/dashboard',
    username: credentials.username,
    password: credentials.password,
  });

  return result;
};