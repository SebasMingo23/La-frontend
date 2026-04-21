"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, MapPin, User } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Ganador {
  id: number
  nombre: string
  foto_url: string
  premio: string
  ciudad: string
  fecha: string
  is_grand_prize: number
}

const WP_ROOT = (process.env.NEXT_PUBLIC_WP_URL ?? "").replace(/\/$/, "")

function resolvePhotoUrl(raw: string): string {
  if (!raw) return ""
  // Si llega absoluta, extraer solo el path desde /wp-content en adelante.
  // Elimina cualquier prefijo de dominio o segmento /wp-json/... que haya
  // podido colarse desde el backend.
  let path = raw
  try {
    const url = new URL(raw)
    path = url.pathname
  } catch {
    // raw ya es relativa — úsala tal cual
  }
  // Limpiar fragmentos residuales como /wp-json/la/v1
  path = path.replace(/\/wp-json\/[^/]+\/[^/]+/g, "")
  if (!path.startsWith("/")) path = "/" + path
  return WP_ROOT + path
}

function formatFecha(fechaStr: string): string {
  if (!fechaStr) return ""
  const [year, month, day] = fechaStr.split("-")
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
  return `${parseInt(day, 10)} ${meses[parseInt(month, 10) - 1]} ${year}`
}

export function WinnersSection() {
  const [ganadores, setGanadores] = useState<Ganador[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/ganadores?limit=3")
      .then((r) => r.json())
      .then((data: unknown) => setGanadores(Array.isArray(data) ? data : []))
      .catch(() => setGanadores([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section
      id="ganadores"
      className="relative py-20 md:py-32 overflow-hidden bg-white dark:bg-[#1E2B3E] transition-colors duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#009640] via-[#FFCC00] to-[#F58220]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#009640]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F58220]/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#009640]/10
                           text-[#009640] border border-[#009640]/30 text-sm font-semibold uppercase tracking-wide mb-6">
            <Trophy size={16} />
            Últimos Ganadores
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2B2B2B] dark:text-white uppercase
                         tracking-tighter mb-4 font-[var(--font-gunterz)]">
            Ellos Ya <span className="text-[#009640]">Ganaron</span>
          </h2>
          <p className="text-[#2B2B2B]/60 dark:text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
            Conocé a los afortunados ganadores de esta semana
          </p>
        </motion.div>

        {/* ── Estado de carga ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-[#2B2B2B]/5 dark:bg-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* ── Sin ganadores ── */}
        {!loading && ganadores.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-5 py-16 px-4 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#009640]/10 flex items-center justify-center">
              <Trophy className="w-9 h-9 text-[#009640]/60" />
            </div>
            <h3 className="text-2xl font-bold text-[#2B2B2B] dark:text-white uppercase font-[var(--font-gunterz)]">
              ¡El podio está esperando!
            </h3>
            <p className="text-[#2B2B2B]/60 text-lg max-w-md">
              Aún no hay ganadores registrados. Jugá hoy y sé el primero en aparecer aquí.
            </p>
          </motion.div>
        )}

        {/* ── Grilla de ganadores ── */}
        {!loading && ganadores.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ganadores.map((ganador, index) => (
              <motion.div
                key={ganador.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden rounded-2xl border border-[#009640]/20
                                 bg-white dark:bg-[#243347] shadow-md hover:shadow-lg
                                 transition-shadow duration-300 p-6 flex flex-col items-center text-center gap-4">

                  {ganador.is_grand_prize === 1 && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5
                                     rounded-full bg-[#FFCC00]/20 text-[#B8860B] dark:text-[#FFCC00]
                                     text-xs font-bold uppercase tracking-wide border border-[#FFCC00]/40">
                      Gran Premio
                    </span>
                  )}

                  {/* Foto o avatar */}
                  {ganador.foto_url ? (
                    <img
                      src={resolvePhotoUrl(ganador.foto_url)}
                      alt={ganador.nombre}
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#009640]/30 shadow"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#009640]/10 flex items-center justify-center border-4 border-[#009640]/20">
                      <User className="w-10 h-10 text-[#009640]/50" />
                    </div>
                  )}

                  {/* Nombre */}
                  <h3 className="text-lg font-bold text-[#2B2B2B] dark:text-white uppercase
                                 tracking-tight font-[var(--font-gunterz)] leading-tight">
                    {ganador.nombre}
                  </h3>

                  {/* Premio */}
                  <p className="text-2xl font-black text-[#009640]">
                    {ganador.premio}
                  </p>

                  {/* Ciudad y fecha */}
                  <div className="flex flex-col items-center gap-1 text-sm text-[#2B2B2B]/60 dark:text-white/50">
                    {ganador.ciudad && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} />
                        {ganador.ciudad}
                      </span>
                    )}
                    {ganador.fecha && (
                      <span>{formatFecha(ganador.fecha)}</span>
                    )}
                  </div>

                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-[#2B2B2B]/60 dark:text-white/60 text-lg mb-4">El próximo ganador podrías ser vos</p>
          <button
            onClick={() =>
              document
                .querySelector("#puntos-de-venta")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="group relative overflow-hidden inline-flex items-center gap-2 px-10 py-4 min-h-[56px]
                       bg-gradient-to-r from-[#F58220] via-[#FF9D00] to-[#F58220] bg-[length:200%_auto] bg-[position:left_center]
                       text-white font-black uppercase tracking-wide rounded-2xl
                       shadow-[0_8px_32px_rgba(245,130,32,0.55),0_2px_8px_rgba(245,130,32,0.3)]
                       hover:bg-[position:right_center] hover:shadow-[0_12px_48px_rgba(245,130,32,0.75),0_0_24px_rgba(255,157,0,0.4)] hover:scale-105
                       active:scale-[0.97] transition-all duration-300 cursor-pointer"
          >
            <Trophy size={20} className="transition-transform duration-500 group-hover:scale-125" />
            Jugar Ahora
          </button>
        </motion.div>

      </div>
    </section>
  )
}
