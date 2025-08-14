const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const FEEDS_BASE_URL =
  process.env.NEXT_PUBLIC_FEEDS_BASE_URL ?? `${BASE_URL}/news`;

export const endpoints = {
  news: {
    list: () => `${BASE_URL}/news`,
    byId: (id: string) => `${BASE_URL}/news/${id}`,
    feeds: {
      list: () => `${FEEDS_BASE_URL}/feeds`,
      create: () => `${FEEDS_BASE_URL}/feeds`,
      update: (id: string) => `${FEEDS_BASE_URL}/feeds/${id}`,
      delete: (id: string) => `${FEEDS_BASE_URL}/feeds/${id}`,
      byId: (id: string) => `${FEEDS_BASE_URL}/feeds/${id}`,
    },
    articles: {
      list: () => `${FEEDS_BASE_URL}/articles`,
    }
  },
};