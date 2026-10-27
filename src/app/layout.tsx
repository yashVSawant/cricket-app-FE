import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/components/providers/StoreProvider';

export const metadata: Metadata = {
  title: 'CricketHub | Cricket Tournament & Scoring Platform',
  description:
    'Production-grade cricket platform for managing tournaments, real-time ball-by-ball scoring, live socket updates, and leaderboards.',
  keywords: [
    'Cricket',
    'Tournaments',
    'Live Scoring',
    'Ball by Ball',
    'Cricket Stats',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
