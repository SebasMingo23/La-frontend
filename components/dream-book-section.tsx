"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Sparkles, Moon } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

// Dream interpretations with animals
const dreams = [
  { dream: "Agua", animal: "Pez", number: "15", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cobra-iconos-animales-dorado-6QuyGSg8AXHAJ7jX2Ulh1BtAcydkwI.png" },
  { dream: "Amor", animal: "Mariposa", number: "04", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mariposa-iconos-animales-dorado-aAt84RVDDEkohHW0uhrBOmm5VqkLN3.png" },
  { dream: "Bebé", animal: "Mono", number: "17", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mono-iconos-animales-dorado-NJJLA21lDbq1x7V505EuyyTmkKPYpW.png" },
  { dream: "Caballo", animal: "Caballo", number: "11", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/caballo-iconos-animales-dorado-ho4lnH4LyGVAB1dCtP6knDV2RTbbqL.png" },
  { dream: "Casa", animal: "Perro", number: "05", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/perro-iconos-animales-dorado-VMfjsip9MmXlWNRCcS8AHy5RCjGVVV.png" },
  { dream: "Dinero", animal: "Chancho", number: "18", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chancho-iconos-animales-dorado-IsxHnBcizEr59b5DfxQqaTYGQhbtmw.png" },
  { dream: "Fuego", animal: "León", number: "16", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leon-iconos-animales-dorado-rtFAoATDdjADvxCDRWFjaaVDIZuo1B.png" },
  { dream: "Luna", animal: "Gato", number: "14", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gato-iconos-animales-dorado-lipBLTk7rZecVykrBDidOkGPP7Bfqe.png" },
  { dream: "Muerte", animal: "Cobra", number: "09", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cobra-iconos-animales-dorado-6QuyGSg8AXHAJ7jX2Ulh1BtAcydkwI.png" },
  { dream: "Mujer", animal: "Vaca", number: "25", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vaca-iconos-animales-dorado-zCIQFXqIRC0CjJOW81Azt1inleoiBg.png" },
  { dream: "Niño", animal: "Oveja", number: "07", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/oveja-iconos-animales-dorado-fudDVXABPIib8F7kRmiCyGTmQCcvlo.png" },
  { dream: "Oro", animal: "Águila", number: "02", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aguila-iconos-animales-dorado-mgEeRjVjqAfNssbgtMvXF62KblBja3.png" },
  { dream: "Padre", animal: "Toro", number: "21", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/toro-iconos-animales-dorado-F6AG6syUIVMYCzWrBTXegKTqiFJRBX.png" },
  { dream: "Peligro", animal: "Oso", number: "23", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/oso-iconos-animales-dorado-rhZ40oqleZj5Bail9NFuLclm12Fq12.png" },
  { dream: "Sol", animal: "Gallo", number: "13", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gallina-iconos-animales-dorado-eg79sk1Ou1GvuQYzRYy0A740wMsuEn.png" },
  { dream: "Viaje", animal: "Camello", number: "08", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/camello-iconos-animales-dorado-BWyPLIT0Vl24qCJxrxZVF9hykQF40G.png" },
]

export function DreamBookSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDream, setSelectedDream] = useState<typeof dreams[0] | null>(null)

  const filteredDreams = dreams.filter(d => 
    d.dream.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.animal.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section
      id="suenos"
      className="relative py-20 md:py-32 overflow-hidden bg-background"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold uppercase tracking-wide mb-6">
            <Moon size={16} />
            Interpretación
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground uppercase tracking-tighter mb-4 font-[var(--font-oswald)]">
            Libro de los <span className="text-primary">Sueños</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Descubre qué animal y número corresponden a tu sueño
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <input
              type="text"
              placeholder="Busca tu sueño... (ej: agua, amor, dinero)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-card border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-lg"
            />
            <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-pulse" />
          </div>
        </motion.div>

        {/* Selected Dream Card */}
        <AnimatePresence>
          {selectedDream && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md mx-auto mb-12"
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 rounded-[2rem] p-8 text-center">
                <button 
                  onClick={() => setSelectedDream(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  x
                </button>
                
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={selectedDream.image}
                    alt={selectedDream.animal}
                    fill
                    className="object-contain drop-shadow-[0_0_30px_rgba(245,181,0,0.5)]"
                  />
                </div>
                
                <p className="text-muted-foreground text-sm uppercase tracking-wide mb-2">
                  Soñar con {selectedDream.dream}
                </p>
                <h3 className="text-3xl font-bold text-foreground uppercase font-[var(--font-oswald)] mb-4">
                  {selectedDream.animal}
                </h3>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary text-primary-foreground font-bold text-4xl font-[var(--font-oswald)] shadow-[0_10px_40px_rgba(255,122,0,0.4)]">
                  {selectedDream.number}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dreams Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {filteredDreams.map((dream, index) => (
            <motion.div
              key={dream.dream}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setSelectedDream(dream)}
              className="cursor-pointer"
            >
              <Card className="bg-card border-border hover:border-primary/50 rounded-2xl p-4 text-center transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                <div className="relative w-12 h-12 mx-auto mb-2">
                  <Image
                    src={dream.image}
                    alt={dream.animal}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{dream.dream}</p>
                <p className="text-xs text-muted-foreground">{dream.animal}</p>
                <div className="mt-2 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-bold text-sm">
                  {dream.number}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No results */}
        {filteredDreams.length === 0 && searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              No se encontraron sueños para &quot;{searchQuery}&quot;
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
