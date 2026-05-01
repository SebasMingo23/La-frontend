/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'
const WP_URL = (process.env.NEXT_PUBLIC_WP_URL ?? 'https://backoffice.187.77.251.126.nip.io').replace(/\/$/, '')

const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },

  // ─── Redirects admin WP ──────────────────────────────────────────────────
  async redirects() {
    return [
      {
        source: '/wp-admin',
        destination: `${WP_URL}/wp-admin/`,
        permanent: true,
      },
      {
        source: '/wp-admin/:path*',
        destination: `${WP_URL}/wp-admin/:path*`,
        permanent: true,
      },
      {
        source: '/wp-login.php',
        destination: `${WP_URL}/wp-login.php`,
        permanent: true,
      },
    ]
  },

  // ─── Security Headers ─────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Desactiva el prefetch de DNS para dominios de terceros
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // Bloquea cualquier intento de embeber el sitio en un iframe (clickjacking)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Impide que el browser "adivine" el MIME type
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Referrer limitado — no filtra la URL completa a terceros
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Deshabilita APIs de hardware no necesarias
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          // HSTS — fuerza HTTPS durante 1 año con preload
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // CSP — estricta en producción, ampliada en desarrollo
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              isDev
                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"  // unsafe-eval solo para HMR en dev
                : "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              [
                "img-src 'self' data: blob:",
                "https://api.loteriadeanimales.com.py",
                "https://backoffice.187.77.251.126.nip.io",
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com",
                "https://*.basemaps.cartocdn.com",
                isDev ? "http://loteria-animales.local http://localhost:3000" : "",
              ].filter(Boolean).join(' '),
              "media-src 'self'",
              "font-src 'self'",
              [
                "connect-src 'self'",
                "https://api.loteriadeanimales.com.py",
                "https://backoffice.187.77.251.126.nip.io",
                isDev ? "http://loteria-animales.local http://localhost:3000" : "",
              ].filter(Boolean).join(' '),
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },

  // ─── Next.js Image — dominios permitidos ─────────────────────────────────
  images: {
    remotePatterns: [
      // Producción
      {
        protocol: 'https',
        hostname: 'api.loteriadeanimales.com.py',
      },
      // Staging (nip.io) — remover tras el pase a producción
      {
        protocol: 'https',
        hostname: 'backoffice.187.77.251.126.nip.io',
      },
      // Vercel Blob — mantener hasta migrar todas las imágenes al VPS
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
      // Desarrollo local — Local by Flywheel
      {
        protocol: 'http',
        hostname: 'loteria-animales.local',
      },
      // Desarrollo local — Docker
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
}

export default nextConfig
