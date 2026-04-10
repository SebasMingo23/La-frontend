"use client"

import { motion } from "framer-motion"
import { Ticket, Dices, Trophy, PartyPopper } from "lucide-react"

const steps = [
  {
    icon: Ticket,
    step: "01",
    title: "Elige tu Animal",
    description: "Selecciona entre 25 animales oficiales. Cada uno tiene su número único de la suerte."
  },
  {
    icon: Dices,
    step: "02",
    title: "Compra tu Boleto",
    description: "Visita cualquiera de nuestros puntos de venta en Asunción. Apuestas desde Gs. 5.000."
  },
  {
    icon: Trophy,
    step: "03",
    title: "Espera el Sorteo",
    description: "Los sorteos se realizan varias veces al día. Consulta resultados en tiempo real."
  },
  {
    icon: PartyPopper,
    step: "04",
    title: "Cobra tu Premio",
    description: "¡Ganaste! Reclama tu premio en cualquier punto de venta autorizado."
  },
]

export function HowToPlaySection() {
  return (
    <section
      id="como-jugar"
      className="relative py-20 md:py-32 overflow-hidden"
      style={{
        backgroundImage: "url('/images/pattern-money.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#F5B500]/95" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E2B3E]/10 text-[#1E2B3E] text-sm font-semibold uppercase tracking-wide mb-6">
            <Dices size={16} />
            Fácil y Rápido
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E2B3E] uppercase tracking-tighter mb-4 font-[var(--font-oswald)]">
            ¿Cómo <span className="text-primary">Jugar</span>?
          </h2>
          <p className="text-[#1E2B3E]/70 text-lg md:text-xl max-w-2xl mx-auto">
            En solo 4 simples pasos puedes convertirte en el próximo ganador
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-[#1E2B3E] rounded-3xl p-8 h-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300">
                {/* Step Number */}
                <div className="text-6xl font-bold text-primary/20 mb-4 font-[var(--font-oswald)]">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <step.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground uppercase tracking-tight mb-3 font-[var(--font-oswald)]">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connecting Line (Desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-[#1E2B3E]/20 -z-10" />
      </div>
    </section>
  )
}
