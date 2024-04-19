import { Header } from '@/components';
import { type Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/globals.css';
import '@/custom.scss';
import { type ReactElement } from 'react';
import { Container } from 'react-bootstrap';
import Providers from './Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Website',
  description: 'Generated by create next app',
  icons: {
    icon: '/favicon.ico?v=2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement {
  return (
    <Providers>
      <html lang="en" data-bs-theme="dark">
        <body className={inter.className}>
          <Header />
          <main>
            <Container>{children}</Container>
          </main>
        </body>
      </html>
    </Providers>
  );
}
