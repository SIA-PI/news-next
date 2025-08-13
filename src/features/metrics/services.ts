import { api } from '@/lib/http-client';
import { metricsEndpoints } from './endpoints';
import {
  ArticlesByDayResponse,
  ArticlesTodayResponse,
  FeedsActiveResponse,
  FeedsByCategoryItem,
  UptimeResponse,
  WebhooksResponse
} from './types';


async function authHeaders() {
  if (typeof window === 'undefined') return {};
  const { getSession } = await import('next-auth/react');
  const session = await getSession();
  return session?.accessToken
    ? { Authorization: `Bearer ${session.accessToken}`, Accept: 'application/json' }
    : { Accept: 'application/json' };
}

export async function getFeedsActive() {
  const headers = await authHeaders();
  const { data } = await api.get<FeedsActiveResponse>(metricsEndpoints.feedsActive(), { headers });
  return data;
}

export async function getArticlesToday(params?: { tz?: string }) {
  const headers = await authHeaders();
  const { data } = await api.get<ArticlesTodayResponse>(metricsEndpoints.articlesToday(params), { headers });
  return data;
}

export async function getWebhooks() {
  const headers = await authHeaders();
  const { data } = await api.get<WebhooksResponse>(metricsEndpoints.webhooks(), { headers });
  return data;
}

export async function getUptime() {
  const headers = await authHeaders();
  const { data } = await api.get<UptimeResponse>(metricsEndpoints.uptime(), { headers });
  return data;
}

export async function getFeedsByCategory() {
  const headers = await authHeaders();
  const { data } = await api.get<FeedsByCategoryItem[]>(metricsEndpoints.feedsByCategory(), { headers });
  return data;
}

export async function getArticlesByDay(params?: { days?: number; from?: string; to?: string; feedId?: string; tz?: string }) {
  const headers = await authHeaders();
  const { data } = await api.get<ArticlesByDayResponse>(metricsEndpoints.articlesByDay(params), { headers });
  return data;
}


