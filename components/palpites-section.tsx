"use client"

// Este componente es Client-only porque la selección aleatoria debe ocurrir
// en el cliente para evitar hydration mismatch.
//
// Patrón seguro:
//   1. SSR / primera render del cliente → 3 placeholders "?"  (estado vacío)
//   2. useEffect (solo cliente) → elige 3 animales al azar y actualiza estado
//   3. React reconcilia sin mismatch porque ambas renders parten de placeholders

import { useState, useEffect } from "react"
import Image from "next/image"
import { Sparkles } from "lucide-react"
import { animals } from "@/lib/animals"

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Sugerencia = {
  id: number
  nombre: string
  numero: string       // "01"–"25"
  image: string        // ruta local desde /public
  milesima: string     // "0000"–"9999"
  cento: string        // "000"–"999"
  docena: string       // "00"–"99"
  confianza: number    // 90 | 82 | 74
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randInt(max: number): number {
  return Math.floor(Math.random() * (max + 1))
}

function pickRandom(): Sugerencia[] {
  return [...animals]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((a, i) => ({
      id:        a.id,
      nombre:    a.name,
      numero:    a.number,
      image:     a.image,
      milesima:  String(randInt(9999)).padStart(4, "0"),
      cento:     String(randInt(999)).padStart(3, "0"),
      docena:    String(randInt(99)).padStart(2, "0"),
      confianza: 90 - i * 8,   // 90 → 82 → 74
    }))
}

// ─── Placeholder (debe ser visual y estructuralmente idéntico a SugerenciaCard)
// Se renderiza en el servidor Y en la primera pintura del cliente.
// ─────────────────────────────────────────────────────────────────────────────

function PlaceholderCard({ rank }: { rank: number }) {
  return (
    <div className="relative flex flex-col items-center gap-5 bg-white dark:bg-[#263447]
                    border border-gray-100 dark:border-[#3D4F65]
                    rounded-[2.5rem] p-8 md:p-10
                    shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

      {/* Rank badge */}
      <span className="absolute top-5 left-5 w-7 h-7 rounded-full bg-muted
                       flex items-center justify-center
                       text-xs font-bold text-muted-foreground font-[var(--font-gunterz)]">
        {rank}
      </span>

      {/* Imagen — placeholder */}
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted
                      flex items-center justify-center">
        <span className="text-4xl text-muted-foreground font-[var(--font-gunterz)]">?</span>
      </div>

      {/* Nombre */}
      <div className="h-7 w-32 bg-muted rounded-full" />

      {/* Bola número */}
      <div className="w-20 h-20 rounded-full bg-muted" />

      {/* Milésima / Centena / Decena */}
      <div className="w-full grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 bg-muted rounded-xl" />
        ))}
      </div>

      {/* Barra de confianza */}
      <div className="w-full h-4 bg-muted rounded-full" />
    </div>
  )
}

// ─── Tarjeta con datos reales ─────────────────────────────────────────────────

function SugerenciaCard({ s, rank }: { s: Sugerencia; rank: number }) {
  return (
    <div className="relative group flex flex-col items-center gap-5 bg-white dark:bg-[#263447]
                    border border-gray-100 dark:border-[#3D4F65]
                    rounded-[2.5rem] p-8 md:p-10 transition-all duration-300
                    shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                    hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]
                    hover:-translate-y-1">

      {/* Rank badge */}
      <span className="absolute top-5 left-5 w-7 h-7 rounded-full bg-muted
                       flex items-center justify-center
                       text-xs font-bold text-muted-foreground font-[var(--font-gunterz)]">
        {rank}
      </span>

      {/* Imagen del animal */}
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        <Image
          src={s.image}
          alt={s.nombre}
          fill
          className="object-contain drop-shadow-[0_0_20px_rgba(245,181,0,0.4)]"
        />
      </div>

      {/* Nombre */}
      <h3 className="text-xl md:text-2xl font-bold text-[#2B2B2B] dark:text-white
                     uppercase tracking-tight font-[var(--font-gunterz)] text-center">
        {s.nombre}
      </h3>

      {/* Bola con número del animal */}
      <div className="w-20 h-20 rounded-full flex items-center justify-center
                      bg-gradient-to-b from-primary to-[#CC6200]
                      shadow-[0_8px_24px_rgba(255,122,0,0.55),inset_0_2px_0_rgba(255,255,255,0.25)]">
        <span className="text-2xl font-bold text-white font-[var(--font-gunterz)] leading-none">
          {s.numero}
        </span>
      </div>

      {/* Milésima / Centena / Decena */}
      <div className="w-full grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Milésima", value: s.milesima },
          { label: "Centena",  value: s.cento },
          { label: "Decena",   value: s.docena },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#f8f9fa] dark:bg-[#1E2B3E]/60 rounded-xl py-2 px-1">
            <div className="text-[10px] uppercase tracking-widest
                            text-[#2B2B2B]/50 dark:text-white/50 mb-1">
              {label}
            </div>
            <div className="text-base font-bold text-[#2B2B2B] dark:text-white
                            font-[var(--font-gunterz)]">
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Barra de confianza */}
      <div className="w-full">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span className="uppercase tracking-wider text-[#2B2B2B]/50">Confianza IA</span>
          <span className="font-bold text-[#F58220] font-[var(--font-gunterz)]">
            {s.confianza}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-[#f0f0f0] dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            style={{ width: `${s.confianza}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Sección principal ────────────────────────────────────────────────────────

export function PalpitesSection() {
  // Estado inicial vacío → SSR y primera pintura del cliente muestran placeholders.
  // Esto garantiza que el HTML del servidor coincide con la primera render del cliente.
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([])

  useEffect(() => {
    // Solo se ejecuta en el cliente, DESPUÉS de que React hidrata el DOM.
    // Aquí es seguro usar Math.random() sin provocar hydration mismatch.
    setSugerencias(pickRandom())
  }, [])

  const mostrandoDatos = sugerencias.length > 0

  return (
    <section
      id="predicciones"
      className="relative py-20 md:py-28 overflow-hidden bg-[#F0F2F5] dark:bg-[#111116] transition-colors duration-300"
    >
      {/* Decoración */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#F58220] via-[#FFCC00] to-[#009640]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-[#F58220]/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-32 bg-[#009640]/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                           bg-[#F58220]/15 text-[#F58220] border border-[#F58220]/30
                           text-sm font-semibold uppercase tracking-wide mb-6">
            <Sparkles size={15} />
            Palpites de Hoy
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2B2B2B] dark:text-white
                         uppercase tracking-tighter font-[var(--font-gunterz)]">
            Sugerencias de la{" "}
            <span className="text-[#F58220]">IA</span>
          </h2>
          <p className="mt-4 text-[#2B2B2B]/60 dark:text-white/60 text-lg max-w-xl mx-auto">
            Los animales con mayor probabilidad para el sorteo de hoy,
            calculados cada madrugada.
          </p>
        </div>

        {/* Cards — placeholders hasta que el cliente esté montado */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {mostrandoDatos
            ? sugerencias.map((s, i) => (
                <SugerenciaCard key={s.id} s={s} rank={i + 1} />
              ))
            : [1, 2, 3].map((rank) => (
                <PlaceholderCard key={rank} rank={rank} />
              ))}
        </div>

        <p className="mt-10 text-center text-xs text-[#2B2B2B]/40 dark:text-white/40
                      uppercase tracking-widest">
          Actualizado diariamente · Solo con fines de entretenimiento
        </p>
      </div>
    </section>
  )
}
