# Auditoría Final — Lotería de Animales
**Fecha:** 2026-04-15  
**Auditor:** Claude Code (QA Técnico)  
**Base documental:** `Proyecto_Sitio_LA.txt`  
**Codebase auditado:** `la-frontend/` (Next.js 15 · TypeScript · Tailwind CSS 4 · Framer Motion)

---

## ✅ Requerimientos Cumplidos

### Identidad Visual y Diseño (§6 Manual de Marca)
- Paleta institucional correctamente aplicada en toda la UI: Gris Oscuro `#2B2B2B`, Dorado `#FFCC00`, Verde Fortuna `#009640`, Naranja Acción `#F58220`.
- Fuentes propias cargadas con `next/font/local`: **Gunterz** (títulos) y **Resonate** (cuerpo). Sin fuentes externas de Google.
- Estilo "Premium Institucional" implementado: glassmorphism, gradientes premium, bordes con glow, tipografía uppercase con tracking.
- Franjas de bandera paraguaya: completas en desktop, línea degradé de 3px en mobile (`from-[#D52B1E] via-white to-[#0038A8]`).

### Los 25 Animales Oficiales (§18)
- `lib/animals.ts` contiene los 25 animales del Juego del Bicho con IDs 1–25, números zero-padded y rutas a íconos dorados locales.
- `public/images/animales/` tiene los 25 archivos PNG locales (sin depender de CDN externo).
- La grilla en el Oráculo siempre muestra los 25 animales, nunca los filtra ni los oculta.

### Página Principal (§10)
- **Banners rotativos** — `BannersSlider` con autoplay (5s), flechas, dots, pausa en hover y **swipe táctil** (onTouchStart/onTouchEnd, umbral 40px).
- **Palpites del día** — `PalpitesSection` con Milésima, Centena, Docena y barra de confianza IA.
- **Acceso rápido a resultados** — Hero Section + botón "Resultados" siempre visible en el header.
- **Acceso rápido al sorteo en vivo** — Botón "Sorteo en Vivo" en el Hero abre modal animado con horario (18:00 hs).
- **Últimos ganadores** — `WinnersSection` con foto, nombre, ciudad, premio, fecha y badge "Gran Premio".
- **Puntos de venta destacados** — `LocationsSection` con mapa interactivo Leaflet.
- **Pie institucional** — `Footer` con columnas Juego / Empresa / Legal / Contacto dinámico.

### Navegación (§9)
- Header fijo con detección de scroll y backdrop-blur al bajar.
- **Resultados** siempre visible en la esquina superior derecha (desktop y mobile), con badge "VIVO" verde pulsante.
- **Login** siempre visible, redirige a `https://dev.loteriadeanimales.app` (cumple la regla del §9).
- Dropdown "Institucional": Sobre Nosotros, Tabla de Premios, Reglamento.
- Menú mobile con `AnimatePresence`, altura mínima táctil de 44px en todos los ítems.

### Sistema de Ganadores (§12)
- Todos los campos requeridos presentes: Foto, Nombre, Ciudad, Premio, Fecha.
- Avatar con ring dorado `#FFCC00` + glow `box-shadow: 0 0 12px rgba(255,204,0,0.3)` (medallón de campeón).
- Badge "Gran Premio" condicional (`is_grand_prize === 1`).
- Se renderiza automáticamente en la página principal (fetch desde API `/ganadores`).

### Sistema de Resultados (§13)
- Hero Section muestra el último resultado en tiempo real: imagen del animal, nombre, número con contador odómetro animado y Victory Pulse verde.
- Fecha legible en español (`formatFechaHumana`: "9 de abril de 2026").
- Página `/resultados` con historial y filtros por fecha y turno (`resultados-filtros.tsx`).

### Puntos de Venta (§14)
- Página dedicada `/puntos-de-venta` con mapa Leaflet interactivo.
- Datos consumidos desde endpoint `/locales` con nombre, latitud, longitud, dirección y teléfono (campos opcionales en `Local` interface).
- Sección en homepage con scroll suave vinculado a los botones "Jugar Ahora".

### Libro de los Sueños / Oráculo (§15)
- Tabla de los 25 animales con sus keywords de sueños, consumida desde `/dreams-dictionary`.
- **CardState reactivo**: neutral → highlighted/dimmed según el texto escrito → oracle-result al interpretar.
- Borde animado **Gemini-style** (conic-gradient + spin 4s): rayo de luz dorado/naranja/verde trazando el perímetro.
- **Efecto shimmer** en el textarea durante la carga (`oracle-scanning`).
- **Partículas flotantes** (10 puntos dorados ascendentes) durante el procesamiento.
- Staggered reveal de la grilla al entrar al viewport (Framer Motion `staggerChildren: 0.06`).
- Golden Bloom hover en cada ícono animal (`scale(1.12) translateY(-3px)` + drop-shadow dorado).
- Parallax suave en la textura de billetes (factor 0.18 relativo al scroll).

### Palpites del Día con IA (§17)
- Campos requeridos implementados: Animal del Día, Milésima, Centena, Docena.
- Generación automática diaria (backend) + consumo desde endpoint `/palpites`.
- Barra de confianza IA (0–100%) en cada card.
- Skeleton de carga mientras llegan los datos.

### CTAs Funcionales
- **"Jugar Ahora"** (Hero + Ganadores): smooth scroll a `#puntos-de-venta` con `scrollIntoView({ behavior: 'smooth' })`. Efecto Liquid Gold (gradiente `#F58220 → #FFCC00 → #F58220`, shimmer en hover, `hover:-translate-y-1`, `active:scale-[0.97]`).
- **"Sorteo en Vivo"**: abre `LiveModal` con `AnimatePresence` (fade + scale). Cierre por clic en backdrop, botón ✕ o tecla Escape.
- **"Interpretar Sueño"**: Liquid Gold con Sparkles rotando 180° en hover. Estado disabled visualmente apagado.

### Responsive / Mobile First (§4)
- Breakpoints Tailwind (`sm:`, `md:`, `lg:`) en todos los componentes.
- CTAs con `min-h-[48px]` para área táctil mínima.
- Carrusel: `aspect-[16/9]` en mobile (más alto) → `aspect-[16/5]` en desktop. `px-2` en mobile para mayor ancho útil.
- Menú mobile con hamburger, min-w y min-h de 44px.
- Franjas de bandera ocultas en mobile (`hidden md:block`), reemplazadas por línea delgada full-width.

### SEO y Marketing (§22)
- **Open Graph** completo: título, descripción, imagen, locale `es_PY`, URL canónica.
- **Twitter Card** `summary_large_image`.
- **Schema Markup JSON-LD**: `WebSite` + `Organization` con logo, dirección y `SearchAction` inyectados en `<head>`.
- Metadatos `title` con template `%s | Lotería de Animales` para subpáginas.
- `lang="es"` en `<html>`.

### Integración con Redes Sociales (§21)
- Footer renderiza dinámicamente iconos de Instagram, Facebook, TikTok, YouTube y WhatsApp desde endpoint `/settings`.
- Botón flotante WhatsApp con número dinámico desde API + mensaje pre-cargado.

### Infraestructura (§8)
- VPS Hostinger configurada con Nginx como proxy inverso + PM2 en modo cluster (2 instancias).
- `NEXT_PUBLIC_API_URL` externalizado en variables de entorno.
- SSL listo en configuración Nginx documentada.

### Páginas Institucionales
- `/sobre-la-loteria`, `/tabla-de-premios`, `/reglamento`, `/terminos-y-condiciones`, `/politica-de-privacidad`, `/juego-responsable` — todas con rutas activas y contenido desde API `/pages`.

---

## ⚠️ Observaciones Menores

1. **`footer.tsx` — color residual navy**: usa `bg-[#0f1620]` en el elemento `<footer>`. Debería ser `bg-[#1a1a1a]` o `bg-[var(--bg-deep)]` para mantener la paleta Gris institucional y evitar el azul marino eliminado en la fase v2.

2. **`layout.tsx` — themeColor navy**: `viewport: { themeColor: '#1E2B3E' }` usa el color de la paleta legacy. Reemplazar por `'#2B2B2B'` para coherencia con el tono base actual.

3. **Animales IDs 19 y 20 comparten imagen**: `Pavo real` (id: 19) y `Pavo` (id: 20) apuntan al mismo archivo `pavo-iconos-animales-dorado.png`. Son animales distintos en el Juego del Bicho y deberían tener íconos diferenciados.

4. **Archivo huérfano en `/public/images/animales/`**: existe `gallo - copia.png` (con espacios en el nombre). No está referenciado en el código, debe eliminarse para evitar confusión.

5. **`console.error()` en producción**: `lib/api.ts` líneas 12–13 y 18 logean errores en el bloque catch. Útil en desarrollo, pero en producción debería usarse un logger silencioso o un servicio de monitoreo (Sentry, etc.) en lugar de `console`.

6. **Palpites — grid de 5 cards sin layout adecuado**: §17 especifica "5 palpites por día". El componente `palpites-section.tsx` usa `grid-cols-1 sm:grid-cols-3`. Si el backend retorna 5 palpites, las cards 4 y 5 se descuelgan en la última fila (2 columnas de 3). Considerar `sm:grid-cols-5` o agrupar en `2+3` para 5 items.

7. **Winners — sin paginación**: `getGanadores(6)` hardcodea un límite de 6. Si hay más ganadores, no son accesibles. Considerar un botón "Ver todos" o paginación simple.

8. **`SiteSettings` — campos de redes sociales limitados**: la interfaz no incluye `twitter_url` ni `linkedin_url`. Si el equipo de marketing los usa, habría que añadirlos.

---

## ❌ Faltantes Críticos

### 1. Google Analytics (§22 — alta prioridad)
El documento exige explícitamente "Integración con Google Analytics". No existe ningún script de GA (`gtag.js`, `@next/third-parties/google`) en `layout.tsx` ni en ninguna página.

**Impacto**: Sin analytics activos, el cliente no puede medir tráfico, fuentes de adquisición ni conversiones desde el día 1 de producción.

**Solución recomendada**: Instalar `@next/third-parties` y agregar `<GoogleAnalytics gaId="G-XXXXXXXXXX" />` en `layout.tsx`. El Measurement ID debe proveerlo el cliente.

---

### 2. Meta Pixel / Facebook Pixel (§22 — alta prioridad)
El documento exige "Integración con Meta Pixel". No se encontró ninguna implementación del Pixel en el codebase.

**Impacto**: Las campañas de Facebook/Instagram del cliente no pueden medir conversiones ni hacer retargeting desde el lanzamiento.

**Solución recomendada**: Inyectar el script del Pixel en `layout.tsx` vía `<Script>` de Next.js con `strategy="afterInteractive"`. El Pixel ID debe proveerlo el cliente.

---

### 3. "Sorteo en Vivo" ausente en el menú de navegación (§9 — media prioridad)
El documento §9 lista explícitamente "Sorteo en vivo" como ítem del menú principal. El botón existe en el Hero como CTA, pero **no está en el array `navLinks` del header**. Un usuario que llega directamente a una subpágina (ej: `/resultados`) no puede acceder al sorteo desde la navegación.

**Solución recomendada**: Agregar `{ href: "/#sorteo", label: "Sorteo en Vivo" }` a `navLinks` en `header.tsx`, enlazando al modal del Hero o a una sección dedicada.

---

### 4. Grilla de Palpites no soporta 5 items visualmente (§17 — media prioridad)
§17 especifica "5 palpites por día". El layout actual (`grid-cols-3`) produce una fila incompleta si el backend envía 5. Esto no es un bug de datos sino de presentación: las cards 4–5 quedan en una fila de 2 centrada, rompiendo la simetría del diseño premium.

**Solución recomendada**: Cambiar a `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5` para soportar exactamente 5, o implementar lógica de split (fila superior: 3 cards; fila inferior: 2 cards centradas).

---

*Auditoría completada — 4 ítems críticos, 8 observaciones menores, 25+ requerimientos cumplidos.*  
*Para revisión del Tech Lead: Sebastian.*
