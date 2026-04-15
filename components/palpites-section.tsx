import Image from "next/image"
import { Sparkles } from "lucide-react"
import { getPalpites } from "@/lib/api"
import { animals } from "@/lib/animals"
import type { Palpite } from "@/lib/types"

/** Fallback: si el backend no devuelve image_url, buscar en animals.ts local */
function resolveImage(palpite: Palpite): string | null {
  if (palpite.image_url) return palpite.image_url
  const match = animals.find((a) => a.id === palpite.id)
  return match?.image ?? null
}

function PalpiteCard({ palpite, rank }: { palpite: Palpite; rank: number }) {
  const imageSrc = resolveImage(palpite)

  return (
    <div className="relative group flex flex-col items-center gap-5 bg-card border-2 border-primary/20
                    hover:border-primary/50 rounded-[2.5rem] p-8 md:p-10 transition-colors duration-300
                    shadow-[0_10px_40px_rgba(0,0,0,0.3)]">

      {/* Rank badge */}
      <span className="absolute top-5 left-5 w-7 h-7 rounded-full bg-muted flex items-center justify-center
                       text-xs font-bold text-muted-foreground font-[var(--font-gunterz)]">
        {rank}
      </span>

      {/* Animal image */}
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={palpite.nombre_animal}
            fill
            className="object-contain drop-shadow-[0_0_20px_rgba(245,181,0,0.4)]"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
            <span className="text-4xl text-muted-foreground font-[var(--font-gunterz)]">?</span>
          </div>
        )}
      </div>

      {/* Animal name */}
      <h3 className="text-xl md:text-2xl font-bold text-foreground uppercase tracking-tight
                     font-[var(--font-gunterz)] text-center">
        {palpite.nombre_animal}
      </h3>

      {/* Lottery ball — número del animal */}
      <div className="w-20 h-20 rounded-full flex items-center justify-center
                      bg-gradient-to-b from-primary to-[#CC6200]
                      shadow-[0_8px_24px_rgba(255,122,0,0.55),inset_0_2px_0_rgba(255,255,255,0.25)]">
        <span className="text-2xl font-bold text-white font-[var(--font-gunterz)] leading-none">
          {palpite.numero}
        </span>
      </div>

      {/* Milésima / Centena / Decena */}
      <div className="w-full grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Milésima", value: palpite.milesima },
          { label: "Centena",  value: palpite.cento },
          { label: "Decena",   value: palpite.docena },
        ].map(({ label, value }) => (
          <div key={label} className="bg-background/50 rounded-xl py-2 px-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              {label}
            </div>
            <div className="text-base font-bold text-foreground font-[var(--font-gunterz)]">
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Barra de confianza */}
      <div className="w-full">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span className="uppercase tracking-wider">Confianza IA</span>
          <span className="font-bold text-primary font-[var(--font-gunterz)]">
            {palpite.confianza}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            style={{ width: `${palpite.confianza}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function PalpitesSkeleton() {
  return (
    <section className="relative py-20 md:py-28 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 animate-pulse">
          <div className="h-9 w-52 bg-card rounded-full" />
          <div className="h-10 w-80 bg-card rounded-[1.5rem]" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-card rounded-[2.5rem]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export async function PalpitesSection() {
  let palpites: Palpite[]

  try {
    palpites = await getPalpites()
  } catch {
    return <PalpitesSkeleton />
  }

  if (!palpites.length) return null

  return (
    <section
      id="predicciones"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #2B2B2B 0%, #252525 60%, #2B2B2B 100%)",
      }}
    >
      {/* Glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-32 bg-accent/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary
                           text-sm font-semibold uppercase tracking-wide mb-6">
            <Sparkles size={15} />
            Palpites de Hoy
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground uppercase
                         tracking-tighter font-[var(--font-gunterz)]">
            Sugerencias de la{" "}
            <span className="text-primary">IA</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Los animales con mayor probabilidad para el sorteo de hoy,
            calculados cada madrugada.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {palpites.map((palpite, index) => (
            <PalpiteCard key={palpite.id} palpite={palpite} rank={index + 1} />
          ))}
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-muted-foreground/60 uppercase tracking-widest">
          Actualizado diariamente · Solo con fines de entretenimiento
        </p>
      </div>
    </section>
  )
}
