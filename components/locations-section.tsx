"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, Phone, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

const locations = [
  { 
    name: "Lotería Villa Morra", 
    address: "Av. Mariscal López 3245, Villa Morra",
    hours: "8:00 - 22:00",
    phone: "+595 21 612 345"
  },
  { 
    name: "Lotería Centro", 
    address: "Calle Palma 456, Centro Histórico",
    hours: "7:00 - 21:00",
    phone: "+595 21 445 678"
  },
  { 
    name: "Lotería Sajonia", 
    address: "Av. Artigas 1890, Sajonia",
    hours: "8:00 - 20:00",
    phone: "+595 21 298 765"
  },
  { 
    name: "Lotería San Lorenzo", 
    address: "Ruta 2 Km 12, San Lorenzo",
    hours: "7:30 - 21:30",
    phone: "+595 21 578 901"
  },
]

export function LocationsSection() {
  return (
    <section
      id="ubicaciones"
      className="relative py-20 md:py-32 overflow-hidden bg-background"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-card border border-border aspect-[4/3]">
              {/* Map Background */}
              <div className="absolute inset-0 bg-[#1a2332]">
                {/* Grid Pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,122,0,0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,122,0,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }}
                />
                
                {/* Map Markers */}
                {[
                  { top: "30%", left: "45%" },
                  { top: "50%", left: "25%" },
                  { top: "40%", left: "65%" },
                  { top: "60%", left: "55%" },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="absolute"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-30" />
                      <div className="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,122,0,0.5)]">
                        <MapPin className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Paraguay Shape Hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="text-5xl font-bold text-foreground/30 uppercase tracking-widest font-[var(--font-oswald)]">
                    ASUNCIÓN
                  </div>
                </div>
              </div>

              {/* Overlay Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
                <p className="text-foreground font-semibold">+50 Puntos de Venta en Paraguay</p>
                <p className="text-muted-foreground text-sm">Encuentra tu agencia más cercana en Asunción</p>
              </div>
            </div>
          </motion.div>

          {/* Locations List */}
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
              <h2 className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter mb-4 font-[var(--font-oswald)]">
                Encuentra tu <span className="text-primary">Agencia</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Más de 50 ubicaciones en Asunción y Gran Asunción, Paraguay
              </p>
            </motion.div>

            <div className="space-y-4">
              {locations.map((location, index) => (
                <motion.div
                  key={location.name}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="bg-card border-border hover:border-primary/50 transition-all p-4 rounded-2xl group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                          {location.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-2">{location.address}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-primary" />
                            {location.hours}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={12} className="text-primary" />
                            {location.phone}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-6 text-primary font-semibold text-sm uppercase tracking-wide hover:underline flex items-center gap-1"
            >
              Ver todas las ubicaciones
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
