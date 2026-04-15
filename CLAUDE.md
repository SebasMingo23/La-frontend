# CLAUDE.md — Lotería de Animales · Frontend Next.js
> Manual de instrucciones para el agente Claude Code.
> Leer completo antes de modificar cualquier archivo.

---

## 1. CONTEXTO DEL PROYECTO

**Producto:** Sitio institucional de la Lotería de Animales (Asunción, Paraguay).
**Stack Frontend:** Next.js 16.2 · TypeScript 5.7 · Tailwind CSS 4 · shadcn/ui · Framer Motion.
**Backend:** WordPress Headless (INTOCABLE). REST API en `http://loteria-animales.local/wp-json/la/v1`.
**Producción:** VPS Hostinger · Nginx (proxy inverso) · PM2 (proceso Node.js).

---

## 2. REGLA ABSOLUTA — BACKEND INTOCABLE

**NUNCA** sugieras modificar el backend WordPress.
**NUNCA** propongas cambios en endpoints, estructura PHP, MySQL o wp-config.
El frontend consume la API con `fetch()` nativo. No se usa ningún cliente HTTP externo.

---

## 3. SISTEMA DE DISEÑO — KINETIC UI

### Paleta de Colores
| Token CSS | Valor Hex | Uso |
|-----------|-----------|-----|
| `--primary` (Portland Orange) | `#FF7A00` | CTAs, acentos, bordes activos |
| `--background` (Dark Blue) | `#1E2B3E` | Fondo principal |
| `--foreground` | `#FFFFFF` | Texto primario |
| `--card` | `#243347` | Superficies elevadas |
| `--muted-foreground` | `#8899AA` | Texto secundario |
| WhatsApp (ESTÁTICO, sin CSS vars) | `#25D366` | Solo el botón flotante |

### Tipografías (fuentes locales en `/public/fonts/`)
| Variable CSS | Fuente | Uso |
|-------------|--------|-----|
| `--font-gunterz` | Gunterz Bold/Black | Títulos `<h1>` a `<h3>`, kicker labels |
| `--font-resonate` | Resonate Regular/Medium | Párrafos, subtítulos, body text |

**⚠️ CRÍTICO:** No usar `font-oswald` ni `font-inter`. Esas variables son legacy y están deprecadas.
En `layout.tsx` las fuentes se cargan con `next/font/local`, NO con Google Fonts.

### Bordes y Forma
- Contenedores principales: `rounded-[2.5rem]`
- Cards secundarias: `rounded-[1.5rem]`
- Badges / pills: `rounded-full`
- **NUNCA** usar `rounded-lg` o `rounded-xl` directamente en componentes de sección.

### Componente WhatsApp Button — RESTRICCIÓN DE ANIMACIÓN
```tsx
// ✅ CORRECTO — estático, sin motion
<a
  href="https://wa.me/595XXXXXXXXX"
  className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)]"
  aria-label="Contactar por WhatsApp"
>
  <WhatsAppIcon className="w-7 h-7 text-white" />
</a>

// ❌ INCORRECTO — no usar motion.a, whileHover, animate, initial
```

---

## 4. ESTRUCTURA DE ARCHIVOS

```
/
├── app/
│   ├── layout.tsx          # RootLayout — fuentes locales, metadata, ThemeProvider
│   ├── page.tsx            # Home — composición de secciones
│   └── globals.css         # Variables CSS, tokens de color, @font-face
├── components/
│   ├── header.tsx          # Navbar fija, scroll detection, mobile menu
│   ├── hero-section.tsx    # Último resultado — DEBE consumir /ultimo-resultado
│   ├── predictions-section.tsx # Palpites IA — consume /predicciones
│   ├── winners-section.tsx # Ganadores — consume /ganadores (futuro endpoint)
│   ├── locations-section.tsx   # Puntos de venta — consume /locales
│   ├── dream-book-section.tsx  # Libro de sueños — consume /suenos (futuro)
│   ├── how-to-play-section.tsx # Estático
│   ├── footer.tsx          # Estático
│   ├── whatsapp-button.tsx # ESTÁTICO — color #25D366, sin animaciones
│   ├── scroll-reveal.tsx   # HOC de animación de entrada, usa IntersectionObserver
│   └── ui/                 # shadcn/ui — NO MODIFICAR directamente
├── lib/
│   ├── api.ts              # Fetchers centralizados (ver Sección 6)
│   ├── types.ts            # Interfaces TypeScript de la API
│   └── utils.ts            # cn(), formatters
└── public/
    ├── fonts/              # Gunterz y Resonate — archivos .woff2
    └── images/             # Patrones de fondo (dice, money)
```

---

## 5. TIPOS TYPESCRIPT DE LA API

Archivo: `lib/types.ts`

```typescript
// GET /ultimo-resultado
export interface UltimoResultado {
  id: number;
  animal_id: number;
  nombre: string;
  numero: string;
  miliesima: string;
}

// GET /locales
export interface Local {
  id: number;
  nombre: string;
  latitud: string;
  longitud: string;
}

// GET /predicciones
export interface Predicciones {
  animal_caliente: {
    nombre: string;
    apariciones_semana: number;
  };
  animal_frio: {
    nombre: string;
    dias_sin_salir: number;
  };
}
```

---

## 6. FETCHERS — `lib/api.ts`

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/wp-json/la/v1';

async function apiFetch<T>(endpoint: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`API error ${res.status} en ${endpoint}`);
  return res.json() as Promise<T>;
}

export const getUltimoResultado = () =>
  apiFetch<UltimoResultado>('/ultimo-resultado', 30);

export const getLocales = () =>
  apiFetch<Local[]>('/locales', 3600); // cachea 1h, datos estables

export const getPredicciones = () =>
  apiFetch<Predicciones>('/predicciones', 300);
```

**Reglas de revalidación:**
- Resultado del sorteo: `revalidate: 30` (actualización frecuente)
- Predicciones: `revalidate: 300` (5 min)
- Locales/agencias: `revalidate: 3600` (1h)
- Ganadores (futuro): `revalidate: 120`

---

## 7. PATRONES DE COMPONENTES

### Server Component (preferido para datos)
```tsx
// app/page.tsx o cualquier componente que solo lea datos
import { getUltimoResultado } from '@/lib/api'

export default async function HeroSection() {
  const resultado = await getUltimoResultado();
  return <div>{resultado.nombre}</div>;
}
```

### Client Component (solo cuando necesario)
```tsx
'use client'
// Solo para: interactividad, hooks de estado, framer-motion, window API
```

**Regla:** Empujar `'use client'` lo más abajo posible en el árbol.
Los Server Components no pueden importar Client Components que usen `motion.*` directamente — usar lazy loading o boundary.

### Manejo de errores con Fallback
```tsx
async function SectionConFallback() {
  try {
    const data = await getUltimoResultado();
    return <ResultadoCard data={data} />;
  } catch {
    return <ResultadoSkeleton />;
  }
}
```

---

## 8. VARIABLES DE ENTORNO

Archivo `.env.local` (no commitear):
```bash
NEXT_PUBLIC_API_URL=http://localhost/wp-json/la/v1
NEXT_PUBLIC_WHATSAPP_NUMBER=595XXXXXXXXX
```

Archivo `.env.production`:
```bash
# En VPS, el frontend llama internamente al WP en localhost
# NUNCA exponer IP del WP directamente al cliente
NEXT_PUBLIC_API_URL=http://127.0.0.1:8080/wp-json/la/v1
```

---

## 9. CONFIGURACIÓN NGINX — PROXY INVERSO (VPS HOSTINGER)

### Arquitectura en VPS
```
Internet → Nginx :443 (SSL)
              ├─ /wp-json/ → WordPress PHP-FPM :8080
              ├─ /wp-admin/ → WordPress PHP-FPM :8080
              └─ / (resto) → Next.js PM2 :3000
```

### `/etc/nginx/sites-available/loteriadeanimales.conf`
```nginx
# Upstream definitions
upstream nextjs_app {
    server 127.0.0.1:3000;
    keepalive 64;
}

upstream wordpress_php {
    server 127.0.0.1:8080;
    keepalive 32;
}

# HTTP → HTTPS redirect
server {
    listen 80;
    server_name loteriadeanimales.com www.loteriadeanimales.com;
    return 301 https://$host$request_uri;
}

# HTTPS main
server {
    listen 443 ssl http2;
    server_name loteriadeanimales.com www.loteriadeanimales.com;

    ssl_certificate /etc/letsencrypt/live/loteriadeanimales.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/loteriadeanimales.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Gzip
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;
    gzip_min_length 1000;

    # Next.js static assets — servir directamente, sin pasar por Node
    location /_next/static/ {
        alias /var/www/loteria-frontend/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /public/ {
        alias /var/www/loteria-frontend/public/;
        expires 30d;
    }

    # WordPress REST API — proxy a PHP-FPM
    location /wp-json/ {
        proxy_pass http://wordpress_php;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS para la API — permite que Next.js SSR llame internamente
        add_header Access-Control-Allow-Origin "https://loteriadeanimales.com";
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type";
    }

    # WordPress admin
    location /wp-admin/ {
        proxy_pass http://wordpress_php;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /wp-login.php {
        proxy_pass http://wordpress_php;
        proxy_set_header Host $host;
    }

    # Next.js app — todo el resto
    location / {
        proxy_pass http://nextjs_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
```

### `ecosystem.config.js` para PM2
```javascript
module.exports = {
  apps: [{
    name: 'loteria-frontend',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/loteria-frontend',
    instances: 2,
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
};
```

---

## 10. PROBLEMA CORS — SOLUCIÓN DEFINITIVA

**Por qué no hay CORS en producción:** Los fetchers en Server Components (`async` funciones en `page.tsx` o layouts) se ejecutan en el servidor Node.js, NO en el browser. La llamada es `servidor Node → WordPress PHP` (comunicación interna en la misma VPS via `127.0.0.1`). El browser nunca ve esa petición, por ende CORS no aplica.

**El CORS en el `nginx.conf` anterior solo protege:** Llamadas directas al endpoint `/wp-json/` que vengan de scripts del browser (fetch desde JS del cliente). Como no tenemos Client Components llamando directamente a la API de WP, esta configuración es una capa de defensa adicional.

**Si un Client Component necesita llamar a la API:** Debe hacerlo a través de una Next.js Route Handler (`app/api/...`), que actúa como BFF (Backend for Frontend), nunca directamente al WordPress.

---

## 11. CHECKLIST ANTES DE CADA COMMIT

- [ ] ¿El componente modificado usa `font-[var(--font-gunterz)]` para títulos?
- [ ] ¿Los contenedores principales tienen `rounded-[2.5rem]`?
- [ ] ¿El WhatsApp button NO tiene `motion.*`, `whileHover`, `animate`?
- [ ] ¿Los datos dinámicos vienen de `lib/api.ts` y no de arrays hardcodeados?
- [ ] ¿Las imágenes locales están en `/public/images/` y no en URLs externas de Vercel?
- [ ] ¿Los nuevos componentes con estado están marcados con `'use client'`?
- [ ] ¿`process.env.NEXT_PUBLIC_API_URL` está siendo usado en lugar de hardcodear la URL?

---

## 12. ERRORES CONOCIDOS A RESOLVER (BACKLOG TÉCNICO)

| Prioridad | Problema | Archivo | Acción |
|-----------|---------|---------|--------|
| 🔴 Alta | Fuentes Inter/Oswald en lugar de Gunterz/Resonate | `layout.tsx` | Reemplazar con `next/font/local` |
| 🔴 Alta | Datos hardcodeados en HeroSection | `hero-section.tsx` | Conectar a `getUltimoResultado()` |
| 🔴 Alta | Imágenes de vercel-storage.com | múltiples | Migrar a `/public/images/` |
| 🟡 Media | WhatsApp con animaciones | `whatsapp-button.tsx` | Remover `motion.a` y handlers |
| 🟡 Media | `@vercel/analytics` en producción VPS | `layout.tsx` | Remover o reemplazar |
| 🟡 Media | Falta `next.config.ts` con `remotePatterns` | raíz | Crear con dominios permitidos |
| 🟢 Baja | `suppressHydrationWarning` en body | `layout.tsx` | Agregar para evitar warnings de theme |
