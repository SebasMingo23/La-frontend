/**
 * GET /api/ganadores?limit=N
 *
 * BFF (Backend for Frontend) — actúa como proxy server-side hacia WordPress.
 *
 * Por qué existe este Route Handler:
 *   WinnersSection es un Client Component (usa framer-motion) que necesita
 *   datos de WordPress. Un Client Component NO puede llamar directamente a
 *   api.* porque:
 *     1. El browser lanza la petición → CORS (origen distinto).
 *     2. Expone la URL interna del backend al cliente.
 *   La solución correcta (CLAUDE.md §10) es que el Client Component llame
 *   a /api/ganadores (mismo origen, sin CORS) y este Route Handler llame
 *   a WordPress server-side.
 */

import { NextRequest, NextResponse } from 'next/server'

// En Docker, el frontend puede llamar a WordPress directamente por nombre de servicio
// (red interna, sin pasar por Traefik). Se configura con WORDPRESS_INTERNAL_URL
// en el docker-compose. Si no está definida, cae a la URL pública.
const WORDPRESS_API =
  process.env.WORDPRESS_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost/wp-json/la/v1'

export async function GET(request: NextRequest) {
  const limit = request.nextUrl.searchParams.get('limit') ?? '6'

  try {
    const res = await fetch(
      `${WORDPRESS_API}/ganadores?limit=${limit}`,
      {
        next: { revalidate: 120 },                 // 2 min cache en el BFF
        signal: AbortSignal.timeout(8_000),
      }
    )

    if (!res.ok) {
      // Endpoint no existe o WP devolvió error — array vacío, sin romper el frontend
      return NextResponse.json([], { status: 200 })
    }

    const data: unknown = await res.json()
    return NextResponse.json(Array.isArray(data) ? data : [])
  } catch {
    return NextResponse.json([])
  }
}

// Rechazar explícitamente otros métodos
export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
}
