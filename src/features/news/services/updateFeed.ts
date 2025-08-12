import { api } from '@/lib/http-client';
import { endpoints } from '@/features/news/endpoints';

export interface UpdateFeedRequest {
  name?: string;
  url?: string;
  interval?: string;
  status?: string;
}

export interface UpdateFeedResponse {
  id: string;
  name?: string;
  url: string;
  status: string;
  interval: string;
  createdAt: string;
  updatedAt: string;
}

export async function updateFeed(id: string, payload: UpdateFeedRequest) {
  const { data } = await api.put<UpdateFeedResponse>(
    endpoints.news.feeds.update(id),
    payload,
    { headers: { 'Content-Type': 'application/json' } },
  );
  return data;
}


