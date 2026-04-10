"use client"

import { motion } from "framer-motion"
import { Trophy, Star, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

// Recent winners from Paraguay
const winners = [
  {
    id: 1,
    name: "María González",
    city: "Asunción",
    prize: "Gs. 15.000.000",
    date: "10 Abr 2026",
    animal: "León",
    animalImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leon-iconos-animales-dorado-rtFAoATDdjADvxCDRWFjaaVDIZuo1B.png",
  },
  {
    id: 2,
    name: "Carlos Benítez",
    city: "San Lorenzo",
    prize: "Gs. 8.500.000",
    date: "9 Abr 2026",
    animal: "Águila",
    animalImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aguila-iconos-animales-dorado-mgEeRjVjqAfNssbgtMvXF62KblBja3.png",
  },
  {
    id: 3,
    name: "Ana Martínez",
    city: "Luque",
    prize: "Gs. 12.000.000",
    date: "9 Abr 2026",
    animal: "Toro",
    animalImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/toro-iconos-animales-dorado-F6AG6syUIVMYCzWrBTXegKTqiFJRBX.png",
  },
  {
    id: 4,
    name: "Roberto Pérez",
    city: "Fernando de la Mora",
    prize: "Gs. 5.000.000",
    date: "8 Abr 2026",
    animal: "Oveja",
    animalImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/oveja-iconos-animales-dorado-fudDVXABPIib8F7kRmiCyGTmQCcvlo.png",
  },
  {
    id: 5,
    name: "Laura Giménez",
    city: "Lambaré",
    prize: "Gs. 20.000.000",
    date: "8 Abr 2026",
    animal: "Perro",
    animalImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/perro-iconos-animales-dorado-VMfjsip9MmXlWNRCcS8AHy5RCjGVVV.png",
  },
  {
    id: 6,
    name: "Jorge Villalba",
    city: "Asunción",
    prize: "Gs. 7.500.000",
    date: "7 Abr 2026",
    animal: "Caballo",
    animalImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/caballo-iconos-animales-dorado-ho4lnH4LyGVAB1dCtP6knDV2RTbbqL.png",
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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
}

export function WinnersSection() {
  return (
    <section
      id="ganadores"
      className="relative py-20 md:py-32 overflow-hidden"
      style={{
        backgroundImage: "url('/images/pattern-dice-orange.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#FF7A00]/95" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E2B3E]/20 text-[#1E2B3E] text-sm font-semibold uppercase tracking-wide mb-6">
            <Trophy size={16} />
            Últimos Ganadores
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E2B3E] uppercase tracking-tighter mb-4 font-[var(--font-oswald)]">
            Ellos Ya <span className="text-white">Ganaron</span>
          </h2>
          <p className="text-[#1E2B3E]/80 text-lg md:text-xl max-w-2xl mx-auto">
            Conoce a los afortunados ganadores de esta semana
          </p>
        </motion.div>

        {/* Winners Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {winners.map((winner, index) => (
            <motion.div
              key={winner.id}
              variants={item}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Card className="relative overflow-hidden bg-[#1E2B3E] border-none rounded-[2rem] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                {/* Featured Badge for first winner */}
                {index === 0 && (
                  <div className="absolute top-0 right-0 px-4 py-2 bg-accent text-accent-foreground text-xs font-bold uppercase rounded-bl-2xl flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    Gran Premio
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {/* Animal Icon */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl" />
                    <Image
                      src={winner.animalImage}
                      alt={winner.animal}
                      fill
                      className="object-contain p-2 drop-shadow-[0_0_10px_rgba(245,181,0,0.3)]"
                    />
                  </div>

                  {/* Winner Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground truncate font-[var(--font-oswald)] uppercase">
                      {winner.name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                      <MapPin size={12} className="text-primary" />
                      {winner.city}
                    </div>
                    <div className="text-2xl font-bold text-primary font-[var(--font-oswald)]">
                      {winner.prize}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {winner.animal}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {winner.date}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-[#1E2B3E]/70 text-lg mb-4">
            El próximo ganador podrías ser tú
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#1E2B3E] text-foreground font-bold uppercase tracking-wide rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.4)] transition-all">
            <Trophy size={20} />
            Jugar Ahora
          </button>
        </motion.div>
      </div>
    </section>
  )
}
