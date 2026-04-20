# ─────────────────────────────────────────────────────────────────
# Stage 1 — deps: instala dependencias de producción y desarrollo
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

# libc6-compat es necesario para algunas dependencias nativas en Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci


# ─────────────────────────────────────────────────────────────────
# Stage 2 — builder: compila la app Next.js
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copia node_modules ya instalados desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* se incrusta en el bundle en tiempo de build,
# por eso se pasan como build args (no como env en runtime).
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


# ─────────────────────────────────────────────────────────────────
# Stage 3 — runner: imagen final mínima para producción
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Usuario sin privilegios para mayor seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

# Archivos públicos (fuentes, imágenes, íconos)
COPY --from=builder /app/public ./public

# Salida standalone: incluye el servidor Node y las dependencias mínimas
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Assets estáticos de Next.js (_next/static)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js es generado por output: 'standalone'
CMD ["node", "server.js"]
