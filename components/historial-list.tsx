'use client'

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import type { Resultado } from "@/lib/types"
import { normalizeAnimalName } from "@/lib/animals"

function formatFechaLarga(fechaStr: string): string {
  if (!fechaStr) return "—"
  const [year, month, day] = fechaStr.split("-")
  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
  ]
  return `${parseInt(day, 10)} de ${meses[parseInt(month, 10) - 1]} de ${year}`
}

function FilaResultado({
  resultado,
  index,
  onSelectImage,
}: {
  resultado: Resultado
  index: number
  onSelectImage: (url: string) => void
}) {
  const hasInfographic = !!resultado.infographic_url

  return (
    <div
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150
        ${hasInfographic ? "hover:bg-primary/5 cursor-pointer" : "cursor-default"}`}
      onClick={() => hasInfographic && onSelectImage(resultado.infographic_url!)}
    >
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
        </p>
      </div>

      {hasInfographic ? (
        <div className="flex-shrink-0 w-10 h-14 overflow-hidden rounded border border-border/50 shadow-sm
                        opacity-70 group-hover:opacity-100 transition-opacity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultado.infographic_url!}
            alt={`Miniatura sorteo ${resultado.fecha}`}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary/40 transition-colors" />
      )}
    </div>
  )
}

interface HistorialListProps {
  resultados: Resultado[]
  isFiltered: boolean
}

export function HistorialList({ resultados, isFiltered }: HistorialListProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  // mounted guard: createPortal necesita document.body, que no existe en SSR
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!selectedImage) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedImage(null) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedImage])

  return (
    <>
      <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-gunterz)] text-sm text-foreground uppercase tracking-wider">
            {isFiltered ? "Resultados" : "Historial"}{" "}
            <span className="text-primary">
              {isFiltered ? "Filtrados" : "de Sorteos"}
            </span>
          </h2>
          <span className="text-xs text-muted-foreground">
            {resultados.length} sorteo{resultados.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="py-2">
          {resultados.map((resultado, i) => (
            <FilaResultado
              key={resultado.id}
              resultado={resultado}
              index={i}
              onSelectImage={setSelectedImage}
            />
          ))}
        </div>
      </section>

      {/* ── Lightbox (Portal → document.body, escapa de cualquier stacking context) */}
      {mounted && selectedImage && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt="Infografía de sorteo"
              className="w-auto h-auto max-w-full max-h-full object-contain drop-shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 p-2 text-white bg-black/50 hover:bg-black transition-colors rounded-full"
              aria-label="Cerrar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
