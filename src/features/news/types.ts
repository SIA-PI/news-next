export type CronExpression = string;

export interface Feed {
  id?: string;
  name: string;
  url: string;
  interval: CronExpression;
  [key: string]: unknown;
}


