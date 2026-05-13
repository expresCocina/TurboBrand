import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
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
  // Turbopack config (Next.js 16+ usa Turbopack por defecto)
  turbopack: {},
  // Headers HTTP de caché a largo plazo — soluciona "Use efficient cache policy"
  async headers() {
    const longCache = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ];
    const shortCache = [
      { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
    ];
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ];

    return [
      // Assets estáticos del build — inmutables (hash en nombre)
      { source: '/_next/static/:path*', headers: longCache },
      // Imágenes optimizadas
      { source: '/_next/image', headers: shortCache },
      // Assets públicos por extensión
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
      // Páginas HTML — security headers
      { source: '/(.*)', headers: securityHeaders },
    ];
  },
};

export default nextConfig;
