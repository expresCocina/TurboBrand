import type { Metadata, Viewport } from 'next';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import WhatsAppButton from '@/components/WhatsAppButton/WhatsAppButton';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import './globals.css';
import { LayoutWrapper } from './LayoutWrapper';

export const metadata: Metadata = {
  metadataBase: new URL('https://turbobrandcol.com'),
  title: {
    default: 'Turbo Brand | Agencia de Marketing Digital & Growth',
    template: '%s | Turbo Brand'
  },
  description: 'Agencia de Marketing 5.0 en Medellín. Especialistas en Pauta Digital, SEO, Diseño Web y Growth Hacking. Escalamos marcas con Inteligencia Artificial.',
  keywords: ['marketing digital', 'agencia marketing medellin', 'pauta digital', 'SEO', 'diseño web', 'growth marketing', 'agencia digital colombia', 'publicidad online'],
  authors: [{ name: 'Turbo Brand', url: 'https://turbobrandcol.com' }],
  creator: 'Turbo Brand',
  publisher: 'Turbo Brand',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Turbo Brand | Agencia de Marketing Digital & Growth',
    description: 'Transformamos tu negocio con estrategias de marketing digital de alto impacto e inteligencia artificial. ¡Resultados reales!',
    url: 'https://turbobrandcol.com',
    siteName: 'Turbo Brand',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: '/LogoTurboBrand.webp',
        width: 1200,
        height: 630,
        alt: 'Turbo Brand Agencia Digital'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turbo Brand | Marketing Digital 5.0',
    description: 'Agencia líder en crecimiento digital en Medellín. Descubre el poder del Marketing 5.0.',
    images: ['/LogoTurboBrand.webp'],
    creator: '@turbobrandcol',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#9E0060',
  colorScheme: 'dark',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MarketingAgency',
  name: 'Turbo Brand',
  image: 'https://turbobrandcol.com/LogoTurboBrand.webp',
  description: 'Agencia de Marketing 5.0 impulsada por inteligencia artificial en Medellín.',
  url: 'https://turbobrandcol.com',
  telephone: '+573138537261',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Carrera 43 A # 16 sur 245, piso 3',
    addressLocality: 'Medellín',
    addressRegion: 'Antioquia',
    postalCode: '050022',
    addressCountry: 'CO'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 6.1969,
    longitude: -75.5739
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    opens: "08:00",
    closes: "18:00"
  },
  sameAs: [
    'https://www.instagram.com/turbobrandcol',
    'https://www.facebook.com/turbobrandcolombia'
  ],
  priceRange: '$$'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <GoogleAnalytics gaId="G-XYZ1234567" />
        <GoogleTagManager gtmId="GTM-XYZ12345" />
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1234567890');
              fbq('track', 'PageView');
            `,
          }}
        />
        <Script
          id="google-site-verification"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                // Google Search Console Verification Script (if needed via JS, though meta tag is better)
              `
          }}
        />
        <Script
          id="waas-lock"
          src="https://amcagencyweb.com/waas-lock.js?domain=https://www.turbobrandcol.com/"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
