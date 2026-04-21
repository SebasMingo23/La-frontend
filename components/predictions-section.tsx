"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Brain, Sparkles, TrendingUp, Flame } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useRef } from "react"

// 5 daily predictions — white animal icons on green cards (blancos/ for max contrast)
const predictions = [
  {
    animal: "León",
    number: "16",
    milesima: "3716",
    cento: "716",
    docena: "16",
    confidence: 89,
    trend: "hot",
    image: "/images/animales/blancos/leon-iconos-animales-blanco.png",
  },
  {
    animal: "Cobra",
    number: "09",
    milesima: "1809",
    cento: "809",
    docena: "09",
    confidence: 76,
    trend: "rising",
    image: "/images/animales/blancos/cobra-iconos-animales-blanco.png",
  },
  {
    animal: "Águila",
    number: "02",
    milesima: "4502",
    cento: "502",
    docena: "02",
    confidence: 72,
    trend: "stable",
    image: "/images/animales/blancos/aguila-iconos-animales-blanco.png",
  },
  {
    animal: "Toro",
    number: "21",
    milesima: "2721",
    cento: "721",
    docena: "21",
    confidence: 68,
    trend: "rising",
    image: "/images/animales/blancos/toro-iconos-animales-blanco.png",
  },
  {
    animal: "Mariposa",
    number: "04",
    milesima: "9204",
    cento: "204",
    docena: "04",
    confidence: 65,
    trend: "hot",
    image: "/images/animales/blancos/mariposa-iconos-animales-blanco.png",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function PredictionsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    layoutEffect: false,
  })
  
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [50, -50])
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section
      ref={sectionRef}
      id="predicciones"
      className="relative py-20 md:py-32 overflow-hidden bg-[#009640] dark:bg-[#009640] transition-colors duration-300"
      style={{ position: 'relative' }}
    >
      {/* Decorative Top Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />

      {/* Parallax Background Graphics */}
      <motion.div 
        style={{ y: parallaxY1 }}
        className="absolute -top-10 -right-20 w-80 h-80 opacity-15 pointer-events-none"
      >
        <Image
          src="/images/pattern-dice-orange-new.png"
          alt=""
          fill
          className="object-cover rounded-full"
        />
      </motion.div>
      
      <motion.div 
        style={{ y: parallaxY2 }}
        className="absolute bottom-20 -left-32 w-64 h-64 opacity-10 pointer-events-none"
      >
        <Image
          src="/images/pattern-money-yellow.png"
          alt=""
          fill
          className="object-cover rounded-full"
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white border border-white/25 text-sm font-semibold uppercase tracking-wide mb-6">
            <Brain size={16} />
            Inteligencia Artificial
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-sm uppercase tracking-tighter mb-4 font-[var(--font-gunterz)]">
            Palpites del <span className="text-[#FFCC00]">Día</span>
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            5 predicciones diarias generadas por IA basadas en análisis de patrones históricos
          </p>
        </motion.div>

        {/* Bento Grid - 5 predictions */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {predictions.map((prediction, index) => (
            <motion.div
              key={prediction.number}
              variants={item}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group ${index === 0 ? 'lg:col-span-1 lg:row-span-2' : ''}`}
            >
              <Card className={`
                relative overflow-hidden
                bg-[#271A14]
                border border-white/10
                rounded-[2.5rem]
                ${index === 0 ? 'p-8 md:p-10' : 'p-6 md:p-8'}
                shadow-[0_12px_40px_rgba(0,0,0,0.4)]
                transition-all duration-300
                hover:shadow-[0_20px_60px_rgba(0,0,0,0.55)] hover:-translate-y-2 hover:scale-[1.02]
              `}>
                {/* Confidence Badge */}
                <Badge
                  className={`
                    absolute top-4 right-4 font-bold text-sm px-3 py-1 rounded-full border-0
                    ${prediction.trend === 'hot'
                      ? 'bg-[#FF4D00] text-white shadow-[0_2px_12px_rgba(255,77,0,0.5)]'
                      : prediction.trend === 'rising'
                        ? 'bg-[#FFCC00] text-[#1a1a1a] shadow-[0_2px_12px_rgba(255,204,0,0.5)]'
                        : 'bg-white/25 text-white border border-white/30'
                    }
                  `}
                >
                  {prediction.trend === 'hot' && <Flame size={12} className="mr-1" />}
                  {prediction.trend === 'rising' && <TrendingUp size={12} className="mr-1" />}
                  {prediction.confidence}%
                </Badge>

                <div className="text-center">
                  {/* Animal Icon */}
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        '/images/animales/blancos/' +
                        prediction.animal
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/ /g, '-') +
                        '-iconos-animales-blanco.png'
                      }
                      alt={prediction.animal}
                      className={`object-contain drop-shadow-[0_4px_20px_rgba(255,255,255,0.15)] ${index === 0 ? 'w-32 h-32 md:w-40 md:h-40' : 'w-20 h-20 md:w-24 md:h-24'}`}
                    />
                  </motion.div>

                  <h3 className={`font-bold text-white uppercase tracking-tight mb-3 font-[var(--font-gunterz)] ${index === 0 ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                    {prediction.animal}
                  </h3>

                  {/* Number Display */}
                  <div className={`inline-flex items-center justify-center rounded-xl bg-white/8 text-[#FFCC00] font-black font-[var(--font-gunterz)] mb-4 border border-[#FFCC00]/30 backdrop-blur-sm ${index === 0 ? 'w-20 h-20 text-3xl' : 'w-14 h-14 text-2xl'}`}
                       style={{ boxShadow: "inset 0 2px 0 rgba(255,204,0,0.15), 0 4px 16px rgba(0,0,0,0.3)" }}>
                    {prediction.number}
                  </div>

                  {/* Additional Numbers (Milesima, Cento, Docena) */}
                  <div className={`grid grid-cols-3 gap-2 ${index === 0 ? 'mt-6' : 'mt-4'}`}>
                    <div className="text-center">
                      <div className="text-xs text-white/70 uppercase mb-1">Milésima</div>
                      <div className="text-sm md:text-base font-bold text-white">{prediction.milesima}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-white/70 uppercase mb-1">Cento</div>
                      <div className="text-sm md:text-base font-bold text-white">{prediction.cento}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-white/70 uppercase mb-1">Docena</div>
                      <div className="text-sm md:text-base font-bold text-white">{prediction.docena}</div>
                    </div>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className={`${index === 0 ? 'mt-8' : 'mt-6'}`}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/70">Confianza IA</span>
                    <span className="text-[#F58220] font-bold">{prediction.confidence}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${prediction.confidence}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      className="h-full rounded-full bg-[#FFCC00]"
                    />
                  </div>
                </div>

                {/* Sparkle decoration */}
                <Sparkles className="absolute bottom-4 left-4 w-5 h-5 text-[#FFCC00]/20" />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20">
            <Sparkles className="w-4 h-4 text-[#FFCC00]/80" />
            <p className="text-white/80 text-sm">
              Predicciones generadas automáticamente y aprobadas por el administrador
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
