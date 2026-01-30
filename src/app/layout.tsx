import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Turbo Brand | Agencia de Marketing Digital & Growth',
  description: 'Somos una agencia de Marketing 5.0 impulsada por inteligencia artificial, escalamos marcas de comercio online y proyectos de alto impacto.',
  keywords: ['marketing digital', 'agencia marketing', 'SEO', 'pauta digital', 'growth marketing', 'Medellín', 'Colombia'],
  authors: [{ name: 'Turbo Brand' }],
  openGraph: {
    title: 'Turbo Brand | Agencia de Marketing Digital & Growth',
    description: 'Agencia de Marketing 5.0 impulsada por IA',
    type: 'website',
    locale: 'es_CO',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#9E0060',
};

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
