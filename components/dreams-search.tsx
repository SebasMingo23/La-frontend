"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Sparkles, Moon, BookOpen } from "lucide-react"
import { animals } from "@/lib/animals"
import type { DreamEntry } from "@/lib/types"
import { useTheme } from "next-themes"

import { WORDPRESS_API_URL } from '@/lib/constants'

const API_BASE = WORDPRESS_API_URL

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

/** Íconos blancos — fondo oscuro, alta visibilidad */
const blancosMap: Record<number, string> = {
  1:  "/images/animales/blancos/avestruz-iconos-animales-blanco.png",
  2:  "/images/animales/blancos/aguila-iconos-animales-blanco.png",
  3:  "/images/animales/blancos/burro-iconos-animales-blanco.png",
  4:  "/images/animales/blancos/mariposa-iconos-animales-blanco.png",
  5:  "/images/animales/blancos/perro-iconos-animales-blanco.png",
  6:  "/images/animales/blancos/cabra-iconos-animales-blanco.png",
  7:  "/images/animales/blancos/oveja-iconos-animales-blanco.png",
  8:  "/images/animales/blancos/camello-iconos-animales-blanco.png",
  9:  "/images/animales/blancos/cobra-iconos-animales-blanco.png",
  10: "/images/animales/blancos/conejo-iconos-animales-blanco.png",
  11: "/images/animales/blancos/caballo-iconos-animales-blanco.png",
  12: "/images/animales/blancos/elefante-iconos-animales-blanco.png",
  13: "/images/animales/blancos/gallo-iconos-animales-blanco.png",
  14: "/images/animales/blancos/gato-iconos-animales-blanco.png",
  15: "/images/animales/blancos/cocodrilo-iconos-animales-blanco.png",
  16: "/images/animales/blancos/leon-iconos-animales-blanco.png",
  17: "/images/animales/blancos/mono-iconos-animales-blanco.png",
  18: "/images/animales/blancos/chancho-iconos-animales-blanco.png",
  19: "/images/animales/blancos/pavo-real-iconos-animales-blanco.png",
  20: "/images/animales/blancos/pavo-iconos-animales-blanco.png",
  21: "/images/animales/blancos/toro-iconos-animales-blanco.png",
  22: "/images/animales/blancos/tigre-iconos-animales-blanco.png",
  23: "/images/animales/blancos/oso-iconos-animales-blanco.png",
  24: "/images/animales/blancos/ciervo-iconos-animales-blanco.png",
  25: "/images/animales/blancos/vaca-iconos-animales-blanco.png",
}

/** Íconos negros — máximo contraste sobre tarjetas claras (estilo Fintech/Apple) */
const negrosMap: Record<number, string> = {
  1:  "/images/animales/negros/Avestruz.png",
  2:  "/images/animales/negros/Aguila.png",
  3:  "/images/animales/negros/Burro.png",
  4:  "/images/animales/negros/Mariposa.png",
  5:  "/images/animales/negros/Perro.png",
  6:  "/images/animales/negros/Cabra.png",
  7:  "/images/animales/negros/Oveja.png",
  8:  "/images/animales/negros/Camello.png",
  9:  "/images/animales/negros/Cobra.png",
  10: "/images/animales/negros/Conejo.png",
  11: "/images/animales/negros/Caballo.png",
  12: "/images/animales/negros/Elefante.png",
  13: "/images/animales/negros/Gallo.png",
  14: "/images/animales/negros/Gata.png",
  15: "/images/animales/negros/Cocodrilo.png",
  16: "/images/animales/negros/Leon.png",
  17: "/images/animales/negros/Mono.png",
  18: "/images/animales/negros/Cerdo.png",
  19: "/images/animales/negros/Pavo real.png",
  20: "/images/animales/negros/Pavo.png",
  21: "/images/animales/negros/Toro.png",
  22: "/images/animales/negros/Tigre.png",
  23: "/images/animales/negros/Oso.png",
  24: "/images/animales/negros/Ciervo.png",
  25: "/images/animales/negros/Vaca.png",
}

/** Fallback original con dorados (usado por OracleResultCard) */
function resolveImage(entry: DreamEntry): string | null {
  if (entry.image_url) return entry.image_url
  const match = animals.find((a) => a.id === entry.id)
  return match?.image ?? null
}

/** Íconos negros para la grilla (fondo claro) — contraste garantizado */
function resolveImageDark(entry: DreamEntry): string | null {
  return negrosMap[entry.id] ?? resolveImage(entry)
}

function resolveImageById(id: number, apiUrl: string): string {
  return negrosMap[id] ?? apiUrl ?? animals.find((a) => a.id === id)?.image ?? ""
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

/** Card de resultado del Oráculo */
function OracleResultCard({
  result,
  onReset,
  isDark,
}: {
  result: InterpretResult
  onReset: () => void
  isDark: boolean
}) {
  const imgSrc = resolveImageById(result.animal_id, result.image_url)

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow verde — el Oráculo eligió */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#009640]/20 via-[#FFCC00]/10 to-[#009640]/20
                      rounded-[3rem] blur-2xl opacity-70 animate-pulse pointer-events-none" />

      <div className={`relative rounded-[2.5rem] p-8 md:p-10 text-center border border-[#009640]/30 dark:border-[#009640]/40
                      ${isDark
                        ? "bg-[#2B2B2B]/95 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,150,64,0.15)]"
                        : "bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,150,64,0.12)]"
                      }`}>

        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                         bg-[#009640]/10 text-[#009640] text-xs font-semibold uppercase tracking-widest mb-5
                         border border-[#009640]/25">
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
              className="w-full h-full object-contain drop-shadow-[0_4px_24px_rgba(0,0,0,0.18)]"
            />
          </div>
        )}

        {/* Nombre */}
        <h3 className={`font-[var(--font-gunterz)] text-3xl md:text-4xl font-bold uppercase tracking-tight mb-3 ${isDark ? "text-white" : "text-[#2B2B2B]"}`}>
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
        <p className={`text-sm md:text-base leading-relaxed max-w-sm mx-auto mb-5 ${isDark ? "text-white/80" : "text-[#2B2B2B]/70"}`}>
          {result.explanation}
        </p>

        {/* Keywords detectadas */}
        {result.matched_keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {result.matched_keywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 rounded-full bg-[#F58220]/10 text-[#F58220]
                           text-xs font-semibold uppercase tracking-wide border border-[#F58220]/20"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Reset */}
        <button
          onClick={onReset}
          className={`text-xs hover:text-[#F58220] transition-colors uppercase tracking-widest underline underline-offset-4 ${isDark ? "text-white/40" : "text-[#2B2B2B]/40"}`}
        >
          Interpretar otro sueño
        </button>
      </div>
    </div>
  )
}

/** Estado de carga del Oráculo */
function OracleLoading({ isDark }: { isDark: boolean }) {
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
      <p className={`text-sm uppercase tracking-widest animate-pulse ${isDark ? "text-white/70" : "text-[#2B2B2B]/50"}`}>
        Interpretando tu sueño...
      </p>
    </div>
  )
}

/** Partículas doradas flotantes que emergen del textarea durante el procesamiento */
function OracleParticles() {
  const particles = Array.from({ length: 10 }, (_, i) => i)
  return (
    <>
      {particles.map((i) => (
        <span
          key={i}
          className="oracle-particle"
          style={{
            left: `${10 + i * 8}%`,
            "--particle-dur": `${1.8 + (i % 3) * 0.25}s`,
            "--particle-delay": `${i * 0.15}s`,
          } as React.CSSProperties}
        />
      ))}
    </>
  )
}

// ID del último animal ganador — badge "★ HOY" permanente en la grilla
const WINNER_ANIMAL_ID = 2 // Águila #02

/** Card de animal del catálogo — reacciona al estado del Oráculo */
function AnimalCard({ entry, state, index, isDark }: { entry: DreamEntry; state: CardState; index: number; isDark: boolean }) {
  // Siempre íconos blancos — fondo oscuro en ambos modos
  const imageSrc = blancosMap[entry.id] ?? resolveImage(entry)
  const isWinner = entry.id === WINNER_ANIMAL_ID

  // Estilos de borde y fondo por estado — bifurcados por tema
  const containerClass = (() => {
    if (isDark) {
      // ─ Dark Mode: estilo original oscuro ─
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
          return "border-[#FFCC00]/[0.08] hover:bg-[#333] hover:border-[#FFCC00]/45 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,204,0,0.3)] hover:-translate-y-0.5"
      }
    } else {
      // ─ Light Mode (forzado nocturno): estilo oscuro igual que dark ─
      switch (state) {
        case "oracle-result":
          return "border-[#009640]/70 bg-[#009640]/20 scale-[1.06] shadow-[0_0_0_1px_rgba(0,150,64,0.4),0_12px_30px_rgba(0,150,64,0.2)]"
        case "highlighted":
          return "border-[#FFCC00]/60 bg-[#2A2A2A] scale-[1.03] shadow-[0_0_0_1px_rgba(255,204,0,0.4),0_8px_30px_rgba(0,0,0,0.5)]"
        case "dimmed":
          return "border-white/[0.04] opacity-50 scale-[0.98] pointer-events-none"
        case "neutral":
        default:
          if (isWinner) {
            return "border-[#009640]/50 bg-[#009640]/20 shadow-[0_0_0_1px_rgba(0,150,64,0.3),0_8px_30px_rgba(0,150,64,0.15)]"
          }
          return "border-white/[0.08] bg-[#1A1A1A] hover:bg-[#222] hover:border-[#FFCC00]/45 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,204,0,0.3)] hover:-translate-y-0.5"
      }
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
    ? "drop-shadow-[0_0_16px_rgba(0,150,64,0.4)]"
    : "drop-shadow-[0_0_8px_rgba(245,181,0,0.3)]"

  // Checkerboard micro-variation — solo en estado neutral sin ganador
  const checkerBg = (state === "neutral" && !isWinner)
    ? isDark
      ? (index % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.055)")
      : (index % 2 === 0 ? "rgba(26,26,26,1)" : "rgba(30,30,30,1)")
    : undefined

  return (
    <div
      className={`animal-card relative flex flex-col items-center gap-2 rounded-[1.25rem] p-4 cursor-pointer border transition-all duration-300 ${containerClass}`}
      style={checkerBg ? { backgroundColor: checkerBg } : undefined}
      data-dimmed={state === "dimmed" ? "true" : undefined}
    >
      {/* Brillo superior sutil */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[rgba(255,204,0,0.15)] to-transparent" />

      {badge}

      <div className="w-12 h-12 shrink-0 sm:w-10 sm:h-10">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={entry.name}
            className={`animal-icon w-full h-full object-contain ${iconGlow}`}
          />
        ) : (
          <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg text-muted-foreground">?</span>
          </div>
        )}
      </div>

      <p className="text-[0.625rem] font-bold uppercase tracking-[0.08em] font-[var(--font-gunterz)] text-center leading-tight text-white">
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
  const sectionRef  = useRef<HTMLElement>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted && resolvedTheme === "dark"

  // Parallax suave en la textura de billetes — responde al scroll del usuario
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const offset = -rect.top * 0.18
      section.style.setProperty("--parallax-y", `${offset}px`)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
    <section ref={sectionRef} id="suenos" className="relative py-20 md:py-28 bg-[#2A2A2A] dark:bg-[#2A2A2A] overflow-hidden transition-colors duration-300">
      {/* Textura de billetes — marca de agua de seguridad bancaria */}
      <div
        className="oracle-bg-texture absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/pattern-money-bills.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "700px",
          opacity: 0.035,
        }}
      />

      {/* Background blobs — suaves sobre fondo claro */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#009640]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#F58220]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                           bg-[#009640]/20 text-[#00EB64] border border-[#009640]/40
                           text-sm font-semibold uppercase tracking-wide mb-6">
            <Moon size={15} />
            Oráculo de los Sueños
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white
                         uppercase tracking-tighter font-[var(--font-gunterz)]">
            ¿Qué soñaste{" "}
            <span className="text-[#FFCC00]">anoche?</span>
          </h2>

          <p className="mt-4 text-[#D9CDBF] text-lg max-w-xl mx-auto">
            Relatá tu sueño y el Oráculo te revela tu animal y número de la suerte.
          </p>
        </div>

        {/* ── Panel del Oráculo / Resultado ── */}
        <div className="max-w-2xl mx-auto mb-10">
          {!result ? (
            /* Wrapper Gemini — p-[2px] es el grosor de la línea de luz */
            <div className="relative p-[2px] rounded-[2rem] overflow-hidden">
              {/* Rayo de luz giratorio — gradiente cónico */}
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,#FFCC00_78%,#F58220_88%,#009640_95%,transparent_100%)]" />
              {/* Panel contenido — fondo sólido tapa el centro */}
              <div className="relative z-10 bg-[#1A1A1A] dark:bg-[#1A1A1A] rounded-[30px] p-6
                              shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_0_40px_rgba(255,204,0,0.04),inset_0_2px_0_rgba(255,204,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_0_40px_rgba(255,204,0,0.04),inset_0_2px_0_rgba(255,204,0,0.08)]">

                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Contame qué soñaste... (ej: soñé que volaba sobre un río y había un toro)"
                    rows={3}
                    className={`w-full bg-transparent text-white dark:text-white placeholder:text-white/40 dark:placeholder:text-white/40
                               focus:outline-none resize-none text-base leading-relaxed
                               border-b border-white/10 dark:border-white/10 pb-4 mb-4${loading ? " oracle-scanning" : ""}`}
                    style={{ minHeight: "72px", maxHeight: "160px" }}
                  />
                  {loading && <OracleParticles />}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="hidden sm:block text-white/30 dark:text-white/30 text-xs">
                    {canInterpret ? "Ctrl+Enter para interpretar" : ""}
                  </p>

                  <button
                    onClick={handleInterpret}
                    disabled={!canInterpret || loading}
                    className={`
                      group relative overflow-hidden
                      flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl font-bold text-sm
                      uppercase tracking-[0.08em] transition-all duration-500
                      ${canInterpret && !loading
                        ? "bg-gradient-to-r from-[#F58220] via-[#FFCC00] to-[#F58220] bg-[length:200%_auto] bg-[position:left_center] text-[#1a1a1a] border border-[#FFCC00]/50 shadow-[0_4px_20px_rgba(245,130,32,0.35)] hover:bg-[position:right_center] hover:shadow-[0_0_30px_rgba(245,130,32,0.6)] hover:-translate-y-1 cursor-pointer"
                        : "bg-white/10 dark:bg-white/10 text-white/40 dark:text-white/40 border border-white/10 dark:border-white/10 cursor-not-allowed"
                      }
                    `}
                  >
                    <motion.span
                      animate={loading ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] } : {}}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      className="transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125"
                    >
                      <Sparkles size={14} />
                    </motion.span>
                    Interpretar sueño
                  </button>
                </div>

                {loading && <OracleLoading isDark={isDark} />}

                {error && (
                  <p className="mt-4 text-center text-red-400 text-sm">{error}</p>
                )}
              </div>
            </div>
          ) : (
            <OracleResultCard result={result} onReset={handleReset} isDark={isDark} />
          )}
        </div>

        {/* ── Catálogo — siempre visible, nunca filtrado ── */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10 dark:bg-white/10" />
          <div className="flex items-center gap-2 text-white/40 dark:text-white/40 text-xs uppercase tracking-widest whitespace-nowrap">
            <BookOpen size={11} />
            <span className="transition-all duration-500">{catalogLabel}</span>
          </div>
          <div className="flex-1 h-px bg-white/10 dark:bg-white/10" />
        </div>

        <motion.div
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
          }}
        >
          {fullEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              variants={{
                hidden: { opacity: 0, y: 32 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <AnimalCard
                entry={entry}
                state={getCardState(entry)}
                index={i}
                isDark={isDark}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
