"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Sparkles, Moon, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { getDreamsDictionary } from "@/lib/api"
import { animals as localAnimals } from "@/lib/animals"
import type { DreamEntry } from "@/lib/types"

/** Tarjeta expandida — una entrada por keyword */
interface DreamCard {
  keyword: string
  animal: string
  number: string   // "01"–"25"
  image_url: string
  entryId: number
}

/** Expande DreamEntry[] (1 por animal) a DreamCard[] (1 por keyword) */
function expandEntries(entries: DreamEntry[]): DreamCard[] {
  return entries.flatMap((entry) => {
    const imageUrl =
      entry.image_url ||
      localAnimals.find((a) => a.id === entry.id)?.image ||
      ""
    return entry.dreams
      .split(",")
      .map((kw) => kw.trim())
      .filter((kw) => kw.length > 0)
      .map((kw) => ({
        keyword: kw.charAt(0).toUpperCase() + kw.slice(1).toLowerCase(),
        animal: entry.name,
        number: String(entry.number).padStart(2, "0"),
        image_url: imageUrl,
        entryId: entry.id,
      }))
  })
}

function DreamBookSkeleton() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse flex flex-col items-center gap-10">
          <div className="h-8 w-40 bg-card rounded-full" />
          <div className="h-12 w-72 bg-card rounded-[1.5rem]" />
          <div className="h-14 w-full max-w-2xl bg-card rounded-2xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 w-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-32 bg-card rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function DreamBookSection() {
  const [entries, setEntries]         = useState<DreamEntry[]>([])
  const [loading, setLoading]         = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selected, setSelected]       = useState<DreamCard | null>(null)

  useEffect(() => {
    getDreamsDictionary()
      .then((data) => setEntries(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Expandir y ordenar alfabéticamente por keyword una sola vez
  const allCards = useMemo(() => {
    const cards = expandEntries(entries)
    return cards.sort((a, b) => a.keyword.localeCompare(b.keyword, "es"))
  }, [entries])

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return allCards
    return allCards.filter(
      (c) =>
        c.keyword.toLowerCase().includes(q) ||
        c.animal.toLowerCase().includes(q) ||
        c.number.includes(q)
    )
  }, [allCards, searchQuery])

  if (loading) return <DreamBookSkeleton />

  return (
    <section
      id="suenos"
      className="relative py-20 md:py-32 overflow-hidden bg-background"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20
                           text-primary text-sm font-semibold uppercase tracking-wide mb-6">
            <Moon size={16} />
            Interpretación
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground uppercase
                         tracking-tighter mb-4 font-[var(--font-gunterz)]">
            Libro de los <span className="text-primary">Sueños</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Descubrí qué animal y número corresponden a tu sueño
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscá tu sueño… (ej: agua, fuego, dinero, 21)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-12 py-5 bg-card border-2 border-border rounded-2xl
                         text-foreground placeholder:text-muted-foreground
                         focus:outline-none focus:border-primary transition-colors text-lg"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground
                           hover:text-foreground transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X size={18} />
              </button>
            ) : (
              <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-pulse" />
            )}
          </div>
          {allCards.length > 0 && (
            <p className="text-center text-xs text-muted-foreground/50 mt-3">
              {allCards.length} sueños en el diccionario
            </p>
          )}
        </motion.div>

        {/* Detail modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md mx-auto mb-12"
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20
                               border-2 border-primary/30 rounded-[2rem] p-8 text-center">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50
                             flex items-center justify-center text-muted-foreground
                             hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Cerrar"
                >
                  <X size={16} />
                </button>

                {selected.image_url && (
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={selected.image_url}
                      alt={selected.animal}
                      fill
                      className="object-contain drop-shadow-[0_0_30px_rgba(245,181,0,0.5)]"
                    />
                  </div>
                )}

                <p className="text-muted-foreground text-sm uppercase tracking-wide mb-2">
                  Soñar con {selected.keyword}
                </p>
                <h3 className="text-3xl font-bold text-foreground uppercase
                               font-[var(--font-gunterz)] mb-4">
                  {selected.animal}
                </h3>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl
                                bg-primary text-primary-foreground font-bold text-4xl
                                font-[var(--font-gunterz)]
                                shadow-[0_10px_40px_rgba(255,122,0,0.4)]">
                  {selected.number}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {filtered.map((card, i) => (
              <motion.div
                key={`${card.entryId}-${card.keyword}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.5) }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => setSelected(card)}
                className="cursor-pointer"
              >
                <Card className="bg-card border-border hover:border-primary/50 rounded-2xl p-4
                                 text-center transition-all duration-300
                                 hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                  {card.image_url && (
                    <div className="relative w-12 h-12 mx-auto mb-2">
                      <Image
                        src={card.image_url}
                        alt={card.animal}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <p className="text-sm font-medium text-foreground mb-1 leading-tight">
                    {card.keyword}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">{card.animal}</p>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                  bg-primary/20 text-primary font-bold text-sm
                                  font-[var(--font-gunterz)]">
                    {card.number}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 py-16 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center">
              <Moon className="w-8 h-8 text-muted-foreground/40" />
            </div>
            {searchQuery ? (
              <>
                <p className="text-foreground font-semibold text-lg font-[var(--font-gunterz)] uppercase">
                  No encontramos ese sueño
                </p>
                <p className="text-muted-foreground">
                  No hay resultados para &ldquo;{searchQuery}&rdquo;. ¡Probá con otra palabra!
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-primary text-sm underline underline-offset-4 cursor-pointer"
                >
                  Ver todos los sueños
                </button>
              </>
            ) : (
              <p className="text-muted-foreground text-lg">
                El Libro de los Sueños está vacío. Agregá interpretaciones desde el panel de administración.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
