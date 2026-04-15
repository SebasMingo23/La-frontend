"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MapPin, Phone, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import type { Local } from "@/lib/types"

// Leaflet usa window — importar solo en el cliente con ssr: false
const MapaLocales = dynamic(
  () => import("@/components/mapa-locales").then((m) => m.MapaLocales),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#1a2332] rounded-3xl animate-pulse flex items-center justify-center">
        <MapPin className="w-8 h-8 text-primary/40 animate-bounce" />
      </div>
    ),
  }
)

export function LocationsSection() {
  const router = useRouter()
  const [locales, setLocales] = useState<Local[]>([])

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL
    if (!apiBase) return

    fetch(`${apiBase}/locales`)
      .then((r) => r.json())
      .then((data: Local[]) => {
        if (Array.isArray(data) && data.length > 0) setLocales(data)
      })
      .catch(() => {/* Sin API → lista vacía */})
  }, [])

  // Mostrar hasta 4 agencias en el panel lateral
  const preview = locales.slice(0, 4)

  return (
    <section
      id="locales"
      className="relative py-20 md:py-32 overflow-hidden bg-background"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Mapa con Leaflet */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-[2.5rem] overflow-hidden border border-border aspect-[4/3]">
              <MapaLocales
                locales={locales}
                onSelectLocal={(id) => router.push(`/puntos-de-venta?id=${id}`)}
              />

              {/* Overlay inferior */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0d1520]/90 to-transparent pointer-events-none z-[1000]">
                <p className="text-foreground font-semibold">
                  {locales.length > 0 ? `${locales.length} Puntos de Venta en Paraguay` : "Puntos de Venta en Paraguay"}
                </p>
                <p className="text-muted-foreground text-sm">Encuentra tu agencia más cercana en Asunción</p>
              </div>
            </div>
          </motion.div>

          {/* Lista de locales */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold uppercase tracking-wide mb-4">
                <MapPin size={16} />
                Puntos de Venta
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter mb-4 font-[var(--font-gunterz)]">
                Encuentra tu <span className="text-primary">Agencia</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Todas las ubicaciones en Asunción y Gran Asunción, Paraguay
              </p>
            </motion.div>

            <div className="space-y-4">
              {preview.map((local, index) => (
                <motion.div
                  key={local.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    className="bg-card border-border hover:border-primary/50 transition-all p-4 rounded-2xl group cursor-pointer"
                    onClick={() => router.push(`/puntos-de-venta?id=${local.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1 truncate">
                          {local.nombre}
                        </h3>
                        {local.direccion && (
                          <p className="text-muted-foreground text-sm mb-1 truncate">{local.direccion}</p>
                        )}
                        {local.telefono && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone size={12} className="text-primary flex-shrink-0" />
                            {local.telefono}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-3" />
                    </div>
                  </Card>
                </motion.div>
              ))}

              {locales.length === 0 && (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 rounded-2xl bg-card animate-pulse" />
                  ))}
                </div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-6"
            >
              <Link
                href="/puntos-de-venta"
                className="inline-flex items-center gap-1 text-primary font-semibold text-sm uppercase tracking-wide hover:underline"
              >
                Ver todas las ubicaciones
                <ChevronRight size={16} />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
