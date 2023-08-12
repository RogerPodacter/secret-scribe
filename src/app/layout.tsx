import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';
import "./style.css"

export const metadata = {
  title: 'Secret Scribe',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
      </Head>
      <body>
        <link rel="preconnect" href="https://rsms.me/"></link>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
        
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
