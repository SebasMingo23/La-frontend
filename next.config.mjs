/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Assets estáticos de animales (Vercel Blob Storage — fallback local)
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
      // Staging (nip.io)
      {
        protocol: 'https',
        hostname: 'api.187.77.251.126.nip.io',
      },
      // Producción (descomentar cuando el DNS esté listo)
      // {
      //   protocol: 'https',
      //   hostname: 'api.loteriadeanimales.com.py',
      // },
      // Desarrollo local — Local by Flywheel
      {
        protocol: 'http',
        hostname: 'loteria-animales.local',
      },
      // Desarrollo local — Docker / puerto explícito
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
