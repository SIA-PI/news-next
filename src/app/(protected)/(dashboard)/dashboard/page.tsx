"use client";

import { useEffect } from 'react';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  StatCardType,
  ActivityItemType,
  ChartDataType,
} from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRss, faDownload, faLink, faCheckCircle,
  faPlus, faSync, faRobot
} from '@fortawesome/free-solid-svg-icons';
import { Line, Doughnut } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  LineElement, PointElement, LinearScale, CategoryScale,
  ArcElement, Tooltip, Legend
);

// --- Dados Mockados (sem alterações) ---
const statCards: StatCardType[] = [
    { icon: faRss, bg: 'bg-indigo-500/20', text: 'text-indigo-400', value: '24', label: 'Feeds Ativos', trend: '+12%' },
    { icon: faDownload, bg: 'bg-cyan-500/20', text: 'text-cyan-400', value: '1.2K', label: 'Artigos Hoje', trend: '+5.2%' },
    { icon: faLink, bg: 'bg-purple-500/20', text: 'text-purple-400', value: '8', label: 'Webhooks', trend: '+8.1%' },
    { icon: faCheckCircle, bg: 'bg-green-500/20', text: 'text-green-400', value: '100%', label: 'Uptime', trend: '99.9%' }
];

const recentActivities: ActivityItemType[] = [
    { icon: faPlus, bg: 'bg-green-500/20', text: 'text-green-400', title: 'Novo feed criado: "Tecnologia Brasil"', time: 'Há 2 minutos' },
    { icon: faSync, bg: 'bg-blue-500/20', text: 'text-blue-400', title: 'Feed atualizado: 156 novos artigos', time: 'Há 5 minutos' },
    { icon: faRobot, bg: 'bg-purple-500/20', text: 'text-purple-400', title: 'Automação executada com sucesso', time: 'Há 10 minutos' },
];

const lineData: ChartDataType = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
  datasets: [{
    label: 'Artigos',
    data: [320, 450, 380, 520, 610, 890, 1200],
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    tension: 0.4,
    fill: true,
  }],
};

const doughnutData: ChartDataType = {
    labels: ['Tecnologia', 'Negócios', 'Esportes', 'Saúde', 'Outros'],
    datasets: [{
      label: 'Feeds por Categoria',
      data: [35, 25, 15, 15, 10],
      backgroundColor: ['#6366f1', '#22d3ee', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderColor: 'transparent'
    }],
};

// --- CONFIGURAÇÃO DE ESTILO DOS GRÁFICOS ---
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
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#9ca3af' },
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
      labels: { color: '#9ca3af' },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
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
            <Doughnut
              data={doughnutData}
              options={doughnutChartOptions}
            />
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
                <p className="font-medium">{item.title}</p>
                <p className="text-gray-400 text-sm">{item.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}