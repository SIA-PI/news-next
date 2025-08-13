import { api } from '@/lib/http-client';
import { endpoints } from '@/features/news/endpoints';

export async function deleteFeed(id: string) {
  await api.delete(endpoints.news.feeds.delete(id));
}


