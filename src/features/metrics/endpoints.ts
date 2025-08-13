const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const METRICS_BASE_URL =
  process.env.NEXT_PUBLIC_METRICS_BASE_URL ?? `${BASE_URL}/news/metrics`;

function withQuery(url: string, params?: Record<string, string | number | undefined>) {
  if (!params) return url;
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      usp.set(key, String(value));
    }
  });
  const qs = usp.toString();
  return qs ? `${url}?${qs}` : url;
}

export const metricsEndpoints = {
  feedsActive: () => `${METRICS_BASE_URL}/feeds/active`,
  articlesToday: (params?: { tz?: string }) => withQuery(`${METRICS_BASE_URL}/articles/today`, params),
  webhooks: () => `${METRICS_BASE_URL}/webhooks`,
  uptime: () => `${METRICS_BASE_URL}/uptime`,
  feedsByCategory: () => `${METRICS_BASE_URL}/feeds/by-category`,
  articlesByDay: (params?: { days?: number; from?: string; to?: string; feedId?: string; tz?: string }) =>
    withQuery(`${METRICS_BASE_URL}/articles/by-day`, params),
};


