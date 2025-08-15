import { api } from '@/lib/http-client';
import { endpoints } from '@/features/news/endpoints';
import { CreateFeedRequest, CreateFeedResponse } from '../types';

export async function createFeed(payload: CreateFeedRequest) {
  const { data } = await api.post<CreateFeedResponse>(
    endpoints.news.feeds.create(),
    payload,
  );
  return data;
}