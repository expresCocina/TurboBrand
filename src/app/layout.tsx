import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Turbo Brand | Agencia de Marketing Digital & Growth',
  description: 'Somos una agencia de Marketing 5.0 impulsada por inteligencia artificial, escalamos marcas de comercio online y proyectos de alto impacto.',
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
