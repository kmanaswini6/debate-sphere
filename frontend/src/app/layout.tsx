import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import Providers from '@/components/Providers';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Debate Sphere',
  description: 'A premium AI-powered debate platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="bg-background text-text font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}