"use client";

import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ActivityItemType, ChartDataType, StatCardType } from '@/types';
import {
  faCheckCircle,
  faDownload, faLink,
  faPlus,
  faRobot,
  faRss,
  faSync
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  getArticlesByDay,
  getArticlesToday,
  getFeedsActive,
  getFeedsByCategory,
  getUptime,
  getWebhooks,
} from '@/features/metrics/services';

import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  LineElement, PointElement, LinearScale, CategoryScale,
  ArcElement, Tooltip, Legend
);

function formatNumber(n: number | undefined): string {
  if (n === undefined || n === null) return '—';
  return new Intl.NumberFormat('pt-BR').format(n);
}

const recentActivities: ActivityItemType[] = [
    { icon: faPlus, bg: 'bg-green-500/20', text: 'text-green-500', title: 'Novo feed criado: "Tecnologia Brasil"', time: 'Há 2 minutos' },
    { icon: faSync, bg: 'bg-blue-500/20', text: 'text-blue-500', title: 'Feed atualizado: 156 novos artigos', time: 'Há 5 minutos' },
    { icon: faRobot, bg: 'bg-purple-500/20', text: 'text-purple-500', title: 'Automação executada com sucesso', time: 'Há 10 minutos' },
];

function toLineData(series: { date: string; count: number }[] | undefined): ChartDataType {
  const labels = (series ?? []).map((p) => new Date(p.date).toLocaleDateString('pt-BR', { weekday: 'short' }));
  const data = (series ?? []).map((p) => p.count);
  return {
    labels,
    datasets: [
      {
        label: 'Artigos',
        data,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
}

function toDoughnutData(items: { category: string; count: number }[] | undefined): ChartDataType {
  const labels = (items ?? []).map((i) => i.category);
  const data = (items ?? []).map((i) => i.count);
  const palette = ['#6366f1', '#22d3ee', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f472b6'];
  const backgroundColor = labels.map((_, idx) => palette[idx % palette.length]);
  return {
    labels,
    datasets: [
      {
        label: 'Feeds por Categoria',
        data,
        backgroundColor,
        borderColor: 'transparent',
      },
    ],
  };
}

const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: { 
          display: false,
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: { 
          color: '#9ca3af',
          font: { size: 12 }
        },
      },
      y: {
        grid: { 
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: { 
          color: '#9ca3af',
          font: { size: 12 }
        },
      },
    },
};

const doughnutChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: { 
        color: '#9ca3af',
        font: { size: 12 },
        usePointStyle: true,
        padding: 20
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
    }
  },
};

export default function DashboardPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.stat-card').forEach((card, index) => {
        (card as HTMLElement).style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-slide-in');
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const { status } = useSession();
  const isAuthed = status === 'authenticated';

  const feedsActive = useQuery({
    queryKey: ['metrics', 'feedsActive'],
    queryFn: getFeedsActive,
    enabled: isAuthed,
  });
  const articlesToday = useQuery({
    queryKey: ['metrics', 'articlesToday'],
    queryFn: () => getArticlesToday(),
    enabled: isAuthed,
  });
  const webhooks = useQuery({
    queryKey: ['metrics', 'webhooks'],
    queryFn: getWebhooks,
    enabled: isAuthed,
  });
  const uptime = useQuery({
    queryKey: ['metrics', 'uptime'],
    queryFn: getUptime,
    enabled: isAuthed,
  });
  const feedsByCategory = useQuery({
    queryKey: ['metrics', 'feedsByCategory'],
    queryFn: getFeedsByCategory,
    enabled: isAuthed,
  });
  const articlesByDay = useQuery({
    queryKey: ['metrics', 'articlesByDay'],
    queryFn: () => getArticlesByDay({ days: 7 }),
    enabled: isAuthed,
  });

  const statCards: StatCardType[] = useMemo(() => {
    const uptimePct = (() => {
      const u = uptime.data;
      if (!u) return '—';
      const started = new Date(u.startedAt).getTime();
      const ts = new Date(u.timestamp).getTime();
      const total = Math.max(ts - started, 1);
      const pct = Math.min((u.uptimeSeconds * 1000) / total, 1) * 100;
      return `${pct.toFixed(1)}%`;
    })();

    return [
      {
        icon: faRss,
        bg: 'bg-[rgb(var(--primary))]/20',
        text: 'text-[rgb(var(--primary))]',
        value: formatNumber(feedsActive.data?.count),
        label: 'Feeds Ativos',
        trend: feedsActive.data ? `${feedsActive.data.count}/${feedsActive.data.total}` : '—',
      },
      {
        icon: faDownload,
        bg: 'bg-cyan-500/20',
        text: 'text-cyan-500',
        value: formatNumber(articlesToday.data?.count),
        label: 'Artigos Hoje',
        trend: articlesToday.data?.date ?? '—',
      },
      {
        icon: faLink,
        bg: 'bg-purple-500/20',
        text: 'text-purple-500',
        value: formatNumber(webhooks.data?.count),
        label: 'Webhooks',
        trend: '+0%'
      },
      {
        icon: faCheckCircle,
        bg: 'bg-green-500/20',
        text: 'text-green-500',
        value: '100%'
        ,
        label: 'Uptime',
        trend: uptimePct,
      },
    ];
  }, [feedsActive.data, articlesToday.data, webhooks.data, uptime.data]);

  const lineData = useMemo(() => toLineData(articlesByDay.data?.series), [articlesByDay.data]);
  const doughnutData = useMemo(() => toDoughnutData(Array.isArray(feedsByCategory.data) ? feedsByCategory.data : (feedsByCategory.data as any)?.items), [feedsByCategory.data]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(card => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Artigos por Dia</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <Line data={lineData} options={lineChartOptions} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feeds por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <Doughnut data={doughnutData} options={doughnutChartOptions} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivities.map((item) => (
            <div key={item.title} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
              <div className={`w-8 h-8 ${item.bg} rounded-full flex items-center justify-center`}>
                <FontAwesomeIcon icon={item.icon} className={`${item.text} text-sm`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[rgb(var(--text-primary))]">{item.title}</p>
                <p className="text-[rgb(var(--text-muted))] text-sm">{item.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}