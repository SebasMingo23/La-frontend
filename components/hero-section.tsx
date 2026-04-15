import { getResultados } from '@/lib/api'
import { HeroClient } from './hero-client'
import { Zap } from 'lucide-react'

/** Shown only while the page is streaming — never used as a permanent fallback */
function HeroSkeleton() {
  return (
    <section
      id="resultados"
      className="relative min-h-screen pt-20 overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-background/90" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center gap-8 animate-pulse">
          <div className="h-9 w-52 bg-card rounded-full" />
          <div className="h-16 w-80 md:w-[28rem] bg-card rounded-[1.5rem]" />
          <div className="h-6 w-64 bg-card rounded-full" />
          <div className="w-72 md:w-96 h-80 md:h-96 bg-card rounded-[2.5rem]" />
          <div className="h-20 w-40 bg-card rounded-[1.5rem]" />
          <div className="flex gap-4">
            <div className="h-14 w-40 bg-card rounded-[1.5rem]" />
            <div className="h-14 w-44 bg-card rounded-[1.5rem]" />
          </div>
        </div>
      </div>
    </section>
  )
}

/** Shown when the table is empty or the API is unreachable — never a skeleton */
function HeroEmpty() {
  return (
    <section
      id="resultados"
      className="relative min-h-screen pt-20 overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/pattern-dice-dark.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-background/90" />

      {/* Kinetic background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span className="text-[15vw] font-bold text-foreground/[0.03] uppercase tracking-tighter whitespace-nowrap select-none font-[var(--font-gunterz)]">
          PROXIMO SORTEO
        </span>
      </div>

      <div className="relative z-10 text-center px-4">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary
                         text-sm font-semibold uppercase tracking-wide mb-8">
          <Zap size={16} className="animate-pulse" />
          Resultado en Vivo
        </span>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter mb-4
                       font-[var(--font-gunterz)]">
          <span className="text-foreground">Último </span>
          <span className="text-primary">Resultado</span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-12">
          Sorteo · Asunción, Paraguay
        </p>

        {/* Empty state card */}
        <div className="inline-flex flex-col items-center gap-6 bg-card/95 backdrop-blur-xl
                        rounded-[2.5rem] p-10 md:p-14 border-2 border-primary/20
                        shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <div className="w-32 h-32 rounded-[1.5rem] bg-primary/10 border-2 border-primary/20
                          flex items-center justify-center">
            <Zap className="w-14 h-14 text-primary/40" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground uppercase font-[var(--font-gunterz)] mb-2">
              Esperando el próximo sorteo
            </p>
            <p className="text-muted-foreground text-sm max-w-xs">
              El resultado aparecerá aquí ni bien sea publicado.
            </p>
          </div>
        </div>
      </div>

      {/* Paraguay flag stripes */}
      <div className="absolute bottom-0 right-0 w-64 h-32 opacity-40">
        <div className="absolute bottom-20 right-0 w-80 h-5 bg-[#D52B1E] transform -skew-x-12" />
        <div className="absolute bottom-10 right-0 w-80 h-5 bg-[#FFFFFF] transform -skew-x-12" />
        <div className="absolute bottom-0 right-0 w-80 h-5 bg-[#0038A8] transform -skew-x-12" />
      </div>
    </section>
  )
}

export async function HeroSection() {
  try {
    const resultados = await getResultados(1)
    if (!resultados.length) return <HeroEmpty />
    return <HeroClient resultado={resultados[0]} />
  } catch {
    return <HeroEmpty />
  }
}
