/**
 * POST /api/revalidate
 *
 * Endpoint de On-Demand ISR: WordPress llama a este webhook cuando se
 * actualiza un sorteo, un pálpite o cualquier contenido editorial.
 *
 * Seguridad:
 *   - Requiere header `x-revalidate-secret` con el valor de REVALIDATE_SECRET.
 *   - Solo acepta POST.
 *   - Responde 401 sin revelar si el secret existe o no.
 *
 * Payload esperado (JSON):
 *   { "paths": ["/", "/resultados"] }   — rutas a limpiar
 *   { "tags": ["resultados"] }          — tags de caché a limpiar
 *
 * Configurar en WordPress (plugin Webhooks o función en functions.php):
 *   URL:     https://loteriadeanimales.com.py/api/revalidate
 *   Método:  POST
 *   Headers: x-revalidate-secret: <REVALIDATE_SECRET>
 *   Body:    {"paths":["/","resultados"]}
 */

import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret")

  // Comparación constante — evita timing attacks
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { paths?: string[]; tags?: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const revalidated: string[] = []

  if (Array.isArray(body.paths)) {
    for (const path of body.paths) {
      if (typeof path === "string") {
        revalidatePath(path)
        revalidated.push(`path:${path}`)
      }
    }
  }

  if (Array.isArray(body.tags)) {
    for (const tag of body.tags) {
      if (typeof tag === "string") {
        revalidateTag(tag, "default")
        revalidated.push(`tag:${tag}`)
      }
    }
  }

  if (revalidated.length === 0) {
    return NextResponse.json({ error: "No paths or tags provided" }, { status: 400 })
  }

  return NextResponse.json({ revalidated, now: Date.now() })
}

// Rechazar explícitamente otros métodos
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 })
}
