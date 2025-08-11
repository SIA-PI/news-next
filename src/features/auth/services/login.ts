import { signIn } from 'next-auth/react';
import { LoginCredentials } from '../types';

export const login = async (credentials: LoginCredentials) => {
  const result = await signIn('credentials', {
    redirect: false,
    email: credentials.email,
    password: credentials.password,
  });

  if (!result?.ok) {
    throw new Error('Credenciais inválidas. Por favor, tente novamente.');
  }

  return result;
};
