const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const endpoints = {
  auth: {
    login: () => `${BASE_URL}/news/auth/login`,
  },
};
