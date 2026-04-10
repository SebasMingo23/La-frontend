"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Zap, TrendingUp, Clock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRef } from "react"

// Featured winning animal with golden icon
const winningAnimal = {
  name: "OVEJA",
  number: "07",
  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/oveja-iconos-animales-dorado-fudDVXABPIib8F7kRmiCyGTmQCcvlo.png",
}

const winningNumbers = [
  { number: "07", animal: "Oveja", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/oveja-iconos-animales-dorado-fudDVXABPIib8F7kRmiCyGTmQCcvlo.png" },
  { number: "16", animal: "León", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leon-iconos-animales-dorado-rtFAoATDdjADvxCDRWFjaaVDIZuo1B.png" },
  { number: "02", animal: "Águila", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aguila-iconos-animales-dorado-mgEeRjVjqAfNssbgtMvXF62KblBja3.png" },
  { number: "11", animal: "Caballo", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/caballo-iconos-animales-dorado-ho4lnH4LyGVAB1dCtP6knDV2RTbbqL.png" },
]

export function HeroSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })
  
  // Parallax values for decorative elements
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
        <span className="text-[15vw] font-bold text-foreground/[0.03] uppercase tracking-tighter whitespace-nowrap select-none font-[var(--font-oswald)]">
          ULTIMO GANADOR
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
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
            className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter mb-4 font-[var(--font-oswald)]"
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
            Sorteo de las 19:00 - Asunción, Paraguay
          </motion.p>
        </div>

        {/* Winning Animal Card - Premium Golden Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-primary rounded-[3rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
            
            {/* Main Card */}
            <div className="relative bg-card/95 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border-2 border-primary/30 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
              <div className="text-center">
                {/* Golden Animal Icon */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-6"
                >
                  <Image
                    src={winningAnimal.image}
                    alt={winningAnimal.name}
                    fill
                    className="object-contain drop-shadow-[0_0_30px_rgba(245,181,0,0.5)]"
                    priority
                  />
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-accent uppercase tracking-tight font-[var(--font-oswald)] mb-4">
                  {winningAnimal.name}
                </h2>
                
                {/* Number with 3D effect */}
                <div className="inline-flex items-center gap-2 px-8 py-4 rounded-[1.5rem] bg-gradient-to-b from-primary to-[#CC6200] text-primary-foreground font-bold text-4xl md:text-5xl shadow-[0_10px_40px_rgba(255,122,0,0.6),inset_0_2px_0_rgba(255,255,255,0.2)] font-[var(--font-oswald)]">
                  {winningAnimal.number}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* All Winning Numbers - Smaller Cards with Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
        >
          {winningNumbers.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-card/80 backdrop-blur-sm rounded-[2rem] p-4 md:p-6 border-2 border-primary/30 hover:border-primary transition-all cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
            >
              <div className="text-center">
                <div className="relative w-12 h-12 md:w-16 md:h-16 mx-auto mb-2">
                  <Image
                    src={item.image}
                    alt={item.animal}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1 font-[var(--font-oswald)]">
                  {item.number}
                </div>
                <div className="text-xs md:text-sm text-foreground/80 uppercase tracking-wide">
                  {item.animal}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12"
        >
          <div className="flex items-center gap-2 text-muted-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <Clock size={20} className="text-primary" />
            <span>Próximo sorteo en: <span className="text-foreground font-bold">1h 23m</span></span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <TrendingUp size={20} className="text-secondary" />
            <span>Ganadores hoy: <span className="text-foreground font-bold">1,234</span></span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
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

      {/* Decorative Stripes - Paraguay Flag Colors */}
      <div className="absolute bottom-0 right-0 w-64 h-32 opacity-40">
        <div className="absolute bottom-20 right-0 w-80 h-5 bg-[#D52B1E] transform -skew-x-12" />
        <div className="absolute bottom-10 right-0 w-80 h-5 bg-[#FFFFFF] transform -skew-x-12" />
        <div className="absolute bottom-0 right-0 w-80 h-5 bg-[#0038A8] transform -skew-x-12" />
      </div>
    </section>
  )
}
