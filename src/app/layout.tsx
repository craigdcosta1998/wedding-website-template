// ABOUTME: Root layout that provides base HTML structure and global styles
import type { Metadata } from 'next';
import { Oswald, Crimson_Text } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { WEDDING_CONFIG } from '@/config/wedding';
import './globals.css';

const oswald = Oswald({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const crimsonText = Crimson_Text({
  variable: '--font-handwritten',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const metadataTitle = `${WEDDING_CONFIG.coupleNames} | ${WEDDING_CONFIG.weddingMonthYear}`;
const metadataDescription = `Join us for our wedding celebration in ${WEDDING_CONFIG.location}`;

export const metadata: Metadata = {
  title: metadataTitle,
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
    <html suppressHydrationWarning>
      <body
        className={`${oswald.variable} ${crimsonText.variable} antialiased min-h-screen`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
