"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Brain, Sparkles, TrendingUp, Flame } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useRef } from "react"

// 5 daily predictions with golden animal icons (local assets)
const predictions = [
  {
    animal: "León",
    number: "16",
    milesima: "3716",
    cento: "716",
    docena: "16",
    confidence: 89,
    trend: "hot",
    image: "/images/animales/leon-iconos-animales-dorado.png",
  },
  {
    animal: "Cobra",
    number: "09",
    milesima: "1809",
    cento: "809",
    docena: "09",
    confidence: 76,
    trend: "rising",
    image: "/images/animales/cobra-iconos-animales-dorado.png",
  },
  {
    animal: "Águila",
    number: "02",
    milesima: "4502",
    cento: "502",
    docena: "02",
    confidence: 72,
    trend: "stable",
    image: "/images/animales/aguila-iconos-animales-dorado.png",
  },
  {
    animal: "Toro",
    number: "21",
    milesima: "2721",
    cento: "721",
    docena: "21",
    confidence: 68,
    trend: "rising",
    image: "/images/animales/toro-iconos-animales-dorado.png",
  },
  {
    animal: "Mariposa",
    number: "04",
    milesima: "9204",
    cento: "204",
    docena: "04",
    confidence: 65,
    trend: "hot",
    image: "/images/animales/mariposa-iconos-animales-dorado.png",
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
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [50, -50])
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section
      ref={sectionRef}
      id="predicciones"
      className="relative py-20 md:py-32 overflow-hidden bg-transparent"
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
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 text-sm font-semibold uppercase tracking-wide mb-6">
            <Brain size={16} />
            Inteligencia Artificial
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-md uppercase tracking-tighter mb-4 font-[var(--font-gunterz)]">
            Palpites del <span className="text-loteria-yellow">Día</span>
          </h2>
          <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto">
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
                relative overflow-hidden bg-loteria-dark-card/90 backdrop-blur-md
                border border-loteria-yellow/20 hover:border-loteria-yellow/50
                rounded-[2.5rem]
                ${index === 0 ? 'p-8 md:p-10' : 'p-6 md:p-8'}
                shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                transition-all duration-300
                hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)]
              `}>
                {/* Confidence Badge */}
                <Badge
                  className={`
                    absolute top-4 right-4 font-bold text-sm px-3 py-1 rounded-full
                    ${prediction.trend === 'hot' 
                      ? 'bg-primary text-primary-foreground' 
                      : prediction.trend === 'rising'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  {prediction.trend === 'hot' && <Flame size={12} className="mr-1" />}
                  {prediction.trend === 'rising' && <TrendingUp size={12} className="mr-1" />}
                  {prediction.confidence}%
                </Badge>

                <div className="text-center">
                  {/* Golden Animal Icon */}
                  <motion.div 
                    className={`relative mx-auto mb-4 ${index === 0 ? 'w-32 h-32 md:w-40 md:h-40' : 'w-20 h-20 md:w-24 md:h-24'}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src={prediction.image}
                      alt={prediction.animal}
                      fill
                      className="object-contain drop-shadow-[0_0_20px_rgba(245,181,0,0.4)]"
                    />
                  </motion.div>

                  <h3 className={`font-bold text-foreground uppercase tracking-tight mb-3 font-[var(--font-gunterz)] ${index === 0 ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                    {prediction.animal}
                  </h3>

                  {/* Number Display */}
                  <div className={`inline-flex items-center justify-center rounded-xl bg-primary/20 text-primary font-bold font-[var(--font-oswald)] mb-4 ${index === 0 ? 'w-20 h-20 text-3xl' : 'w-14 h-14 text-2xl'}`}>
                    {prediction.number}
                  </div>

                  {/* Additional Numbers (Milesima, Cento, Docena) */}
                  <div className={`grid grid-cols-3 gap-2 ${index === 0 ? 'mt-6' : 'mt-4'}`}>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase mb-1">Milésima</div>
                      <div className="text-sm md:text-base font-bold text-accent">{prediction.milesima}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase mb-1">Cento</div>
                      <div className="text-sm md:text-base font-bold text-accent">{prediction.cento}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase mb-1">Docena</div>
                      <div className="text-sm md:text-base font-bold text-accent">{prediction.docena}</div>
                    </div>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className={`${index === 0 ? 'mt-8' : 'mt-6'}`}>
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Confianza IA</span>
                    <span>{prediction.confidence}%</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${prediction.confidence}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      className={`h-full rounded-full ${
                        prediction.confidence > 75
                          ? 'bg-gradient-to-r from-[#009640] to-[#00C050]'
                          : prediction.confidence > 55
                            ? 'bg-gradient-to-r from-accent to-[#D4A500]'
                            : 'bg-secondary'
                      }`}
                    />
                  </div>
                </div>

                {/* Sparkle decoration */}
                <Sparkles className="absolute bottom-4 left-4 w-5 h-5 text-primary/20" />
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
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Sparkles className="w-4 h-4 text-white/70" />
            <p className="text-white/70 text-sm">
              Predicciones generadas automáticamente y aprobadas por el administrador
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
