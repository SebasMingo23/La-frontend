"use client"

import dynamic from "next/dynamic"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, MapPin, SlidersHorizontal } from "lucide-react"
import { ListaLocales } from "./lista-locales"
import type { Local } from "@/lib/types"

// Leaflet usa window → solo en cliente
const MapaInteractivo = dynamic(
  () => import("./mapa-interactivo").then((m) => m.MapaInteractivo),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#0d1520] flex items-center justify-center">
        <MapPin className="w-8 h-8 text-primary/30 animate-bounce" />
      </div>
    ),
  }
)

type StatusFilter = "todos" | "abierto" | "cerrado"

const STATUS_LABELS: Record<StatusFilter, string> = {
  todos:   "Todos",
  abierto: "Abierto",
  cerrado: "Cerrado",
}

interface Props {
  locales: Local[]
}

export function LocationsPageClient({ locales }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [selectedId, setSelectedId]     = useState<number | null>(() => {
    const id = searchParams.get("id")
    return id ? parseInt(id, 10) : null
  })
  const [searchText, setSearchText]     = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos")
  const [filtersOpen, setFiltersOpen]   = useState(false)

  // ─── Persistir selectedId en la URL ────────────────────────────
  useEffect(() => {
    const current = searchParams.get("id")
    const next    = selectedId ? String(selectedId) : null
    if (current === next) return

    const params = new URLSearchParams(searchParams.toString())
    if (selectedId) {
      params.set("id", String(selectedId))
    } else {
      params.delete("id")
    }
    router.replace(`/puntos-de-venta?${params.toString()}`, { scroll: false })
  }, [selectedId, searchParams, router])

  const handleSelectLocal = useCallback((id: number) => {
    setSelectedId((prev) => (prev === id ? null : id)) // toggle: segundo clic deselecciona
  }, [])

  const selectedLocal = locales.find((l) => l.id === selectedId)

  return (
    <main
      className="pt-16 md:pt-20 flex flex-col bg-background overflow-hidden"
      style={{ height: "100dvh" }}
    >

      {/* ── Barra superior: búsqueda + filtros ───────────────────── */}
      <div className="flex-shrink-0 bg-card border-b border-border px-4 py-3 flex items-center gap-3">

        {/* Buscador */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar agencia o barrio..."
            className="w-full pl-9 pr-8 py-2 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition"
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtros de estado */}
        <div className="hidden sm:flex items-center gap-1.5">
          {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === f
                  ? "bg-primary text-white"
                  : "bg-background border border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {f === "abierto" && "🟢 "}{f === "cerrado" && "🔴 "}{STATUS_LABELS[f]}
            </button>
          ))}
        </div>

        {/* Filtro móvil */}
        <button
          className="sm:hidden p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-label="Filtros"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Contador */}
        <span className="hidden lg:block text-xs text-muted-foreground flex-shrink-0">
          {locales.length} agencias
        </span>
      </div>

      {/* Filtros móvil expandibles */}
      {filtersOpen && (
        <div className="sm:hidden flex-shrink-0 px-4 py-2 bg-card border-b border-border flex gap-2">
          {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => { setStatusFilter(f); setFiltersOpen(false) }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === f
                  ? "bg-primary text-white"
                  : "bg-background border border-border text-muted-foreground"
              }`}
            >
              {STATUS_LABELS[f]}
            </button>
          ))}
        </div>
      )}

      {/* ── Layout principal: mapa + lista ───────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* MAP — toma todo el espacio libre en desktop, altura fija en móvil */}
        <div className="h-[42vh] md:h-auto md:flex-1 relative bg-[#0d1520]">
          <MapaInteractivo
            locales={locales}
            selectedId={selectedId}
            onSelectLocal={handleSelectLocal}
          />

          {/* Chip de local seleccionado — visible sobre el mapa en móvil */}
          {selectedLocal && (
            <div className="absolute bottom-4 left-4 right-4 md:hidden z-[1000]">
              <div className="bg-card/95 backdrop-blur-sm border border-primary/40 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm font-semibold text-foreground flex-1 truncate">
                  {selectedLocal.nombre}
                </p>
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LISTA — sidebar en desktop, panel inferior en móvil */}
        <div className="md:w-96 lg:w-[420px] flex flex-col overflow-hidden border-t md:border-t-0 md:border-l border-border bg-[#19283a]">

          {/* Header del sidebar */}
          <div className="flex-shrink-0 px-4 py-3 border-b border-border">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
              Puntos de Venta
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hacé clic en una agencia para verla en el mapa
            </p>
          </div>

          <ListaLocales
            locales={locales}
            selectedId={selectedId}
            onSelectLocal={handleSelectLocal}
            searchText={searchText}
            statusFilter={statusFilter}
          />
        </div>
      </div>
    </main>
  )
}
