"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Zap, Clock, Play, X, Radio, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect, useCallback } from "react"
import type { Resultado } from "@/lib/types"
import { useTheme } from "next-themes"

// ─── Modal Sorteo en Vivo ─────────────────────────────────────────────────────

function LiveModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <motion.div
      key="live-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -inset-3 rounded-[2rem] bg-[#009640]/20 blur-2xl pointer-events-none" />
        <div className="relative aspect-video rounded-[1.75rem] overflow-hidden
                        border border-[#FFCC00]/30
                        shadow-[0_0_0_1px_rgba(0,150,64,0.2),0_40px_100px_rgba(0,0,0,0.7),0_0_60px_rgba(0,150,64,0.15)]
                        bg-[#1a1a1a]">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center
                       bg-black/60 border border-white/15 text-white/70 hover:text-white hover:bg-black/80
                       transition-all duration-200 cursor-pointer"
          >
            <X size={16} />
          </button>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-[#009640]/20 blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-[#009640]/15 border border-[#009640]/40
                              flex items-center justify-center">
                <Radio className="w-9 h-9 text-[#009640]" />
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-white/50 text-xs uppercase tracking-[0.2em] font-semibold">Próxima transmisión</p>
              <h3 className="text-white font-[var(--font-gunterz)] font-bold text-3xl md:text-4xl uppercase tracking-tight">
                Sorteo en Vivo
              </h3>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                              bg-[#009640]/15 border border-[#009640]/40
                              text-[#009640] font-bold text-xl md:text-2xl font-[var(--font-gunterz)]"
                   style={{ boxShadow: "0 0 20px rgba(0,150,64,0.2)" }}>
                <span className="animate-pulse">●</span>18:00 hs
              </div>
              <p className="text-white/40 text-sm">Asunción, Paraguay · Lunes a Sábados</p>
            </div>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#FFCC00]/40 to-transparent" />
            <p className="text-white/30 text-xs max-w-xs">
              La transmisión comenzará automáticamente en este espacio a las 18:00 hs.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Animated Number (Odometer rAF) ──────────────────────────────────────────

function AnimatedNumber({ target, onComplete }: { target: number; onComplete?: () => void }) {
  const [display, setDisplay] = useState(0)
  const startRef  = useRef<number | null>(null)
  const rafRef    = useRef<number | null>(null)
  const calledRef = useRef(false)
  const duration  = 800

  useEffect(() => {
    calledRef.current = false
    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const elapsed  = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      setDisplay(Math.round(progress * progress * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setDisplay(target)
        if (!calledRef.current) { calledRef.current = true; onComplete?.() }
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) }
  }, [target, onComplete])

  return <>{String(display).padStart(2, "0")}</>
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// API name → local filename slug when they differ
const ANIMAL_SLUG_OVERRIDE: Record<string, string> = {
  venado: "ciervo",
}

function getAnimalImageSrc(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ /g, "-")
  return "/images/animales/blancos/" + (ANIMAL_SLUG_OVERRIDE[slug] ?? slug) + "-iconos-animales-blanco.png"
}

function formatFechaHumana(fechaStr: string): string {
  if (!fechaStr) return ""
  const meses = ["enero","febrero","marzo","abril","mayo","junio",
                 "julio","agosto","septiembre","octubre","noviembre","diciembre"]
  const [year, month, day] = fechaStr.split("-")
  if (!year || !month || !day) return fechaStr
  return `${parseInt(day, 10)} de ${meses[parseInt(month, 10) - 1]} de ${year}`
}

// ─── HeroClient ───────────────────────────────────────────────────────────────

interface HeroClientProps { resultado: Resultado }

export function HeroClient({ resultado }: HeroClientProps) {
  const [numberDone, setNumberDone]  = useState(false)
  const handleNumberComplete         = useCallback(() => setNumberDone(true), [])
  const [isLiveModalOpen, setIsLive] = useState(false)
  const closeLiveModal               = useCallback(() => setIsLive(false), [])
  const { resolvedTheme }            = useTheme()
  const [mounted, setMounted]        = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = !mounted || resolvedTheme === "dark"

  const sectionRef = useRef(null)

  return (
    <section
      ref={sectionRef}
      id="resultados"
      className="relative min-h-screen pt-20 overflow-hidden flex flex-col"
      style={{ backgroundImage: "none" }}
    >
      {/* ══════════════════════════════════════════════════════════════════════
          FONDO GLOBAL — Video siempre activo, overlay adaptativo por tema
      ══════════════════════════════════════════════════════════════════════ */}

      {/* Video en bucle — fondo universal para ambos modos */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/video-hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay light — velo blanco suave, deja respirar el video */}
      {!isDark && (
        <>
          <div className="absolute inset-0 bg-white/20" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 75% 85% at 50% 52%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.10) 55%, transparent 80%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
        </>
      )}

      {/* Overlay dark — velo negro profundo, el cristal oscuro filtra el video */}
      {isDark && (
        <div className="absolute inset-0 bg-black/60" />
      )}

      {/* Kinetic Background Text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span className={`text-[18vw] font-bold uppercase tracking-tighter whitespace-nowrap select-none font-[var(--font-gunterz)] ${
          isDark ? "text-white/[0.03]" : "text-[#009640]/[0.04]"
        }`}>
          ÚLTIMO RESULTADO
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CONTENIDO PRINCIPAL
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center
                      w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {isDark ? (
          /* ────────────────────────────────────────────────────────────────
             DARK MODE — Wide Canvas de cristal oscuro, mismo grid 2-col
          ──────────────────────────────────────────────────────────────── */
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-[#1A1A1A]/85 backdrop-blur-2xl rounded-[40px] w-full max-w-6xl mx-auto
                       px-8 py-12 md:px-16 md:py-20 lg:px-24 lg:py-24
                       border border-white/10
                       shadow-[0_0_40px_rgba(0,0,0,0.5),0_8px_32px_-8px_rgba(0,0,0,0.4)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">

              {/* ── Columna izquierda: headline + fecha + botones */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

                {/* Badge */}
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6
                                 bg-[#009640]/20 text-[#00EB64] border border-[#009640]/40
                                 text-xs font-black uppercase tracking-widest">
                  <Radio size={12} />
                  Resultado en Vivo
                </span>

                {/* Título */}
                <h1 className="font-black uppercase font-[var(--font-gunterz)] text-white mb-4"
                    style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                  Último<br />
                  <span className="text-[#00EB64]">Resultado</span>
                </h1>

                {/* Fecha + lugar */}
                <div className="flex flex-col gap-2 mb-10">
                  <span className="inline-flex items-center gap-2 text-base md:text-lg text-[#D9CDBF]">
                    <Calendar size={16} className="text-[#009640] shrink-0" />
                    Sorteo del{" "}
                    <strong className="font-black text-white">
                      {resultado.fecha ? formatFechaHumana(resultado.fecha) : "—"}
                    </strong>
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm md:text-base text-[#D9CDBF]">
                    <Clock size={15} className="text-[#009640] shrink-0" />
                    <strong className="font-black text-white">Asunción</strong>, Paraguay
                  </span>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button
                    size="lg"
                    onClick={() => document.querySelector("#puntos-de-venta")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="group relative overflow-hidden
                               bg-gradient-to-r from-[#F58220] via-[#FFCC00] to-[#F58220]
                               bg-[length:200%_auto] bg-[position:left_center]
                               text-[#1a1a1a] font-black uppercase tracking-wide text-xl
                               px-10 py-6 min-h-[64px] rounded-[1.5rem]
                               shadow-[0_8px_32px_rgba(245,130,32,0.50),0_0_24px_rgba(245,130,32,0.35)]
                               hover:bg-[position:right_center]
                               hover:shadow-[0_14px_44px_rgba(245,130,32,0.70),0_0_32px_rgba(255,204,0,0.40)]
                               hover:scale-[1.03] active:scale-[0.97]
                               transition-all duration-300 cursor-pointer border-0"
                  >
                    <motion.span
                      aria-hidden
                      className="absolute top-0 left-[-60%] h-full w-[38%] skew-x-[-18deg] pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }}
                      animate={{ left: ["-60%", "165%"] }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.85, ease: "easeInOut" }}
                    />
                    Jugar Ahora
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsLive(true)}
                    className="border-2 border-[#009640] text-white bg-[#009640]/20 backdrop-blur-sm
                               font-black uppercase tracking-wide text-xl
                               px-10 py-6 min-h-[64px] rounded-[1.5rem]
                               shadow-[0_0_15px_rgba(0,150,64,0.2)]
                               hover:bg-[#009640] hover:text-white
                               hover:shadow-[0_10px_36px_rgba(0,150,64,0.42)]
                               transition-all duration-300 cursor-pointer"
                  >
                    <Play size={22} className="mr-2" />
                    Sorteo en Vivo
                  </Button>
                </div>
              </div>

              {/* ── Columna derecha: animal card flotante */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex justify-center lg:justify-end"
              >
                <div className="relative">
                  <div className="absolute -inset-8 rounded-full pointer-events-none"
                       style={{
                         background: "radial-gradient(ellipse, rgba(0,150,64,0.28) 0%, rgba(255,204,0,0.16) 50%, transparent 72%)",
                         filter: "blur(20px)",
                       }} />
                  <div className="relative rounded-[28px] p-8 md:p-10
                                  bg-black/40
                                  border border-white/10
                                  shadow-[0_8px_40px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col items-center gap-5">
                      <div className="relative">
                        <motion.div
                          className="absolute rounded-full pointer-events-none"
                          style={{
                            inset: '-40%', width: '180%', height: '180%',
                            background: "radial-gradient(circle, rgba(245,181,0,0.22) 0%, rgba(0,150,64,0.12) 45%, transparent 70%)",
                          }}
                          animate={{ scale: [1, 1.22, 1], opacity: [0.45, 1, 0.45] }}
                          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                        />
                        {resultado.animal && (
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 w-48 h-48 md:w-64 md:h-64"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getAnimalImageSrc(resultado.animal)}
                              alt={resultado.animal}
                              className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,235,100,0.45)]"
                            />
                          </motion.div>
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-[var(--font-gunterz)] text-white">
                        {resultado.animal}
                      </h2>
                      <div
                        className={`inline-flex items-center px-10 py-5 rounded-[1.25rem] bg-[#009640] text-white
                                    font-black text-5xl md:text-6xl font-[var(--font-gunterz)]
                                    animate-[number-reveal_0.45s_ease-out]${numberDone ? " winner-badge-pulse" : ""}`}
                        style={{ boxShadow: "0 10px 40px rgba(0,150,64,0.42), 0 2px 10px rgba(0,150,64,0.22), inset 0 2px 0 rgba(255,255,255,0.25)" }}
                      >
                        <AnimatedNumber target={parseInt(resultado.numero, 10) || 0} onComplete={handleNumberComplete} />
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/50">
                          <Clock size={13} className="text-[#009640]" />{resultado.fecha}
                        </span>
                        {resultado.turno && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                           text-xs font-bold uppercase tracking-wide
                                           bg-[#F58220]/15 border border-[#F58220]/40 text-[#F58220]">
                            <Zap size={10} />{resultado.turno}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        ) : (
          /* LIGHT MODE — White Canvas ancho completo, estética Wise
             Grid 2 col en desktop: headline+CTAs izquierda | animal+número derecha */
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white rounded-[40px] w-full max-w-6xl mx-auto
                       px-8 py-12 md:px-16 md:py-20 lg:px-24 lg:py-24
                       shadow-[0_24px_80px_-16px_rgba(0,0,0,0.18),0_8px_32px_-8px_rgba(0,0,0,0.09)]"
          >
            {/* Grid 2 col en desktop — mobile: columna única centrada */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">

              {/* ── Columna izquierda: headline + fecha + botones */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

                {/* Badge */}
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6
                                 bg-[#009640]/10 text-[#009640] border border-[#009640]/30
                                 text-xs font-black uppercase tracking-widest">
                  <Radio size={12} />
                  Resultado en Vivo
                </span>

                {/* Título — masivo, tracking apretado */}
                <h1 className="font-black uppercase font-[var(--font-gunterz)] text-[#2B2B2B] mb-4"
                    style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                  Último<br />
                  <span className="text-[#009640]">Resultado</span>
                </h1>

                {/* Fecha + lugar */}
                <div className="flex flex-col gap-2 mb-10">
                  <span className="inline-flex items-center gap-2 text-base md:text-lg text-[#1A1A1A]">
                    <Calendar size={16} className="text-[#009640] shrink-0" />
                    Sorteo del{" "}
                    <strong className="font-black">
                      {resultado.fecha ? formatFechaHumana(resultado.fecha) : "—"}
                    </strong>
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm md:text-base text-[#1A1A1A]">
                    <Clock size={15} className="text-[#009640] shrink-0" />
                    <strong className="font-black">Asunción</strong>, Paraguay
                  </span>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  {/* JUGAR AHORA */}
                  <Button
                    size="lg"
                    onClick={() => document.querySelector("#puntos-de-venta")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="group relative overflow-hidden
                               bg-gradient-to-r from-[#F58220] via-[#FFCC00] to-[#F58220]
                               bg-[length:200%_auto] bg-[position:left_center]
                               text-[#1a1a1a] font-black uppercase tracking-wide text-xl
                               px-10 py-6 min-h-[64px] rounded-[1.5rem]
                               shadow-[0_8px_32px_rgba(245,130,32,0.50),0_0_24px_rgba(245,130,32,0.35)]
                               hover:bg-[position:right_center]
                               hover:shadow-[0_14px_44px_rgba(245,130,32,0.70),0_0_32px_rgba(255,204,0,0.40)]
                               hover:scale-[1.03] active:scale-[0.97]
                               transition-all duration-300 cursor-pointer border-0"
                  >
                    <motion.span
                      aria-hidden
                      className="absolute top-0 left-[-60%] h-full w-[38%] skew-x-[-18deg] pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }}
                      animate={{ left: ["-60%", "165%"] }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.85, ease: "easeInOut" }}
                    />
                    Jugar Ahora
                  </Button>

                  {/* SORTEO EN VIVO */}
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsLive(true)}
                    className="border-2 border-[#009640] text-[#007a33] bg-transparent
                               font-black uppercase tracking-wide text-xl
                               px-10 py-6 min-h-[64px] rounded-[1.5rem]
                               shadow-[0_2px_16px_rgba(0,150,64,0.08)]
                               hover:bg-[#009640] hover:text-white
                               hover:shadow-[0_10px_36px_rgba(0,150,64,0.42)]
                               transition-all duration-300 cursor-pointer"
                  >
                    <Play size={22} className="mr-2" />
                    Sorteo en Vivo
                  </Button>
                </div>
              </div>

              {/* ── Columna derecha: animal card flotante */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex justify-center lg:justify-end"
              >
                {/* Halo suerte detrás de la card */}
                <div className="relative">
                  <div className="absolute -inset-8 rounded-full pointer-events-none"
                       style={{
                         background: "radial-gradient(ellipse, rgba(0,150,64,0.28) 0%, rgba(255,204,0,0.16) 50%, transparent 72%)",
                         filter: "blur(20px)",
                       }} />

                  {/* Card anidada — cristal sobre blanco */}
                  <div className="relative rounded-[28px] p-8 md:p-10
                                  bg-gradient-to-br from-[#F0FAF5] to-[#FFFCF0]
                                  border border-[#009640]/10
                                  shadow-[0_8px_40px_rgba(0,150,64,0.08),0_2px_8px_rgba(0,0,0,0.04)]">
                    <div className="flex flex-col items-center gap-5">

                      {/* Aura pulsante + animal */}
                      <div className="relative">
                        <motion.div
                          className="absolute rounded-full pointer-events-none"
                          style={{
                            inset: '-40%', width: '180%', height: '180%',
                            background: "radial-gradient(circle, rgba(0,150,64,0.20) 0%, rgba(255,204,0,0.12) 45%, transparent 70%)",
                          }}
                          animate={{ scale: [1, 1.22, 1], opacity: [0.45, 1, 0.45] }}
                          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                        />
                        {resultado.animal && (
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 w-48 h-48 md:w-64 md:h-64"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getAnimalImageSrc(resultado.animal)}
                              alt={resultado.animal}
                              className="block dark:hidden w-full h-full object-contain"
                              style={{ filter: "invert(1) drop-shadow(0 0 15px rgba(255,204,0,0.8))" }}
                            />
                          </motion.div>
                        )}
                      </div>

                      {/* Nombre */}
                      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight
                                     font-[var(--font-gunterz)] text-[#2B2B2B]">
                        {resultado.animal}
                      </h2>

                      {/* Número ganador — protagonista */}
                      <div
                        className={`inline-flex items-center px-10 py-5 rounded-[1.25rem] bg-[#009640] text-white
                                    font-black text-5xl md:text-6xl font-[var(--font-gunterz)]
                                    animate-[number-reveal_0.45s_ease-out]${numberDone ? " winner-badge-pulse" : ""}`}
                        style={{ boxShadow: "0 10px 40px rgba(0,150,64,0.42), 0 2px 10px rgba(0,150,64,0.22), inset 0 2px 0 rgba(255,255,255,0.25)" }}
                      >
                        <AnimatedNumber target={parseInt(resultado.numero, 10) || 0} onComplete={handleNumberComplete} />
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2B2B2B]/50">
                          <Clock size={13} className="text-[#009640]" />
                          {resultado.fecha}
                        </span>
                        {resultado.turno && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                           text-xs font-bold uppercase tracking-wide
                                           bg-[#F58220]/10 border border-[#F58220]/28 text-[#c44d00]">
                            <Zap size={10} />{resultado.turno}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Decorative Stripes — Bandera Paraguay */}
      <div className="hidden md:block absolute bottom-0 right-0 w-64 h-32 opacity-40 pointer-events-none">
        <div className="absolute bottom-20 right-0 w-80 h-5 bg-[#D52B1E] transform -skew-x-12" />
        <div className="absolute bottom-10 right-0 w-80 h-5 bg-[#FFFFFF] transform -skew-x-12" />
        <div className="absolute bottom-0  right-0 w-80 h-5 bg-[#0038A8] transform -skew-x-12" />
      </div>
      <div className="md:hidden absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#D52B1E] via-white to-[#0038A8] opacity-60" />

      {/* Modal */}
      <AnimatePresence>
        {isLiveModalOpen && <LiveModal onClose={closeLiveModal} />}
      </AnimatePresence>
    </section>
  )
}
