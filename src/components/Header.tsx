'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { PageMetaType } from '@/types';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';

const pageMeta: Record<string, PageMetaType> = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Visão geral da sua plataforma RSS',
  },
  '/generator': {
    title: 'Gerador RSS',
    subtitle: 'Crie novos feeds personalizados',
  },
  '/feeds': {
    title: 'Feeds',
    subtitle: 'Visualize ou crie novos feeds personalizados',
  },
  '/settings': {
    title: 'Configurações',
    subtitle: 'Modifique as suas configurações',
  },
  '/help': {
    title: 'Ajuda',
    subtitle: 'Veja perguntas frequentes ou solicite suporte',
  },
};

interface HeaderProps {
  online: boolean;
}

export default function Header({ online }: HeaderProps) {
  const pathname = usePathname();
  const meta = pageMeta[pathname] || pageMeta['/dashboard'];

  return (
    <header className="glassmorphism border-b border-white/10 p-6 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{meta.title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{meta.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* <div className="relative">
            <button className="glassmorphism p-3 rounded-xl relative">
              <FontAwesomeIcon icon={faBell} className="text-gray-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full notification-dot" />
            </button>
          </div> */}
          <div className="glassmorphism px-4 py-2 rounded-xl">
            <span className="text-sm font-medium">Status: </span>
            <span className={online ? 'text-green-400' : 'text-yellow-400'}>
              {online ? 'Online' : 'Instável'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
