export interface FeedsActiveResponse {
  count: number;
  total: number;
  timestamp: string;
}

export interface ArticlesTodayResponse {
  count: number;
  date: string;
}

export interface WebhooksResponse {
  count: number;
  items: unknown[];
}

export interface UptimeResponse {
  uptimeSeconds: number;
  startedAt: string;
  timestamp: string;
}

export interface FeedsByCategoryItem {
  category: string;
  count: number;
}

export interface ArticlesByDayResponse {
  series: { date: string; count: number }[];
  total: number;
}
