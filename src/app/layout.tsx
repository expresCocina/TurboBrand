import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Outfit } from 'next/font/google';
import './globals.css';
import { LayoutWrapper } from './LayoutWrapper';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://turbobrandcol.com'),
  title: {
    default: 'Turbo Brand | Agencia de Marketing Digital en Medellín, Colombia',
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
    title: 'Turbo Brand | Agencia de Marketing Digital en Medellín',
    description: 'Agencia de marketing 5.0 en Medellín. Escalamos marcas con Meta Ads, Google Ads, SEO local y automatización. Resultados reales desde el primer mes.',
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
    title: 'Turbo Brand | Marketing Digital Medellín',
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
    'https://www.facebook.com/profile.php?id=61550874818448'
  ],
  priceRange: '$$'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={outfit.variable}>
      <head>
        {/* Preconnect solo a dominios críticos de renderizado — ELIMINA 600ms de render-blocking */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch para terceros que se cargarán después del load */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />

        {/* Preload imagen hero desktop — reduce LCP en desktop */}
        <link
          rel="preload"
          as="image"
          href="/fondohero.webp"
          type="image/webp"
          media="(min-width: 769px)"
          fetchPriority="high"
        />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={outfit.className}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>

        {/* Google Analytics — afterInteractive: se carga DESPUÉS de que la página es interactiva */}
        <Script
          id="ga-load"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-X8N3PJJCF8"
        />
        <Script
          id="ga-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-X8N3PJJCF8', { send_page_view: true });
            `,
          }}
        />

        {/* FB Pixel — lazyOnload: SOLO carga si el usuario hace scroll o espera */}
        <Script
          id="fb-pixel"
          strategy="lazyOnload"
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
              fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID || ""}');
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* Button tracking — lazyOnload */}
        <Script
          id="button-tracking"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function trackButtonClick(button) {
                  var buttonText = button.innerText || button.textContent || button.value || 'Unknown Button';
                  var buttonId = button.id || 'no-id';
                  var buttonHref = button.href || button.getAttribute('href') || '';
                  if (typeof gtag !== 'undefined') {
                    gtag('event', 'button_click', {
                      'event_category': 'Button',
                      'event_label': buttonText,
                      'button_id': buttonId,
                      'button_href': buttonHref
                    });
                  }
                  if (typeof fbq !== 'undefined') {
                    fbq('trackCustom', 'ButtonClick', {
                      button_text: buttonText,
                      button_id: buttonId,
                      button_href: buttonHref
                    });
                  }
                }
                document.addEventListener('click', function(e) {
                  var target = e.target;
                  while (target && target !== document) {
                    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.getAttribute('role') === 'button') {
                      trackButtonClick(target);
                      break;
                    }
                    target = target.parentElement;
                  }
                }, true);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
