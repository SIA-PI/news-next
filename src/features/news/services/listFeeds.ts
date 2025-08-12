import { api } from '@/lib/http-client';
import { endpoints } from '@/features/news/endpoints';

export interface ListFeedsItem {
  id: string;
  name?: string;
  url: string;
  status: 'ACTIVE' | 'PAUSED' | string;
  interval: string;
  createdAt: string;
  updatedAt: string;
}

export async function listFeeds() {
  const { data } = await api.get<ListFeedsItem[]>(endpoints.news.feeds.list());
  return data;
}


