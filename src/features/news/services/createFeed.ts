import { api } from '@/lib/http-client';
import { endpoints } from '@/features/news/endpoints';

export interface CreateFeedRequest {
  name: string;
  url: string;
  interval: string; // e.g. cron expression "0 * * * *"
}

export interface CreateFeedResponse {
  id?: string;
  name: string;
  url: string;
  interval: string;
  // include any fields your backend returns; kept flexible
  [key: string]: unknown;
}

export async function createFeed(payload: CreateFeedRequest) {
  const { data } = await api.post<CreateFeedResponse>(
    endpoints.news.feeds.create(),
    payload,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
  return data;
}


