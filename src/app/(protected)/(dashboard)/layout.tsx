'use client';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { PageMetaProvider, usePageMeta } from '@/context/PageMetaContext';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { ReactNode, useEffect, useState } from 'react';

config.autoAddCss = false;

function DashboardContent({ children }: { children: ReactNode }) {
  const { meta } = usePageMeta();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statusOnline] = useState(true);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="gradient-bg min-h-screen text-[rgb(var(--text-primary))] overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none"></div>

      <button
        aria-label="Abrir menu"
        onClick={() => setMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden glassmorphism p-3 rounded-xl text-[rgb(var(--text-primary))]"
      >
        <i className="fas fa-bars text-lg" />
      </button>

      <Sidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      <main className="lg:ml-72 min-h-screen">
        <Header
          online={statusOnline}
          title={meta.title}
          subtitle={meta.subtitle}
        />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

// Layout principal que exportamos
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <PageMetaProvider>
      <DashboardContent>{children}</DashboardContent>
    </PageMetaProvider>
  );
}
