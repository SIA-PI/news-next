import { endpoints } from '@/features/news/endpoints';
import { api } from '@/lib/http-client';
import { ListFeedsItem } from '../types';

export async function listFeeds() {
  const { data } = await api.get<ListFeedsItem[]>(endpoints.news.feeds.list());
  return data;
}
