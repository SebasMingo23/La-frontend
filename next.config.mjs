/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
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
          // CSP — whitelist estricta de orígenes permitidos
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",   // requerido por Next.js inline hydration
              "style-src 'self' 'unsafe-inline'",    // requerido por Tailwind
              "img-src 'self' data: blob: https://api.loteriadeanimales.com.py https://api.187.77.251.126.nip.io https://hebbkx1anhila5yf.public.blob.vercel-storage.com",
              "media-src 'self'",
              "font-src 'self'",
              "connect-src 'self' https://api.loteriadeanimales.com.py https://api.187.77.251.126.nip.io",
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
        hostname: 'api.187.77.251.126.nip.io',
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
