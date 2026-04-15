"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Sparkles, Moon, BookOpen } from "lucide-react"
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

// Estado visual de cada card según el contexto actual
type CardState = "neutral" | "highlighted" | "dimmed" | "oracle-result"

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
      {/* Glow verde — el Oráculo eligió */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#009640]/20 via-[#FFCC00]/10 to-[#009640]/20
                      rounded-[3rem] blur-2xl opacity-70 animate-pulse pointer-events-none" />

      <div className="relative bg-[#2B2B2B]/95 border border-[#009640]/40 rounded-[2.5rem]
                      p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,150,64,0.15)] text-center">

        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                         bg-[#009640]/15 text-[#009640] text-xs font-semibold uppercase tracking-widest mb-5
                         border border-[#009640]/30">
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
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,150,64,0.4)]"
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
                        bg-[#009640]"
             style={{ boxShadow: "0 0 20px rgba(0,150,64,0.6), 0 0 40px rgba(0,150,64,0.25), inset 0 2px 0 rgba(255,255,255,0.15)" }}>
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
                className="px-3 py-1 rounded-full bg-[#FFCC00]/15 text-[#FFCC00]
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
          className="text-xs text-muted-foreground hover:text-[#F58220] transition-colors
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
        <div className="absolute inset-0 rounded-full border-2 border-[#FFCC00]/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-[#FFCC00]/50 animate-ping
                        [animation-delay:150ms]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-[#FFCC00] animate-pulse" />
        </div>
      </div>
      <p className="text-white/70 text-sm uppercase tracking-widest animate-pulse">
        Interpretando tu sueño...
      </p>
    </div>
  )
}

// ID del último animal ganador — badge "★ HOY" permanente en la grilla
// TODO: recibir como prop desde page.tsx (API /ultimo-resultado)
const WINNER_ANIMAL_ID = 2 // Águila #02

/** Card de animal del catálogo — reacciona al estado del Oráculo */
function AnimalCard({ entry, state }: { entry: DreamEntry; state: CardState }) {
  const imageSrc = resolveImage(entry)
  const isWinner = entry.id === WINNER_ANIMAL_ID

  // Estilos de borde y fondo por estado
  const containerClass = (() => {
    switch (state) {
      case "oracle-result":
        return "border-[#009640]/70 bg-gradient-to-b from-[#2B2B2B] to-[#1f2d1f] scale-[1.06] shadow-[0_0_0_1px_rgba(0,150,64,0.4),0_12px_30px_rgba(0,150,64,0.2)]"
      case "highlighted":
        return "border-[#FFCC00]/60 bg-[#333] scale-[1.03] shadow-[0_0_0_1px_rgba(255,204,0,0.4),0_8px_30px_rgba(0,0,0,0.5)]"
      case "dimmed":
        return "border-[#FFCC00]/[0.04] opacity-50 scale-[0.98] pointer-events-none"
      case "neutral":
      default:
        if (isWinner) {
          return "border-[#009640]/50 bg-gradient-to-b from-[#2B2B2B] to-[#1f2d1f] shadow-[0_0_0_1px_rgba(0,150,64,0.3),0_8px_30px_rgba(0,150,64,0.15)]"
        }
        return "border-[#FFCC00]/[0.08] hover:bg-[#333] hover:border-[#FFCC00]/45 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,204,0,0.3),0_0_20px_rgba(255,204,0,0.06)] hover:-translate-y-0.5"
    }
  })()

  // Badge superior de la card
  const badge = (() => {
    if (state === "oracle-result") {
      return (
        <span className="absolute top-1.5 right-1.5 text-[8px] font-extrabold text-[#009640]
                         bg-[#009640]/15 px-1.5 py-0.5 rounded tracking-[0.04em] leading-none animate-pulse">
          ✦ TU #
        </span>
      )
    }
    if (isWinner && state !== "dimmed") {
      return (
        <span className="absolute top-1.5 right-1.5 text-[9px] font-extrabold text-[#009640]
                         bg-[#009640]/12 px-1.5 py-0.5 rounded tracking-[0.05em] leading-none">
          ★ HOY
        </span>
      )
    }
    return null
  })()

  // Bolita del número
  const numberBgClass = (state === "oracle-result" || (state === "neutral" && isWinner))
    ? "bg-[#009640]"
    : "bg-[#F58220]"

  const numberShadow = (state === "oracle-result" || (state === "neutral" && isWinner))
    ? "0 0 12px rgba(0,150,64,0.6)"
    : "0 2px 8px rgba(245,130,32,0.4)"

  const iconGlow = state === "oracle-result"
    ? "drop-shadow-[0_0_16px_rgba(0,150,64,0.5)]"
    : "drop-shadow-[0_0_8px_rgba(245,181,0,0.3)]"

  return (
    <div className={`
      relative flex flex-col items-center gap-2 rounded-[1.25rem] p-4 cursor-pointer
      bg-[#2B2B2B] border transition-all duration-300
      ${containerClass}
    `}>
      {/* Brillo superior sutil */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[rgba(255,204,0,0.15)] to-transparent" />

      {badge}

      <div className="w-12 h-12 shrink-0 sm:w-10 sm:h-10">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={entry.name}
            className={`w-full h-full object-contain ${iconGlow}`}
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

      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${numberBgClass}`}
        style={{ boxShadow: numberShadow }}
      >
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
  const [query,   setQuery]   = useState("")
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState<InterpretResult | null>(null)
  const [error,   setError]   = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px"
  }, [query])

  // Los 25 animales siempre presentes — API complementa con datos de sueños
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

  // Estado visual de cada card según el contexto
  const getCardState = useMemo(() => {
    const q = query.toLowerCase().trim()

    // Post-resultado: spotlight sobre el animal elegido
    if (result) {
      return (entry: DreamEntry): CardState =>
        entry.id === result.animal_id ? "oracle-result" : "dimmed"
    }

    // Sin texto: todos neutral
    if (!q) return (_entry: DreamEntry): CardState => "neutral"

    // Hay texto: spotlight solo si existe al menos 1 coincidencia
    const hasAnyMatch = fullEntries.some(
      (e) => e.name.toLowerCase().includes(q) || e.dreams.toLowerCase().includes(q)
    )
    if (!hasAnyMatch) return (_entry: DreamEntry): CardState => "neutral"

    return (entry: DreamEntry): CardState => {
      const matches =
        entry.name.toLowerCase().includes(q) ||
        entry.dreams.toLowerCase().includes(q)
      return matches ? "highlighted" : "dimmed"
    }
  }, [query, result, fullEntries])

  // Texto del catálogo según el estado
  const catalogLabel = (() => {
    if (result) return `El Oráculo reveló: ${result.animal_name} entre los 25`
    const q = query.toLowerCase().trim()
    if (!q) return "Los 25 animales oficiales"
    const matchCount = fullEntries.filter(
      (e) => e.name.toLowerCase().includes(q) || e.dreams.toLowerCase().includes(q)
    ).length
    if (matchCount === 0) return "Los 25 animales oficiales"
    return `${matchCount} ${matchCount === 1 ? "coincidencia" : "coincidencias"} con tu relato`
  })()

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
      {/* Textura de billetes — marca de agua de seguridad bancaria */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/pattern-money-bills.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "260px",
          opacity: 0.04,
        }}
      />

      {/* Background blobs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#FFCC00]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#009640]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                           bg-white/[0.06] text-white border border-white/20
                           text-sm font-semibold uppercase tracking-wide mb-6">
            <Moon size={15} />
            Oráculo de los Sueños
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white
                         drop-shadow-md uppercase tracking-tighter font-[var(--font-gunterz)]">
            ¿Qué soñaste{" "}
            <span className="text-[#FFCC00] drop-shadow-md">anoche?</span>
          </h2>

          <p className="mt-4 text-white/70 text-lg max-w-xl mx-auto">
            Relatá tu sueño y el Oráculo te revela tu animal y número de la suerte.
          </p>
        </div>

        {/* ── Panel del Oráculo / Resultado ── */}
        <div className="max-w-2xl mx-auto mb-10">
          {!result ? (
            <div className="oraculo-panel">
              <div className="relative bg-[rgba(255,255,255,0.03)] rounded-[2rem] p-6
                              backdrop-blur-[24px]
                              shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_0_40px_rgba(255,204,0,0.04),inset_0_2px_0_rgba(255,204,0,0.08)]">

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
                        ? "bg-gradient-to-br from-[#F58220] to-[#e06a10] text-white shadow-[0_4px_20px_rgba(245,130,32,0.4),0_0_0_1px_rgba(255,204,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgba(245,130,32,0.55),0_0_0_1px_rgba(255,204,0,0.25)] hover:-translate-y-px cursor-pointer"
                        : "bg-white/10 text-white/30 cursor-not-allowed"
                      }
                    `}
                  >
                    <Sparkles size={14} />
                    Interpretar sueño
                  </button>
                </div>

                {loading && <OracleLoading />}

                {error && (
                  <p className="mt-4 text-center text-red-400 text-sm">{error}</p>
                )}
              </div>
            </div>
          ) : (
            <OracleResultCard result={result} onReset={handleReset} />
          )}
        </div>

        {/* ── Catálogo — siempre visible, nunca filtrado ── */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest whitespace-nowrap">
            <BookOpen size={11} />
            <span className="transition-all duration-500">{catalogLabel}</span>
          </div>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {fullEntries.map((entry) => (
            <AnimalCard
              key={entry.id}
              entry={entry}
              state={getCardState(entry)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
