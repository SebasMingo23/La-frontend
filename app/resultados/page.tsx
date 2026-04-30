import Link from "next/link"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ResultadosFiltros } from "@/components/resultados-filtros"
import { getResultados } from "@/lib/api"
import type { Resultado } from "@/lib/types"
import { normalizeAnimalName } from "@/lib/animals"

// ── Metadatos dinámicos ───────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{ fecha?: string; turno?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { fecha, turno } = await searchParams

  try {
    const resultados = await getResultados(1, fecha, turno)
    if (resultados.length > 0) {
      const r = resultados[0]
      const animalDisplay = normalizeAnimalName(r.animal)
      const title = `${animalDisplay} — Resultado ${r.fecha}`
      const description = [
        `Sorteo del ${r.fecha}`,
        r.turno ? `Turno ${r.turno}` : null,
        "Asunción, Paraguay — Lotería de Animales.",
      ].filter(Boolean).join(" · ")

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: (r.infographic_url || r.imagen_url)
            ? [{ url: r.infographic_url || r.imagen_url, alt: animalDisplay }]
            : undefined,
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: (r.infographic_url || r.imagen_url)
            ? [r.infographic_url || r.imagen_url]
            : undefined,
        },
      }
    }
  } catch {
    // Fallback a metadata estática
  }

  return {
    title: "Resultados de Sorteos",
    description: "Consultá los últimos resultados de la Lotería de Animales de Paraguay.",
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatFecha(fechaStr: string): string {
  if (!fechaStr) return "—"
  const [year, month, day] = fechaStr.split("-")
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
  return `${parseInt(day, 10)} ${meses[parseInt(month, 10) - 1]} ${year}`
}

function formatFechaLarga(fechaStr: string): string {
  if (!fechaStr) return "—"
  const [year, month, day] = fechaStr.split("-")
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                 "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
  return `${parseInt(day, 10)} de ${meses[parseInt(month, 10) - 1]} de ${year}`
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function HeroResultado({ resultado }: { resultado: Resultado }) {
  const hasInfographic = !!resultado.infographic_url
  const animalDisplay  = normalizeAnimalName(resultado.animal)

  return (
    <div className="relative rounded-2xl overflow-hidden bg-card border border-primary/30
                    shadow-lg">
      {/* Glow de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {hasInfographic ? (
        <>
          {/* Badge */}
          <div className="relative z-10 px-6 pt-6 pb-4 flex items-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary
                             text-xs font-semibold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Último Resultado
            </span>
          </div>

          {/* Infografía — edge-to-edge */}
          <div className="relative z-10 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resultado.infographic_url!}
              alt={`Infografía de premios — sorteo del ${resultado.fecha}`}
              className="w-full h-auto block"
            />
          </div>

          {/* Strip inferior */}
          <div className="relative z-10 px-6 py-5 flex flex-wrap items-center justify-between gap-4
                          border-t border-border/50">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                1er Premio
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-[family-name:var(--font-gunterz)] text-2xl md:text-3xl
                               text-foreground uppercase tracking-tight">
                  {animalDisplay}
                </p>
                {resultado.turno && (
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20
                                   text-primary text-xs font-semibold uppercase tracking-wide">
                    {resultado.turno}
                  </span>
                )}
              </div>
            </div>
            <p className="text-muted-foreground text-sm">{formatFechaLarga(resultado.fecha)}</p>
          </div>
        </>
      ) : (
        /* Fallback sin infografía */
        <div className="relative z-10 flex flex-col gap-5 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary
                             text-xs font-semibold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Último Resultado
            </span>
            {resultado.turno && (
              <span className="px-3 py-1 rounded-full bg-background/50 border border-border
                               text-muted-foreground text-xs font-medium">
                {resultado.turno}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-background/50 border border-border
                             text-muted-foreground text-xs font-medium ml-auto">
              {formatFecha(resultado.fecha)}
            </span>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-gunterz)] text-4xl md:text-5xl
                           text-foreground uppercase tracking-tight leading-tight mb-2">
              {animalDisplay}
            </h2>
            <p className="text-muted-foreground">{formatFechaLarga(resultado.fecha)}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="bg-background/50 border border-border rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Animal</p>
              <p className="text-foreground font-bold">{animalDisplay}</p>
            </div>
            <div className="bg-background/50 border border-border rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Fecha</p>
              <p className="text-foreground font-bold">{formatFecha(resultado.fecha)}</p>
            </div>
            {resultado.turno && (
              <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Turno</p>
                <p className="text-primary font-bold">{resultado.turno}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function FilaResultado({ resultado, index }: { resultado: Resultado; index: number }) {
  return (
    <div className="group flex items-center gap-3 px-4 py-3 rounded-xl
                    hover:bg-primary/5 transition-colors duration-150 cursor-default">
      <span className="flex-shrink-0 w-6 text-center text-xs font-bold text-muted-foreground/40">
        {index + 1}
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm truncate">
          {normalizeAnimalName(resultado.animal)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatFechaLarga(resultado.fecha)}
          {resultado.turno && (
            <> · <span className="text-primary/70">{resultado.turno}</span></>
          )}
          {resultado.infographic_url && (
            <> · <a
              href={resultado.infographic_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary transition-colors underline underline-offset-2"
            >ver infografía</a></>
          )}
        </p>
      </div>

      {/* Separador decorativo */}
      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary/40 transition-colors" />
    </div>
  )
}

function EstadoVacio() {
  return (
    <div className="bg-card rounded-2xl p-12 text-center border border-border shadow-sm">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.5" className="text-primary">
          <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 8v4m0 4h.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="font-[family-name:var(--font-gunterz)] text-lg text-foreground uppercase mb-2">
        Sin resultados aún
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
        Los resultados de los sorteos aparecerán aquí ni bien sean publicados.
      </p>
      <Link
        href="/"
        className="inline-block px-5 py-2.5 rounded-full bg-primary/20 text-primary
                   hover:bg-primary/30 transition-colors text-sm font-semibold uppercase tracking-wide"
      >
        Volver al inicio
      </Link>
    </div>
  )
}

function EstadoFiltroVacio() {
  return (
    <div className="bg-card rounded-2xl p-12 text-center border border-border shadow-sm">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.5" className="text-primary">
          <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 8v4m0 4h.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="font-[family-name:var(--font-gunterz)] text-lg text-foreground uppercase mb-2">
        Sin resultados para este filtro
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
        No hay sorteos registrados para la fecha y/o turno seleccionado.
      </p>
      <Link
        href="/resultados"
        className="inline-block px-5 py-2.5 rounded-full bg-primary/20 text-primary
                   hover:bg-primary/30 transition-colors text-sm font-semibold uppercase tracking-wide"
      >
        Ver todos los sorteos
      </Link>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export default async function ResultadosPage({ searchParams }: PageProps) {
  const { fecha, turno } = await searchParams
  let resultados: Resultado[] = []

  try {
    resultados = await getResultados(50, fecha, turno)
  } catch {
    // API no disponible → estado vacío
  }

  const isFiltered = !!(fecha || turno)
  const [ultimo, ...anteriores] = resultados

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Barra de acento superior */}
        <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />

        {/* ── Cabecera de color ─────────────────────────────────────────── */}
        <div className="bg-background pt-24 pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <nav className="mb-5 flex items-center gap-2 text-sm text-white/50">
              <Link href="/" className="hover:text-white/80 transition-colors">Inicio</Link>
              <span className="text-white/30">/</span>
              <span className="text-white/80">Resultados</span>
            </nav>
            <h1 className="font-[family-name:var(--font-gunterz)] text-5xl md:text-6xl lg:text-7xl
                           text-white uppercase tracking-tight leading-none mb-3">
              Resultados
            </h1>
            <p className="text-white/60 text-lg">
              Consultá el último resultado y el historial completo de sorteos.
            </p>
          </div>
        </div>

        {/* ── Cuerpo flotante — tarjetas sobre el fondo ─────────────────── */}
        <div className="relative z-10 -mt-10 px-4 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* ── Columna izquierda: Buscar Resultados ── */}
              <aside className="order-2 lg:order-1 lg:col-span-4 lg:sticky lg:top-24">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="font-[family-name:var(--font-gunterz)] text-base text-gray-900
                                 uppercase tracking-wider mb-5">
                    Buscar Resultados
                  </h2>
                  <Suspense>
                    <ResultadosFiltros light />
                  </Suspense>
                </div>
              </aside>

              {/* ── Columna derecha: Resultado + Historial ── */}
              <div className="order-1 lg:order-2 lg:col-span-8 flex flex-col gap-5">

                {resultados.length === 0 ? (
                  isFiltered ? <EstadoFiltroVacio /> : <EstadoVacio />
                ) : (
                  <>
                    {/* Resultado destacado */}
                    <HeroResultado resultado={ultimo} />

                    {/* Historial */}
                    {anteriores.length > 0 && (
                      <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                        {/* Encabezado de sección */}
                        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
                          <h2 className="font-[family-name:var(--font-gunterz)] text-sm text-foreground
                                         uppercase tracking-wider">
                            {isFiltered ? "Resultados" : "Historial"}{" "}
                            <span className="text-primary">
                              {isFiltered ? "Filtrados" : "de Sorteos"}
                            </span>
                          </h2>
                          <span className="text-xs text-muted-foreground">
                            {anteriores.length} sorteo{anteriores.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Lista */}
                        <div className="py-2">
                          {anteriores.map((resultado, i) => (
                            <FilaResultado key={resultado.id} resultado={resultado} index={i} />
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                )}

              </div>

            </div>
          </div>
        </div>

        <Footer />
      </main>

      <WhatsAppButton />
    </>
  )
}
