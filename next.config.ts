import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 año — máximo caché para imágenes optimizadas
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'react-icons',
      'recharts',
    ],
  },
  // Headers HTTP de caché largo plazo — soluciona "Use efficient cache policy" de Lighthouse
  async headers() {
    const longCache = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ];
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ];

    return [
      // Assets JS/CSS del build de Next.js — hash en filename, inmutables
      { source: '/_next/static/:path*', headers: longCache },
      // Imágenes optimizadas por Next Image
      { source: '/_next/image', headers: longCache },
      // Assets del /public — separados por extensión (Next.js no soporta grupos de captura)
      { source: '/:path*.jpg', headers: longCache },
      { source: '/:path*.jpeg', headers: longCache },
      { source: '/:path*.png', headers: longCache },
      { source: '/:path*.webp', headers: longCache },
      { source: '/:path*.avif', headers: longCache },
      { source: '/:path*.gif', headers: longCache },
      { source: '/:path*.svg', headers: longCache },
      { source: '/:path*.ico', headers: longCache },
      { source: '/:path*.woff', headers: longCache },
      { source: '/:path*.woff2', headers: longCache },
      { source: '/:path*.ttf', headers: longCache },
      { source: '/:path*.otf', headers: longCache },
      // Páginas — headers de seguridad
      { source: '/(.*)', headers: securityHeaders },
    ];
  },
};

export default nextConfig;
