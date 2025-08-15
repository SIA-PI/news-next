'use client';

import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  online: boolean;
  title: string;
  subtitle: string;
}

export default function Header({ online, title, subtitle }: HeaderProps) {
  return (
    <header className="glassmorphism border-b border-[rgb(var(--border))]/20 p-6 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))]">
            {title}
          </h2>
          <p className="text-[rgb(var(--text-muted))] text-sm">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="glassmorphism px-4 py-2 rounded-xl">
            <span className="text-sm font-medium text-[rgb(var(--text-primary))]">
              Status:{' '}
            </span>
            <span className={online ? 'status-online' : 'status-offline'}>
              {online ? 'Online' : 'Instável'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
