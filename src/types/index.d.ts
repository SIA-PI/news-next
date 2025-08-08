import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface MenuItemType {
  to?: string
  icon?: IconProp
  label?: string
  badge?: string
  chip?: string
  chipColor?: string
  divider?: boolean
}

export interface PageMetaType {
  title: string
  subtitle: string
}

export interface FeedItemType {
  title: string
  count: number
  icon: IconProp
  bg: string
  text: string
  status: {
    text: string
    cls: string
    icon: IconProp
  }
  last: string
  webhook: {
    text: string
    cls: string
  }
  progress: boolean
}

export interface StatCardType {
  icon: IconProp
  bg: string
  text: string
  value: string
  label: string
  trend: string
}

export interface ActivityItemType {
  icon: IconProp
  bg: string
  text: string
  title: string
  time: string
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  tension?: number;
  fill?: boolean;
}

export interface ChartDataType {
  labels: string[];
  datasets: ChartDataset[];
}

export interface AutomationCardType {
  icon: IconProp
  bg: string
  text: string
  title: string
  desc: string
}

export interface AutomationFlowType {
  title: string
  status: [string, string]
  last: string
  today: number
  icon: IconProp
  gradient: string
}