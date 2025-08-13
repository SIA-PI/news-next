import AuthProvider from '@/components/providers/AuthProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'NewsPulse Dashboard',
  description: 'Sua plataforma inteligente de gerenciamento de feeds RSS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={spaceGrotesk.variable}
      suppressHydrationWarning
    >
      <AuthProvider>
        <QueryProvider>
          <body>
            <ThemeProvider>
              {children}
              <Toaster richColors />
              <div id="modal-root"></div>
            </ThemeProvider>
          </body>
        </QueryProvider>
      </AuthProvider>
    </html>
  );
}