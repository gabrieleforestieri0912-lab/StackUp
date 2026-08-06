import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Analytics from '@/components/ui/Analytics';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || '';

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: 'StackUp Room | Master Your Code',
    template: '%s | StackUp Room',
  },
  description:
    'La community dove imparare a programmare sul serio. Corsi di React, Next.js, Node.js, Python, TypeScript e tanto altro con mentorship 1:1.',
  icons: {
    icon: [{ url: '/stackup.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'StackUp Room',
    title: 'StackUp Room | Master Your Code',
    description:
     'La community dove imparare a programmare sul serio. Corsi di React, Next.js, Node.js, Python, TypeScript e tanto altro con mentorship 1:1.',
    images: [{ url: '/stackup-og.svg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StackUp Room | Master Your Code',
    description:
     'La community dove imparare a programmare sul serio. Corsi di React, Next.js, Node.js, Python, TypeScript e tanto altro con mentorship 1:1.',
    images: ['/stackup-og.svg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#ea580c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${jetbrainsMono.variable}`}
    >
      <body className="antialiased h-full min-h-full bg-black text-zinc-100 overflow-x-hidden w-full max-w-100vw">
        <Analytics />
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

