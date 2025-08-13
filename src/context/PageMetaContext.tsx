'use client';

import { PageMetaType } from '@/types';
import { createContext, ReactNode, useContext, useState } from 'react';

interface PageMetaContextType {
  meta: PageMetaType;
  setMeta: (meta: PageMetaType) => void;
}

const PageMetaContext = createContext<PageMetaContextType | undefined>(
  undefined,
);

export const PageMetaProvider = ({ children }: { children: ReactNode }) => {
  const [meta, setMeta] = useState<PageMetaType>({
    title: 'Dashboard',
    subtitle: 'Visão geral da sua plataforma RSS',
  });

  return (
    <PageMetaContext.Provider value={{ meta, setMeta }}>
      {children}
    </PageMetaContext.Provider>
  );
};

export const usePageMeta = () => {
  const context = useContext(PageMetaContext);
  if (context === undefined) {
    throw new Error('usePageMeta must be used within a PageMetaProvider');
  }
  return context;
};
