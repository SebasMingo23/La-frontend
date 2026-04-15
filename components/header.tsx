"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

// ─── Navegación principal ────────────────────────────────────────────────────
const navLinks = [
  { href: "/#predicciones",   label: "Palpites IA"     },
  { href: "/#suenos",         label: "Libro de Sueños" },
  { href: "/puntos-de-venta", label: "Puntos de Venta" },
  { href: "/#ganadores",      label: "Ganadores"       },
]

// ─── Dropdown "Institucional" ────────────────────────────────────────────────
const institucionalLinks = [
  { href: "/sobre-la-loteria",  label: "Sobre Nosotros"   },
  { href: "/tabla-de-premios",  label: "Tabla de Premios" },
  { href: "/reglamento",        label: "Reglamento"       },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false)
  const [scrolled,       setScrolled]         = useState(false)
  const [dropdownOpen,   setDropdownOpen]     = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
        scrolled
          ? "bg-loteria-dark/95 backdrop-blur-md border-b border-loteria-gold/20 shadow-lg"
          : "bg-transparent border-b border-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Lotería de Animales"
              width={300}
              height={90}
              className="h-16 md:h-18 w-auto"
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
                className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}

            {/* Dropdown Institucional */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide whitespace-nowrap"
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

          {/* Desktop CTA — Resultados (con badge VIVO) + Login */}
          <div className="hidden md:flex items-center gap-3">
            {/* Resultados con badge VIVO integrado */}
            <div className="relative">
              {/* Badge VIVO — esquina superior derecha del botón */}
              <span className="absolute -top-2.5 -right-2 z-10 flex items-center gap-1
                               px-1.5 py-0.5 bg-red-500 rounded-full pointer-events-none">
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
                variant="outline"
                className="border-2 border-primary/50 hover:border-primary hover:bg-primary
                           text-primary hover:text-white font-bold uppercase tracking-wide
                           text-sm transition-all cursor-pointer"
              >
                <Link href="/resultados">Resultados</Link>
              </Button>
            </div>

            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold
                         uppercase tracking-wide shadow-[0_0_20px_rgba(255,122,0,0.4)]
                         hover:shadow-[0_0_30px_rgba(255,122,0,0.6)] transition-all cursor-pointer"
            >
              <a href="https://dev.loteriadeanimales.app" target="_blank" rel="noopener noreferrer">
                Login
              </a>
            </Button>
          </div>

          {/* Mobile: Resultados + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <div className="relative">
              <span className="absolute -top-2 -right-1.5 z-10 flex items-center gap-0.5
                               px-1 py-0.5 bg-red-500 rounded-full pointer-events-none">
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
                variant="outline"
                className="border-2 border-primary/60 hover:border-primary hover:bg-primary
                           text-primary hover:text-white font-bold uppercase tracking-wide
                           text-xs px-3 h-8 transition-all cursor-pointer"
              >
                <Link href="/resultados">Resultados</Link>
              </Button>
            </div>

            <button
              className="p-2 text-foreground"
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
            className="md:hidden bg-[#1E2B3E]/95 backdrop-blur-md border-b border-border"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {/* Links principales */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleMobileClick(e, link.href)}
                  className="text-foreground/80 hover:text-primary transition-colors
                             font-medium text-sm uppercase tracking-wide py-2.5 px-2
                             rounded-xl hover:bg-primary/5"
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
                    className="text-foreground/70 hover:text-primary transition-colors
                               font-medium text-sm uppercase tracking-wide py-2.5 px-2
                               rounded-xl hover:bg-primary/5 block"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border/40">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-2 border-primary/50 hover:border-primary hover:bg-primary
                             text-primary hover:text-white font-bold uppercase tracking-wide
                             transition-all cursor-pointer"
                >
                  <Link href="/resultados" onClick={() => setMobileMenuOpen(false)}>
                    Resultados
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground
                             font-bold uppercase tracking-wide cursor-pointer"
                >
                  <a
                    href="https://dev.loteriadeanimales.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </a>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
