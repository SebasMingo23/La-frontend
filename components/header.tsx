"use client"

import Image from "next/image"
import Link from "next/link"

const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL ?? 'https://dev.loteriadeanimales.app'
import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

// ─── Navegación principal ────────────────────────────────────────────────────
const navLinks = [
  { href: "/#ganadores",      label: "Ganadores"       },
  { href: "/#predicciones",   label: "Palpites IA"     },
  { href: "/#suenos",         label: "Libro de Sueños" },
  { href: "/puntos-de-venta", label: "Puntos de Venta" },
]

// ─── Dropdown "Institucional" ────────────────────────────────────────────────
const institucionalLinks = [
  { href: "/sobre-la-loteria",  label: "Sobre Nosotros"   },
  { href: "/tabla-de-premios",  label: "Tabla de Premios" },
  { href: "/reglamento",        label: "Reglamento"       },
]

// ─── Toggle Tema ─────────────────────────────────────────────────────────────
function ThemeToggle({ scrolled }: { scrolled: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Placeholder sin ícono para evitar layout shift en SSR
  if (!mounted) return <div className="w-9 h-9 rounded-xl" />

  const isDark = theme === "dark"
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      className={`
        w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer
        ${scrolled
          ? "bg-[#2B2B2B]/8 hover:bg-[#2B2B2B]/15 text-[#2B2B2B] dark:bg-white/10 dark:hover:bg-white/18 dark:text-white"
          : "bg-white/10 hover:bg-white/20 text-white"
        }
      `}
    >
      {isDark
        ? <Sun  size={16} className="transition-transform duration-300" />
        : <Moon size={16} className="transition-transform duration-300" />
      }
    </button>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false)
  const [scrolled,       setScrolled]         = useState(false)
  const [dropdownOpen,   setDropdownOpen]     = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  // En light mode la navbar es siempre sólida (el video de fondo la haría ilegible si fuera transparente)
  const isLight = mounted && resolvedTheme === "light"

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Click-outside para cerrar el dropdown
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleMobileClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false)
    if (href.startsWith("/#") && window.location.pathname === "/") {
      e.preventDefault()
      document.querySelector(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        isLight
          ? "bg-white shadow-sm border-b border-gray-100"
          : scrolled
            ? "bg-[#1E2B3E]/97 backdrop-blur-md border-b border-[#009640]/30 shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
            : "bg-transparent border-b border-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Barra superior verde-naranja */}
      <div className="h-1 w-full bg-gradient-to-r from-[#009640] via-[#FFCC00] to-[#F58220]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo — adaptativo: blanco en hero, negro/dorado según tema al hacer scroll */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={
                isLight
                  ? "/images/logos/logo-negro.png"
                  : (!mounted || !scrolled)
                    ? "/images/logos/logo-blanco.png"
                    : "/images/logos/logo-dorado.png"
              }
              alt="Lotería de Animales"
              width={300}
              height={90}
              className="h-16 md:h-[72px] w-auto transition-opacity duration-300"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className={`relative font-medium text-sm uppercase tracking-wide whitespace-nowrap transition-colors hover:text-[#009640]
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#F58220] after:transition-all after:duration-300 hover:after:w-full
                  ${isLight ? "text-[#2B2B2B]" : scrolled ? "text-white/90" : "text-white/85"}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Dropdown Institucional */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className={`flex items-center gap-1 font-medium text-sm uppercase tracking-wide whitespace-nowrap transition-colors hover:text-[#009640] ${isLight ? "text-[#2B2B2B]" : scrolled ? "text-white/90" : "text-white/85"}`}
              >
                Institucional
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52
                               bg-card/95 backdrop-blur-md border border-border
                               rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                               overflow-hidden z-50"
                  >
                    {institucionalLinks.map((link, i) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setDropdownOpen(false)}
                        className={`block px-5 py-3 text-sm text-foreground/80 hover:text-primary
                                    hover:bg-primary/10 transition-colors
                                    ${i < institucionalLinks.length - 1 ? "border-b border-border/50" : ""}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Desktop CTA — Resultados (con badge VIVO) + Toggle + Login */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle scrolled={scrolled || isLight} />
            {/* Resultados con badge VIVO integrado */}
            <div className="relative">
              {/* Badge VIVO — esquina superior derecha del botón */}
              <span className="absolute -top-2.5 -right-2 z-10 flex items-center gap-1
                               px-1.5 py-0.5 bg-[#009640] rounded-full pointer-events-none">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                </span>
                <span className="text-white text-[9px] font-bold uppercase tracking-wide
                                 font-[var(--font-gunterz)] leading-none">
                  VIVO
                </span>
              </span>
              <Button
                asChild
                className="bg-gradient-to-r from-[#F58220] to-[#FF9D00] text-white font-bold uppercase tracking-wide
                           text-sm shadow-[0_4px_16px_rgba(245,130,32,0.4)] hover:shadow-[0_8px_24px_rgba(245,130,32,0.6)]
                           hover:scale-105 transition-all cursor-pointer border-0"
              >
                <Link href="/resultados">Resultados</Link>
              </Button>
            </div>

            <a
              href={LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 rounded-xl font-black uppercase tracking-wide text-sm
                         bg-gradient-to-r from-[#009640] to-[#00b84a]
                         text-white shadow-[0_4px_16px_rgba(0,150,64,0.4)]
                         hover:shadow-[0_8px_24px_rgba(0,150,64,0.55)] hover:scale-105
                         transition-all duration-300 cursor-pointer"
            >
              Juega aquí
            </a>
          </div>

          {/* Mobile: Toggle + Resultados + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle scrolled={scrolled || isLight} />
            <div className="relative">
              <span className="absolute -top-2 -right-1.5 z-10 flex items-center gap-0.5
                               px-1 py-0.5 bg-[#009640] rounded-full pointer-events-none">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                </span>
                <span className="text-white text-[8px] font-bold uppercase font-[var(--font-gunterz)] leading-none">
                  VIVO
                </span>
              </span>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-[#F58220] to-[#FF9D00] text-white font-bold uppercase tracking-wide
                           text-xs px-3 h-8 shadow-[0_4px_12px_rgba(245,130,32,0.4)]
                           transition-all cursor-pointer border-0"
              >
                <Link href="/resultados">Resultados</Link>
              </Button>
            </div>

            <button
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden relative bg-white/98 dark:bg-[#1E2B3E]/98 backdrop-blur-md border-b border-[#009640]/20 dark:border-[#009640]/30 shadow-lg"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {/* Links principales */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleMobileClick(e, link.href)}
                  className="text-[#2B2B2B] dark:text-white/90 hover:text-[#009640] dark:hover:text-[#009640] transition-colors
                             font-medium text-sm uppercase tracking-wide py-2.5 px-2
                             rounded-xl hover:bg-[#009640]/5 dark:hover:bg-[#009640]/10"
                >
                  {link.label}
                </Link>
              ))}

              {/* Sección Institucional en mobile (sin dropdown, abierto) */}
              <div className="mt-1 pt-2 border-t border-border/40">
                <p className="text-muted-foreground/60 text-[10px] uppercase tracking-widest
                              px-2 mb-1">
                  Institucional
                </p>
                {institucionalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#2B2B2B]/70 dark:text-white/60 hover:text-[#009640] dark:hover:text-[#009640] transition-colors
                               font-medium text-sm uppercase tracking-wide py-2.5 px-2
                               rounded-xl hover:bg-[#009640]/5 dark:hover:bg-[#009640]/10 block"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border/40">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#F58220] to-[#FF9D00] text-white font-bold uppercase tracking-wide
                             shadow-[0_4px_16px_rgba(245,130,32,0.4)] transition-all cursor-pointer border-0"
                >
                  <Link href="/resultados" onClick={() => setMobileMenuOpen(false)}>
                    Resultados
                  </Link>
                </Button>
                <a
                  href={LOGIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl font-black uppercase tracking-wide
                             bg-gradient-to-r from-[#009640] to-[#00b84a]
                             text-white shadow-[0_4px_16px_rgba(0,150,64,0.4)]
                             transition-all duration-300 cursor-pointer"
                >
                  Juega aquí
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
