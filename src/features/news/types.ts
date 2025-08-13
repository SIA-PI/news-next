export type CronExpression = string;

export interface Feed {
  id?: string;
  name: string;
  url: string;
  interval: CronExpression;
  [key: string]: unknown;
}

export interface ListFeedsParams {
  page?: number;
  limit?: number;
  search?: string;
  disabled?: boolean;
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
