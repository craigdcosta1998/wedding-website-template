// ABOUTME: Root layout that provides base HTML structure and global styles
import type { Metadata } from 'next';
import { Petit_Formal_Script } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { WEDDING_CONFIG } from '@/config/wedding';
import './globals.css';

const petitFormalScript = Petit_Formal_Script({
  variable: '--font-body',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const metadataTitle = `${WEDDING_CONFIG.coupleNames} | ${WEDDING_CONFIG.weddingMonthYear}`;
const metadataDescription = `Join us for our wedding celebration in ${WEDDING_CONFIG.location}`;

export const metadata: Metadata = {
  title: 'T & C',
  description: metadataDescription,
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: metadataTitle,
    description: metadataDescription,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${petitFormalScript.variable} antialiased min-h-screen`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
