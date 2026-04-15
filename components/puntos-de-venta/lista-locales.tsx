"use client"

import { useEffect, useRef } from "react"
import { MapPin, Phone, ChevronRight } from "lucide-react"
import type { Local } from "@/lib/types"

interface Props {
  locales: Local[]
  selectedId: number | null
  onSelectLocal: (id: number) => void
  searchText: string
  statusFilter: "todos" | "abierto" | "cerrado"
}

// Horario estimado hasta que el endpoint devuelva datos reales de cada agencia
const HORA_APERTURA = 8   // 8:00
const HORA_CIERRE   = 20  // 20:00

function estaAbiertoAhora(): boolean {
  const now  = new Date()
  const hora = now.getHours()
  const dia  = now.getDay() // 0 = domingo
  return dia !== 0 && hora >= HORA_APERTURA && hora < HORA_CIERRE
}

export function ListaLocales({ locales, selectedId, onSelectLocal, searchText, statusFilter }: Props) {
  const itemRefs   = useRef<Record<number, HTMLDivElement | null>>({})
  const listRef    = useRef<HTMLDivElement>(null)
  const abierto    = estaAbiertoAhora()

  // ─── Sincronización bidireccional: selectedId → scroll de lista ──
  useEffect(() => {
    if (!selectedId) return
    const el = itemRefs.current[selectedId]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [selectedId])

  // ─── Filtrado ─────────────────────────────────────────────────
  const filtered = locales.filter((local) => {
    const q = searchText.toLowerCase()
    const matchesSearch =
      local.nombre.toLowerCase().includes(q) ||
      (local.direccion ?? "").toLowerCase().includes(q)

    if (statusFilter === "abierto")  return matchesSearch && abierto
    if (statusFilter === "cerrado") return matchesSearch && !abierto
    return matchesSearch
  })

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-border">
      {/* Contador */}
      <p className="text-xs text-muted-foreground px-1 pb-1">
        {filtered.length} agencia{filtered.length !== 1 ? "s" : ""}
        {searchText ? ` para "${searchText}"` : ""}
      </p>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <MapPin className="w-10 h-10 text-border" />
          <p className="text-muted-foreground text-sm">
            No se encontraron agencias
          </p>
          {statusFilter !== "todos" && (
            <p className="text-xs text-muted-foreground/70">
              Probá cambiando el filtro de estado
            </p>
          )}
        </div>
      )}

      {filtered.map((local) => {
        const isSelected = selectedId === local.id

        return (
          <div
            key={local.id}
            ref={(el) => { itemRefs.current[local.id] = el }}
            onClick={() => onSelectLocal(local.id)}
            className={`
              group p-4 rounded-2xl cursor-pointer transition-all duration-200 border
              ${isSelected
                ? "bg-primary/15 border-primary/50 shadow-[0_0_20px_rgba(255,122,0,0.12)]"
                : "bg-background/30 border-border hover:border-primary/30 hover:bg-background/50"
              }
            `}
          >
            <div className="flex items-center gap-3">

              {/* Foto del local o pin indicador */}
              {local.foto_url ? (
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 transition-colors
                  ${isSelected ? "border-primary" : "border-border group-hover:border-primary/40"}
                `}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={local.foto_url}
                    alt={local.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`
                  flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors
                  ${isSelected ? "bg-primary" : "bg-primary/20 group-hover:bg-primary/30"}
                `}>
                  <MapPin className={`w-4 h-4 ${isSelected ? "text-white" : "text-primary"}`} />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`
                  font-semibold text-sm truncate transition-colors
                  ${isSelected ? "text-primary" : "text-foreground group-hover:text-primary"}
                `}>
                  {local.nombre}
                </p>
                {local.direccion ? (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{local.direccion}</p>
                ) : (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${abierto ? "bg-green-400" : "bg-red-400"}`} />
                    <span className="text-xs text-muted-foreground">
                      {abierto ? "Abierto" : "Cerrado"} · Lun–Sáb {HORA_APERTURA}:00–{HORA_CIERRE}:00
                    </span>
                  </div>
                )}
                {local.telefono && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Phone className="w-3 h-3 text-primary flex-shrink-0" />
                    {local.telefono}
                  </span>
                )}
              </div>

              {/* Arrow */}
              <ChevronRight className={`
                w-4 h-4 flex-shrink-0 transition-all
                ${isSelected
                  ? "text-primary translate-x-0.5"
                  : "text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5"
                }
              `} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
