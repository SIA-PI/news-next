export interface Feed {
  id?: string;
  name: string;
  url: string;
  interval: string;
  status: 'ACTIVE' | 'PAUSED' | string;
  category: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface ListFeedsParams {
  page?: number;
  limit?: number;
  search?: string;
  disabled?: boolean;
}

export interface CreateFeedRequest {
  name: string;
  url: string;
  interval: string; // e.g. cron expression "0 * * * *"
  category: string;
  // userId: string;
}

export interface CreateFeedResponse {
  id?: string;
  name: string;
  url: string;
  interval: string;
  // include any fields your backend returns; kept flexible
  [key: string]: unknown;
}

export interface ListFeedsItem {
  id: string;
  name?: string;
  url: string;
  status: 'ACTIVE' | 'PAUSED' | string;
  interval: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  summary: string;
  feedId: string;
  createdAt: string;
  updatedAt: string;
}
