"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Star, MapPin, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Ganador } from "@/lib/types"

function formatFecha(fechaStr: string): string {
  if (!fechaStr) return ""
  const [year, month, day] = fechaStr.split("-")
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
  return `${parseInt(day, 10)} ${meses[parseInt(month, 10) - 1]} ${year}`
}

function GanadorCard({ ganador, delay }: { ganador: Ganador; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group"
    >
      <Card className="bg-gradient-to-b from-[#2e2e2e] to-[#252525] border-none rounded-[2rem] p-6
                       shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition-all duration-300
                       hover:shadow-[0_35px_80px_rgba(0,0,0,0.65)]">

        <div className="flex flex-col items-center gap-4">

          {/* Foto con badge anclado a la parte inferior del círculo */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-primary/10
                            ring-4 ring-primary/30 ring-offset-2 ring-offset-[#2B2B2B]"
                 style={{ isolation: 'isolate' }}>
              {ganador.foto_url ? (
                <img
                  src={ganador.foto_url}
                  alt={ganador.nombre}
                  width={112}
                  height={112}
                  sizes="112px"
                  className="w-full h-full object-cover block"
                  style={{
                    imageRendering: '-webkit-optimize-contrast',
                    filter: 'blur(0px)',
                    willChange: 'transform',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                  } as React.CSSProperties}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-primary/40" />
                </div>
              )}
            </div>

            {/* Badge anclado al borde inferior de la foto — solo si gran premio */}
            {ganador.is_grand_prize === 1 && (
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2
                               inline-flex items-center gap-1 px-3 py-1
                               bg-accent text-accent-foreground text-[10px] font-bold
                               uppercase rounded-full whitespace-nowrap
                               shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                <Star size={10} fill="currentColor" />
                Gran Premio
              </span>
            )}
          </div>

          {/* Info centrada — margen extra si hay badge para no pisarlo */}
          <div className={`text-center w-full ${ganador.is_grand_prize === 1 ? 'mt-3' : 'mt-0'}`}>
            <h3 className="text-lg font-bold text-foreground font-[var(--font-gunterz)] uppercase
                           leading-tight mb-1">
              {ganador.nombre}
            </h3>
            <div className="text-2xl font-extrabold font-[var(--font-gunterz)] mb-2"
                 style={{ color: '#009640', textShadow: '0 0 20px rgba(0,150,64,0.4)' }}>
              {ganador.premio}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-primary/70 flex-shrink-0" />
                {ganador.ciudad}
              </span>
              <span className="text-muted-foreground/30">·</span>
              <span>{formatFecha(ganador.fecha)}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export function WinnersSection() {
  const [ganadores, setGanadores] = useState<Ganador[]>([])

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/ganadores?limit=6`
    fetch(url)
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length > 0) {
          setGanadores(data as Ganador[])
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section
      id="ganadores"
      className="relative py-20 md:py-32 overflow-hidden bg-[#1e1e1e]"
    >
      {/* Subtle top accent stripe */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#009640] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10
                           text-white border border-white/20 text-sm font-semibold uppercase tracking-wide mb-6">
            <Trophy size={16} />
            Últimos Ganadores
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase
                         tracking-tighter mb-4 font-[var(--font-gunterz)]">
            Ellos Ya <span className="text-[#009640]">Ganaron</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Conocé a los afortunados ganadores de esta semana
          </p>
        </motion.div>

        {/* Grid o Empty State */}
        {ganadores.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-5 py-16 px-4 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <Trophy className="w-9 h-9 text-white/40" />
            </div>
            <h3 className="text-2xl font-bold text-white uppercase font-[var(--font-gunterz)]">
              ¡El podio está esperando!
            </h3>
            <p className="text-white/60 text-lg max-w-md">
              Aún no hay ganadores registrados. Jugá hoy y sé el primero en aparecer aquí.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ganadores.map((ganador, index) => (
              <GanadorCard
                key={ganador.id}
                ganador={ganador}
                delay={index * 0.08}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 text-lg mb-4">El próximo ganador podrías ser vos</p>
          <button className="inline-flex items-center gap-2 px-8 py-4 min-h-[48px] bg-[#F58220] text-white
                             font-bold uppercase tracking-wide rounded-2xl
                             shadow-[0_10px_40px_rgba(245,130,32,0.35)] hover:shadow-[0_15px_50px_rgba(245,130,32,0.5)]
                             transition-all cursor-pointer">
            <Trophy size={20} />
            Jugar Ahora
          </button>
        </motion.div>

      </div>
    </section>
  )
}
