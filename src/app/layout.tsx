import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from './Header';
import { Footer } from './Footer';
import { WebVitals } from './WebVitals';
import { CartButton } from '@/modules/cart/components/CartButton';
import { CartDrawer } from '@/modules/cart/components/CartDrawer';
import { getSiteUrl } from '@/shared/lib/siteUrl';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  // Resolves every relative canonical / Open Graph URL against the deployed domain.
  metadataBase: new URL(getSiteUrl()),
  title: 'Delosi E-commerce',
  description:
    'Plataforma de comercio electrónico de alto rendimiento - Evaluación Técnica Frontend Senior',
  openGraph: {
    siteName: 'Delosi E-commerce',
    locale: 'es_PE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <WebVitals />
        <Header>
          <CartButton />
        </Header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-6">{children}</main>

        <Footer />

        <CartDrawer />
      </body>
    </html>
  );
}
