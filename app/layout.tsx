import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { AuthProvider } from '@/lib/context';

export const metadata: Metadata = {
  title: 'MindMate AI — Kampanye Kesehatan Mental Mahasiswa',
  description: 'Sahabat terbaik mahasiswa untuk curhat anonim, latihan napas praktis, journal emosi, dan task-breaker bebas stress.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id">
      <body suppressHydrationWarning className="antialiased font-sans bg-calm-bg text-calm-text-primary">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
