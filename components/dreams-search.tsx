"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Sparkles, Moon, Frown, ChevronDown, ChevronUp } from "lucide-react"
import { animals } from "@/lib/animals"
import type { DreamEntry } from "@/lib/types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/wp-json/la/v1"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface InterpretResult {
  animal_id: number
  animal_name: string
  numero: string
  image_url: string
  matched_keywords: string[]
  explanation: string
  score: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveImage(entry: DreamEntry): string | null {
  if (entry.image_url) return entry.image_url
  const match = animals.find((a) => a.id === entry.id)
  return match?.image ?? null
}

function resolveImageById(id: number, apiUrl: string): string {
  if (apiUrl) return apiUrl
  const match = animals.find((a) => a.id === id)
  return match?.image ?? ""
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

/** Card de resultado del Oráculo */
function OracleResultCard({
  result,
  onReset,
}: {
  result: InterpretResult
  onReset: () => void
}) {
  const imgSrc = resolveImageById(result.animal_id, result.image_url)

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30
                      rounded-[3rem] blur-2xl opacity-60 animate-pulse pointer-events-none" />

      <div className="relative bg-[#1a2535]/95 border-2 border-primary/40 rounded-[2.5rem]
                      p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] text-center">

        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                         bg-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-5">
          <Sparkles size={12} />
          El Oráculo dice...
        </span>

        {/* Imagen del animal */}
        {imgSrc && (
          <div className="w-40 h-40 md:w-48 md:h-48 mx-auto mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={result.animal_name}
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(245,181,0,0.5)]"
            />
          </div>
        )}

        {/* Nombre */}
        <h3 className="font-[var(--font-gunterz)] text-3xl md:text-4xl font-bold
                       text-foreground uppercase tracking-tight mb-3">
          {result.animal_name}
        </h3>

        {/* Número */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-5
                        bg-gradient-to-b from-primary to-[#CC6200]
                        shadow-[0_6px_24px_rgba(255,122,0,0.55),inset_0_2px_0_rgba(255,255,255,0.2)]">
          <span className="text-2xl font-bold text-white font-[var(--font-gunterz)] leading-none">
            {result.numero}
          </span>
        </div>

        {/* Explicación */}
        <p className="text-foreground/80 text-sm md:text-base leading-relaxed max-w-sm mx-auto mb-5">
          {result.explanation}
        </p>

        {/* Keywords detectadas */}
        {result.matched_keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {result.matched_keywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 rounded-full bg-accent/20 text-accent
                           text-xs font-semibold uppercase tracking-wide"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Reset */}
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-primary transition-colors
                     uppercase tracking-widest underline underline-offset-4"
        >
          Interpretar otro sueño
        </button>
      </div>
    </div>
  )
}

/** Estado de carga del Oráculo */
function OracleLoading() {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-primary/50 animate-ping
                        [animation-delay:150ms]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>
      <p className="text-white/70 text-sm uppercase tracking-widest animate-pulse">
        Interpretando tu sueño...
      </p>
    </div>
  )
}

// ID del último animal ganador — estado "★ HOY" en la grilla
// TODO: recibir como prop desde page.tsx cuando el endpoint retorne el último resultado
const WINNER_ANIMAL_ID = 2 // Águila #02

/** Card pequeña de la grilla de 25 animales */
function AnimalCard({ entry }: { entry: DreamEntry }) {
  const imageSrc = resolveImage(entry)
  const isWinner = entry.id === WINNER_ANIMAL_ID

  return (
    <div className={`
      relative flex flex-col items-center gap-2 rounded-[1.25rem] p-4 cursor-pointer
      transition-all duration-200 hover:-translate-y-0.5
      ${isWinner
        ? "bg-gradient-to-b from-[#2B2B2B] to-[#1f2d1f] border border-[#009640]/50 shadow-[0_0_0_1px_rgba(0,150,64,0.3),0_8px_30px_rgba(0,150,64,0.15)]"
        : "bg-[#2B2B2B] border border-[#FFCC00]/[0.08] hover:bg-[#333] hover:border-[#FFCC00]/45 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,204,0,0.3),0_0_20px_rgba(255,204,0,0.06)]"
      }
    `}>
      {/* Brillo superior sutil */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[rgba(255,204,0,0.15)] to-transparent" />

      {/* Badge "★ HOY" en ganador */}
      {isWinner && (
        <span className="absolute top-1.5 right-1.5 text-[9px] font-extrabold text-[#009640]
                         bg-[#009640]/12 px-1.5 py-0.5 rounded tracking-[0.05em] leading-none">
          ★ HOY
        </span>
      )}

      <div className="w-12 h-12 shrink-0 sm:w-10 sm:h-10">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={entry.name}
            className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(245,181,0,0.3)]"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg text-muted-foreground">?</span>
          </div>
        )}
      </div>

      <p className="text-[0.625rem] font-bold text-white/75 uppercase tracking-[0.08em]
                    font-[var(--font-gunterz)] text-center leading-tight">
        {entry.name}
      </p>

      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0
                       shadow-[0_2px_8px_rgba(245,130,32,0.4)]
                       ${isWinner
                         ? "bg-[#009640] shadow-[0_0_12px_rgba(0,150,64,0.6)]"
                         : "bg-[#F58220]"
                       }`}>
        <span className="text-[0.6875rem] font-extrabold text-white font-[var(--font-gunterz)] leading-none">
          {entry.number}
        </span>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface DreamsSearchClientProps {
  entries: DreamEntry[]
}

export function DreamsSearchClient({ entries }: DreamsSearchClientProps) {
  const [query,        setQuery]        = useState("")
  const [loading,      setLoading]      = useState(false)
  const [result,       setResult]       = useState<InterpretResult | null>(null)
  const [error,        setError]        = useState<string | null>(null)
  const [showGrid,     setShowGrid]     = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px"
  }, [query])

  // Grilla completa: los 25 animales siempre visibles.
  // Los que vienen de la API tienen dreams cargados; el resto se completa desde animals.ts.
  const fullEntries = useMemo<DreamEntry[]>(() => {
    return animals.map((local) => {
      const apiEntry = entries.find((e) => e.id === local.id)
      if (apiEntry) return apiEntry
      return {
        id: local.id,
        name: local.name,
        number: local.id,
        image_url: local.image,
        dreams: "",
      }
    })
  }, [entries])

  // Filtrado en tiempo real para la grilla
  const filtered = query.trim()
    ? fullEntries.filter((e) => {
        const q = query.toLowerCase()
        return e.name.toLowerCase().includes(q) || e.dreams.toLowerCase().includes(q)
      })
    : fullEntries

  const isEmpty     = query.trim().length > 0 && filtered.length === 0
  const canInterpret = query.trim().length >= 3

  async function handleInterpret() {
    if (!canInterpret || loading) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`${API_BASE}/interpret-dream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream: query.trim() }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as InterpretResult
      setResult(data)
      setShowGrid(false) // colapsa la grilla cuando hay resultado
    } catch {
      setError("No se pudo interpretar el sueño. Intentá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setResult(null)
    setError(null)
    setQuery("")
    setShowGrid(true)
    textareaRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleInterpret()
    }
  }

  return (
    <section id="suenos" className="relative py-20 md:py-28 bg-[#222222] overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#FFCC00]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#009640]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                           bg-loteria-dark/20 text-white border border-white/20
                           text-sm font-semibold uppercase tracking-wide mb-6">
            <Moon size={15} />
            Oráculo de los Sueños
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white
                         drop-shadow-md uppercase tracking-tighter font-[var(--font-gunterz)]">
            ¿Qué soñaste{" "}
            <span className="text-loteria-yellow drop-shadow-md">anoche?</span>
          </h2>

          <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto">
            Relatá tu sueño y el Oráculo te revela tu animal y número de la suerte.
          </p>
        </div>

        {/* ── Panel del Oráculo ── */}
        <div className="max-w-2xl mx-auto mb-10">
          {!result ? (
            <div className="oraculo-panel">
              <div className="relative bg-[rgba(255,255,255,0.03)] rounded-[2rem] p-6
                              backdrop-blur-[24px]
                              shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_0_40px_rgba(255,204,0,0.04),inset_0_2px_0_rgba(255,204,0,0.08)]">

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Contame qué soñaste... (ej: soñé que volaba sobre un río y había un toro)"
                rows={3}
                className="w-full bg-transparent text-white placeholder:text-white/40
                           focus:outline-none resize-none text-base leading-relaxed
                           border-b border-white/10 pb-4 mb-4"
                style={{ minHeight: "72px", maxHeight: "160px" }}
              />

              <div className="flex items-center justify-between gap-3">
                <p className="hidden sm:block text-white/30 text-xs">
                  {canInterpret ? "Ctrl+Enter para interpretar" : ""}
                </p>

                <button
                  onClick={handleInterpret}
                  disabled={!canInterpret || loading}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl font-bold text-sm
                    uppercase tracking-[0.08em] transition-all duration-200
                    ${canInterpret && !loading
                      ? "bg-gradient-to-br from-[#F58220] to-[#e06a10] text-white shadow-[0_4px_20px_rgba(245,130,32,0.4),0_0_0_1px_rgba(255,204,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgba(245,130,32,0.55),0_0_0_1px_rgba(255,204,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-px cursor-pointer"
                      : "bg-white/10 text-white/30 cursor-not-allowed"
                    }
                  `}
                >
                  <Sparkles size={14} />
                  Interpretar sueño
                </button>
              </div>

              {/* Loading */}
              {loading && <OracleLoading />}

              {/* Error */}
              {error && (
                <p className="mt-4 text-center text-red-400 text-sm">{error}</p>
              )}
              </div>{/* /inner panel */}
            </div>{/* /oraculo-panel */}
          ) : (
            <OracleResultCard result={result} onReset={handleReset} />
          )}
        </div>

        {/* ── Separador + toggle grilla ── */}
        <div className="flex items-center gap-4 mb-6 max-w-2xl mx-auto">
          <div className="flex-1 h-px bg-white/15" />
          <button
            onClick={() => setShowGrid((v) => !v)}
            className="flex items-center gap-1.5 text-white/60 hover:text-white
                       transition-colors text-xs uppercase tracking-widest"
          >
            {showGrid ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showGrid ? "Ocultar" : "Ver"} los 25 animales
          </button>
          <div className="flex-1 h-px bg-white/15" />
        </div>

        {/* ── Grilla de los 25 animales ── */}
        {showGrid && (
          <>
            {/* Contador */}
            {query.trim() && (
              <p className="text-sm text-white/80 mb-4 text-center">
                {filtered.length}{" "}
                {filtered.length === 1 ? "resultado" : "resultados"} para{" "}
                <span className="text-white font-semibold">
                  &ldquo;{query}&rdquo;
                </span>
              </p>
            )}

            {/* Empty state búsqueda */}
            {isEmpty && (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <Frown className="w-10 h-10 text-white/40" />
                <p className="text-white/70 text-base">
                  Tu sueño es muy raro,{" "}
                  <span className="text-white font-semibold">
                    ¡probá con otra palabra!
                  </span>
                </p>
              </div>
            )}

            {!isEmpty && (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {filtered.map((entry) => (
                  <AnimalCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
