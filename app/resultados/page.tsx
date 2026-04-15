import Link from "next/link"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ResultadosFiltros } from "@/components/resultados-filtros"
import { getResultados } from "@/lib/api"
import type { Resultado } from "@/lib/types"

// ── Metadatos dinámicos — OG varía según el último animal sorteado ────────────

interface PageProps {
  searchParams: Promise<{ fecha?: string; turno?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { fecha, turno } = await searchParams

  try {
    const resultados = await getResultados(1, fecha, turno)
    if (resultados.length > 0) {
      const r = resultados[0]
      const title = `${r.animal} Nº${r.numero} — Resultado ${r.fecha}`
      const description = [
        `Sorteo del ${r.fecha}`,
        r.turno ? `Turno ${r.turno}` : null,
        'Asunción, Paraguay — Lotería de Animales.',
      ].filter(Boolean).join(' · ')

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: r.imagen_url
            ? [{ url: r.imagen_url, width: 400, height: 400, alt: r.animal }]
            : undefined,
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: r.imagen_url ? [r.imagen_url] : undefined,
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatFecha(fechaStr: string): string {
  if (!fechaStr) return "—"
  const [year, month, day] = fechaStr.split("-")
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
                 "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  return `${parseInt(day, 10)} ${meses[parseInt(month, 10) - 1]} ${year}`
}

function formatFechaLarga(fechaStr: string): string {
  if (!fechaStr) return "—"
  const [year, month, day] = fechaStr.split("-")
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                 "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  return `${parseInt(day, 10)} de ${meses[parseInt(month, 10) - 1]} de ${year}`
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function HeroResultado({ resultado }: { resultado: Resultado }) {
  return (
    <div className="relative rounded-[2.5rem] overflow-hidden bg-card border border-primary/30
                    shadow-[0_0_60px_rgba(255,122,0,0.15)] p-8 md:p-12">
      {/* Glow de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">

        {/* Número / imagen */}
        <div className="flex-shrink-0 flex flex-col items-center gap-3">
          {resultado.imagen_url ? (
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-[1.5rem] overflow-hidden border-2 border-primary/40
                            shadow-[0_0_40px_rgba(255,122,0,0.3)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultado.imagen_url}
                alt={resultado.animal}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-[1.5rem] bg-primary/10 border-2 border-primary/30
                            flex items-center justify-center shadow-[0_0_40px_rgba(255,122,0,0.2)]">
              <span className="text-6xl md:text-7xl font-bold text-primary font-[family-name:var(--font-gunterz)]">
                {resultado.numero}
              </span>
            </div>
          )}
          {resultado.imagen_url && (
            <span className="text-4xl font-bold text-primary font-[family-name:var(--font-gunterz)]">
              #{resultado.numero}
            </span>
          )}
        </div>

        {/* Texto */}
        <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
          <span className="inline-flex self-center md:self-start items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary
                           text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Último Resultado
          </span>

          <h2 className="font-[family-name:var(--font-gunterz)] text-5xl md:text-6xl lg:text-7xl
                         text-foreground uppercase tracking-tight leading-tight">
            {resultado.animal}
          </h2>

          <p className="text-muted-foreground text-lg mb-6">
            {formatFechaLarga(resultado.fecha)}
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="bg-background/50 border border-border rounded-2xl px-5 py-3 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Animal</p>
              <p className="text-foreground font-bold text-lg">{resultado.animal}</p>
            </div>
            <div className="bg-background/50 border border-border rounded-2xl px-5 py-3 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Número</p>
              <p className="text-primary font-bold text-2xl font-[family-name:var(--font-gunterz)]">
                {resultado.numero}
              </p>
            </div>
            <div className="bg-background/50 border border-border rounded-2xl px-5 py-3 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Fecha</p>
              <p className="text-foreground font-bold text-lg">{formatFecha(resultado.fecha)}</p>
            </div>
            {resultado.turno && (
              <div className="bg-primary/10 border border-primary/30 rounded-2xl px-5 py-3 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Turno</p>
                <p className="text-primary font-bold text-lg">{resultado.turno}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilaResultado({ resultado, index }: { resultado: Resultado; index: number }) {
  return (
    <div className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border
                    hover:border-primary/40 hover:bg-card/80 transition-all duration-200">
      {/* Posición */}
      <span className="flex-shrink-0 w-8 text-center text-sm font-bold text-muted-foreground/50">
        {index + 1}
      </span>

      {/* Imagen o número */}
      {resultado.imagen_url ? (
        <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resultado.imagen_url} alt={resultado.animal}
               className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20
                        flex items-center justify-center">
          <span className="text-primary font-bold text-lg font-[family-name:var(--font-gunterz)]">
            {resultado.numero}
          </span>
        </div>
      )}

      {/* Animal */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
          {resultado.animal}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFechaLarga(resultado.fecha)}
          {resultado.turno && (
            <> · <span className="text-primary/70">{resultado.turno}</span></>
          )}
        </p>
      </div>

      {/* Número badge */}
      <span className="flex-shrink-0 px-3 py-1 rounded-full bg-primary/10 text-primary
                       text-sm font-bold font-[family-name:var(--font-gunterz)]">
        #{resultado.numero}
      </span>
    </div>
  )
}

function EstadoVacio() {
  return (
    <div className="bg-card rounded-[2.5rem] p-16 text-center border border-border
                    shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.5" className="text-primary">
          <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 8v4m0 4h.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="font-[family-name:var(--font-gunterz)] text-xl text-foreground uppercase mb-3">
        Sin resultados aún
      </h2>
      <p className="text-muted-foreground max-w-xs mx-auto text-sm">
        Los resultados de los sorteos aparecerán aquí ni bien sean publicados.
      </p>
      <Link
        href="/"
        className="inline-block mt-8 px-6 py-3 rounded-full bg-primary/20 text-primary
                   hover:bg-primary/30 transition-colors text-sm font-semibold uppercase tracking-wide"
      >
        Volver al inicio
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

        {/* Hero de página */}
        <div className="pt-24 pb-10 px-4 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-foreground">Resultados</span>
          </nav>

          {/* Título */}
          <h1 className="font-[family-name:var(--font-gunterz)] text-4xl md:text-5xl lg:text-6xl
                         text-foreground uppercase tracking-tight leading-none mb-4">
            Resultados de{" "}
            <span className="text-primary">Sorteos</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Consultá el último resultado y el historial completo de sorteos.
          </p>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-primary/40 via-border to-transparent" />
        </div>

        {/* Filtros */}
        <div className="px-4 pb-6 max-w-5xl mx-auto">
          <Suspense>
            <ResultadosFiltros />
          </Suspense>
        </div>

        {/* Contenido */}
        <div className="px-4 pb-24 max-w-5xl mx-auto space-y-10">

          {resultados.length === 0 ? (
            isFiltered ? (
              /* Sin resultados para el filtro activo */
              <div className="bg-card rounded-[2.5rem] p-16 text-center border border-border
                              shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="1.5" className="text-primary">
                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 8v4m0 4h.01" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="font-[family-name:var(--font-gunterz)] text-xl text-foreground uppercase mb-3">
                  Sin resultados para este filtro
                </h2>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">
                  No hay sorteos registrados para la fecha y/o turno seleccionado.
                </p>
                <Link
                  href="/resultados"
                  className="inline-block px-6 py-3 rounded-full bg-primary/20 text-primary
                             hover:bg-primary/30 transition-colors text-sm font-semibold uppercase tracking-wide"
                >
                  Ver todos los sorteos
                </Link>
              </div>
            ) : (
              <EstadoVacio />
            )
          ) : (
            <>
              {/* ── Último / primer resultado del filtro ── */}
              <HeroResultado resultado={ultimo} />

              {/* ── Historial ── */}
              {anteriores.length > 0 && (
                <section>
                  <h2 className="font-[family-name:var(--font-gunterz)] text-2xl text-foreground
                                 uppercase tracking-tight mb-5">
                    {isFiltered ? "Resultados" : "Historial de"}{" "}
                    <span className="text-primary">{isFiltered ? "Filtrados" : "Sorteos"}</span>
                  </h2>

                  <div className="space-y-2">
                    {anteriores.map((resultado, i) => (
                      <FilaResultado key={resultado.id} resultado={resultado} index={i} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

        </div>

        <Footer />
      </main>

      <WhatsAppButton />
    </>
  )
}
