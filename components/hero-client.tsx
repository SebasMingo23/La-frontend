"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Zap, Clock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRef } from "react"
import type { Resultado } from "@/lib/types"

function formatFechaHumana(fechaStr: string): string {
  if (!fechaStr) return ""
  const meses = [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre",
  ]
  const [year, month, day] = fechaStr.split("-")
  if (!year || !month || !day) return fechaStr
  return `${parseInt(day, 10)} de ${meses[parseInt(month, 10) - 1]} de ${year}`
}

interface HeroClientProps {
  resultado: Resultado
}

export function HeroClient({ resultado }: HeroClientProps) {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -150])

  return (
    <section
      ref={sectionRef}
      id="resultados"
      className="relative min-h-screen pt-20 overflow-hidden"
      style={{
        backgroundImage: "url('/images/pattern-dice-dark.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay — gradiente de profundidad */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(43,43,43,0.75) 0%, rgba(20,20,20,0.92) 60%, rgba(43,43,43,0.85) 100%)",
        }}
      />

      {/* Parallax Decorative Graphics */}
      <motion.div
        style={{ y: parallaxY1 }}
        className="absolute top-20 -right-20 w-80 h-80 opacity-10 pointer-events-none"
      >
        <Image
          src="/images/pattern-dice-orange-new.png"
          alt=""
          fill
          className="object-cover rounded-full blur-sm"
        />
      </motion.div>

      <motion.div
        style={{ y: parallaxY2 }}
        className="absolute bottom-40 -left-20 w-60 h-60 opacity-10 pointer-events-none"
      >
        <Image
          src="/images/pattern-money-yellow.png"
          alt=""
          fill
          className="object-cover rounded-full blur-sm"
        />
      </motion.div>

      {/* Kinetic Background Text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span className="text-[15vw] font-bold text-foreground/[0.03] uppercase tracking-tighter whitespace-nowrap select-none font-[var(--font-gunterz)]">
          ULTIMO GANADOR
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full
                             bg-[#F58220]/15 text-[#F58220] text-sm font-semibold uppercase mb-6
                             border border-[#F58220]/50 tracking-[0.12em]
                             shadow-[0_0_20px_rgba(245,130,32,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]">
              <Zap size={16} className="animate-pulse" />
              Resultado en Vivo
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-bold uppercase tracking-tighter mb-4 font-[var(--font-gunterz)]"
            style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 900 }}
          >
            <span className="text-foreground">Último </span>
            <span className="text-primary">Resultado</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
          >
            {resultado.fecha
              ? `Sorteo del ${formatFechaHumana(resultado.fecha)} · Asunción, Paraguay`
              : "Sorteo · Asunción, Paraguay"}
          </motion.p>
        </div>

        {/* Winning Animal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <div className="relative group">
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#009640] via-[#FFCC00] to-[#F58220] rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />

            {/* Card */}
            <div className="relative bg-card/95 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12
                            border border-[#FFCC00]/20
                            shadow-[0_0_0_1px_rgba(255,204,0,0.08),0_30px_100px_rgba(0,0,0,0.6),0_0_60px_rgba(245,130,32,0.08)]">
              <div className="text-center">
                {resultado.imagen_url && (
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-6"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resultado.imagen_url}
                      alt={resultado.animal}
                      className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(245,181,0,0.5)]"
                    />
                  </motion.div>
                )}

                <h2 className="text-4xl md:text-5xl font-bold text-accent uppercase tracking-tight font-[var(--font-gunterz)] mb-4">
                  {resultado.animal}
                </h2>

                <div className="inline-flex items-center px-8 py-4 rounded-[1.5rem] bg-[#009640] text-white font-bold text-4xl md:text-5xl font-[var(--font-gunterz)]"
                     style={{ boxShadow: "0 0 40px rgba(0,150,64,0.7), 0 0 80px rgba(0,150,64,0.4), 0 0 120px rgba(0,150,64,0.15), inset 0 2px 0 rgba(255,255,255,0.2)" }}>
                  {resultado.numero}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12"
        >
          <div className="flex items-center gap-2 text-muted-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <Clock size={20} className="text-primary" />
            <span>
              Fecha:{" "}
              <span className="text-foreground font-bold">{resultado.fecha}</span>
            </span>
          </div>
          {resultado.turno && (
            <div className="flex items-center gap-2 text-white/80 bg-[#F58220]/15 backdrop-blur-sm px-5 py-2.5 rounded-full border border-[#F58220]/40 shadow-[0_0_12px_rgba(245,130,32,0.15)]">
              <Zap size={16} className="text-[#F58220]" />
              <span className="text-[#F58220] font-bold text-base font-[var(--font-gunterz)] uppercase tracking-wide">
                {resultado.turno}
              </span>
            </div>
          )}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() =>
              document
                .querySelector("#puntos-de-venta")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="bg-[#F58220] hover:bg-[#E06B10] text-white font-bold uppercase tracking-wide text-lg px-8 min-h-[48px] w-full sm:w-auto rounded-[1.5rem] shadow-[0_10px_40px_rgba(245,130,32,0.4)] hover:shadow-[0_15px_50px_rgba(245,130,32,0.6)] transition-all cursor-pointer"
          >
            Jugar Ahora
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border border-[#009640]/50 text-[#009640] bg-[#009640]/[0.08] font-bold uppercase tracking-wide text-lg px-8 min-h-[48px] w-full sm:w-auto rounded-[1.5rem] backdrop-blur-sm transition-all duration-300 shadow-[0_0_15px_rgba(0,150,64,0.15)] hover:bg-[#009640] hover:text-white hover:border-[#009640] hover:shadow-[0_0_20px_rgba(0,150,64,0.5)]"
          >
            <Play size={20} className="mr-2" />
            Sorteo en Vivo
          </Button>
        </motion.div>
      </div>

      {/* Decorative Stripes — Paraguay Flag Colors */}
      <div className="absolute bottom-0 right-0 w-64 h-32 opacity-40">
        <div className="absolute bottom-20 right-0 w-80 h-5 bg-[#D52B1E] transform -skew-x-12" />
        <div className="absolute bottom-10 right-0 w-80 h-5 bg-[#FFFFFF] transform -skew-x-12" />
        <div className="absolute bottom-0 right-0 w-80 h-5 bg-[#0038A8] transform -skew-x-12" />
      </div>
    </section>
  )
}
