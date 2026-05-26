import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ScrollReveal from '@/components/ScrollReveal';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com'),
  title: {
    default: 'SignalAtlas — Global Geopolitical Intelligence Platform',
    template: '%s | SignalAtlas',
  },
  description: 'Data-driven geopolitical analysis, conflict monitoring, and strategic insights across 195 nations. Evidence-based intelligence reports with confidence scoring — covering wars, sanctions, power networks, and economic warfare.',
  keywords: [
    'geopolitical analysis', 'global conflict tracker', 'geopolitical intelligence',
    'conflict monitor', 'country risk analysis', 'sanctions tracker',
    'war tracker', 'India geopolitics', 'power networks', 'proxy wars',
    'economic warfare', 'strategic intelligence', 'global crises 2025',
  ],
  openGraph: {
    type: 'website',
    siteName: 'SignalAtlas',
    title: 'SignalAtlas — Global Geopolitical Intelligence Platform',
    description: 'Data-driven geopolitical analysis, conflict monitoring, and strategic insights across 195 nations.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SignalAtlas — Global Geopolitical Intelligence',
    description: 'Conflict tracking, country risk scores, and evidence-based strategic analysis.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${mono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
