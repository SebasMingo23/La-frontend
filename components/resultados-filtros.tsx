"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { CalendarDays, X } from "lucide-react"

const TURNOS = ["Mañana", "Tarde", "Noche"] as const

interface Props {
  /** true → clases adaptadas para fondo blanco (sidebar claro) */
  light?: boolean
}

export function ResultadosFiltros({ light }: Props = {}) {
  const router       = useRouter()
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
      {/* Selector de fecha */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <CalendarDays className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none
                                    ${light ? "text-gray-400" : "text-muted-foreground"}`} />
          <input
            type="date"
            value={fecha}
            onChange={(e) => update("fecha", e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-2xl border-2 text-sm
                        focus:outline-none focus:border-primary transition-colors
                        ${light
                          ? "bg-gray-50 border-gray-200 text-gray-800 [color-scheme:light]"
                          : "bg-card border-border text-foreground [color-scheme:dark]"
                        }`}
          />
        </div>

        {hasFilters && (
          <button
            onClick={clearAll}
            className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl text-sm transition-colors
                        ${light
                          ? "bg-gray-100 text-gray-500 hover:text-gray-800"
                          : "bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`}
          >
            <X size={14} />
            Limpiar
          </button>
        )}
      </div>

      {/* Pills de turno */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => update("turno", "")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            !turno
              ? "bg-primary text-white"
              : light
              ? "bg-gray-100 border border-gray-200 text-gray-500 hover:border-primary/50 hover:text-gray-800"
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
                ? "bg-primary text-white"
                : light
                ? "bg-gray-100 border border-gray-200 text-gray-500 hover:border-primary/50 hover:text-gray-800"
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
