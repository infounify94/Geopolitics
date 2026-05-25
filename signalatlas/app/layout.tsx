import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'SignalAtlas — Geopolitics Research Intelligence',
    template: '%s | SignalAtlas',
  },
  description: 'Deep research on global events — conflicts, power networks, economic warfare, and the India angle. Evidence-based, confidence-scored intelligence.',
  keywords: ['geopolitics', 'research', 'intelligence', 'India', 'conflicts', 'sanctions', 'power networks'],
  openGraph: {
    type: 'website',
    siteName: 'SignalAtlas',
    title: 'SignalAtlas — Geopolitics Research Intelligence',
    description: 'Deep research on global events — conflicts, power networks, economic warfare, and the India angle.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SignalAtlas',
    description: 'Geopolitics research intelligence — evidence-based, confidence-scored.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
