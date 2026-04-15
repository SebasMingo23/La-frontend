"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Zap, Clock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRef } from "react"
import type { Resultado } from "@/lib/types"

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
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/90" />

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
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold uppercase tracking-wide mb-6">
              <Zap size={16} className="animate-pulse" />
              Resultado en Vivo
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter mb-4 font-[var(--font-gunterz)]"
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
              ? `Sorteo del ${resultado.fecha} · Asunción, Paraguay`
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
            <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-primary rounded-[3rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />

            {/* Card */}
            <div className="relative bg-card/95 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border-2 border-primary/30 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
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

                <div className="inline-flex items-center px-8 py-4 rounded-[1.5rem] bg-gradient-to-b from-primary to-[#CC6200] text-primary-foreground font-bold text-4xl md:text-5xl shadow-[0_10px_40px_rgba(255,122,0,0.6),inset_0_2px_0_rgba(255,255,255,0.2)] font-[var(--font-gunterz)]">
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
            <div className="flex items-center gap-2 text-muted-foreground bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20">
              <Zap size={16} className="text-primary" />
              <span>
                Turno:{" "}
                <span className="text-primary font-bold font-[var(--font-gunterz)]">{resultado.turno}</span>
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
            className="bg-gradient-to-b from-primary to-[#CC6200] hover:from-primary/90 hover:to-[#CC6200]/90 text-primary-foreground font-bold uppercase tracking-wide text-lg px-8 py-6 rounded-[1.5rem] shadow-[0_10px_40px_rgba(255,122,0,0.4)] hover:shadow-[0_15px_50px_rgba(255,122,0,0.6)] transition-all"
          >
            Jugar Ahora
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-foreground/20 hover:border-primary text-foreground hover:text-primary font-bold uppercase tracking-wide text-lg px-8 py-6 rounded-[1.5rem] transition-all backdrop-blur-sm"
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
