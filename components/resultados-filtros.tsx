"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { CalendarDays, X } from "lucide-react"

const TURNOS = ["Mañana", "Tarde", "Noche", "Nocturna"] as const

export function ResultadosFiltros() {
  const router      = useRouter()
  const searchParams = useSearchParams()

  const fecha = searchParams.get("fecha") ?? ""
  const turno = searchParams.get("turno") ?? ""

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/resultados?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearAll = () => router.push("/resultados")

  const hasFilters = fecha || turno

  return (
    <div className="flex flex-col gap-4">
      {/* Date picker */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="date"
            value={fecha}
            onChange={(e) => update("fecha", e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card border-2 border-border rounded-2xl
                       text-foreground focus:outline-none focus:border-primary
                       transition-colors text-sm [color-scheme:dark]"
          />
        </div>

        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-muted/50
                       text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <X size={14} />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Turno pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => update("turno", "")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            !turno
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
          }`}
        >
          Todos
        </button>
        {TURNOS.map((t) => (
          <button
            key={t}
            onClick={() => update("turno", turno === t ? "" : t)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              turno === t
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}
