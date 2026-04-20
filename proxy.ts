import { NextRequest, NextResponse } from "next/server"

// ─── Tabla de métodos permitidos por ruta de API ────────────────────────────
// Clave: pathname exacto · Valor: set de métodos HTTP aceptados
const ALLOWED_METHODS: Record<string, Set<string>> = {
  "/api/revalidate": new Set(["POST"]),
}

// ─── Rate limiting en memoria ────────────────────────────────────────────────
// Nota: este Map vive en el proceso Node. Si usás PM2 cluster (N workers),
// cada worker tiene su propio contador — el límite efectivo es N × LIMIT.
// Para rate limiting distribuido en producción, configurar en Nginx:
//   limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;
const RATE_STORE = new Map<string, { count: number; resetAt: number }>()
const RATE_WINDOW_MS = 60_000  // ventana de 1 minuto
const RATE_LIMIT_API = 30      // max requests/min por IP en /api/

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  return forwarded ? forwarded.split(",")[0].trim() : "unknown"
}

function isRateLimited(key: string, limit: number): boolean {
  const now = Date.now()
  const entry = RATE_STORE.get(key)

  if (!entry || now > entry.resetAt) {
    RATE_STORE.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }

  if (entry.count >= limit) return true
  entry.count++
  return false
}

// ─── Proxy principal ─────────────────────────────────────────────────────────
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const httpMethod = req.method.toUpperCase()

  // ── 1. Protección de rutas /api/ ──────────────────────────────────────────
  if (pathname.startsWith("/api/")) {

    // 1a. Method guard — rechazar métodos no declarados en la tabla
    const allowedForRoute = ALLOWED_METHODS[pathname]
    if (allowedForRoute && !allowedForRoute.has(httpMethod)) {
      return new NextResponse(
        JSON.stringify({ error: "Method Not Allowed" }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            Allow: [...allowedForRoute].join(", "),
          },
        }
      )
    }

    // 1b. Rate limiting por IP
    const key = `api:${getClientIP(req)}`
    if (isRateLimited(key, RATE_LIMIT_API)) {
      return new NextResponse(
        JSON.stringify({ error: "Too Many Requests" }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        }
      )
    }
  }

  // ── 2. Bloquear rutas de archivos sensibles ───────────────────────────────
  const BLOCKED: RegExp[] = [
    /^\/.env/,
    /^\/\.git/,
  ]
  if (BLOCKED.some((re) => re.test(pathname))) {
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.next()
}

// ─── Matcher — solo interceptar rutas relevantes ─────────────────────────────
// Los assets estáticos de Next.js se excluyen para no añadir latencia
export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|videos|icon).*)",
  ],
}
