import { api } from '@/lib/http-client';
import { endpoints } from '@/features/news/endpoints';
import { Feed } from '../types';

export async function getFeedById(id: string) {
  const { data } = await api.get<Feed>(endpoints.news.feeds.byId(id));
  return data;
}
