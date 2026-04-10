"use client"

import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Youtube, Mail, Phone, MessageCircle } from "lucide-react"

const footerLinks = {
  juego: [
    { label: "Resultados", href: "#resultados" },
    { label: "Palpites IA", href: "#predicciones" },
    { label: "Libro de Sueños", href: "#suenos" },
    { label: "Tabla de Premios", href: "#" },
    { label: "Reglamento", href: "#" },
  ],
  empresa: [
    { label: "Sobre Nosotros", href: "#sobre" },
    { label: "Puntos de Venta", href: "#locales" },
    { label: "Ganadores", href: "#ganadores" },
    { label: "Contacto", href: "#" },
  ],
  legal: [
    { label: "Términos y Condiciones", href: "#" },
    { label: "Política de Privacidad", href: "#" },
    { label: "Juego Responsable", href: "#" },
  ],
}

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: MessageCircle, href: "https://wa.me/59521612345", label: "WhatsApp" },
]

export function Footer() {
  return (
    <footer className="bg-[#0f1620] border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo.png"
                alt="Lotería de Animales"
                width={160}
                height={44}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              La lotería de animales más emocionante de Paraguay. Juega responsablemente.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Juego Links */}
          <div>
            <h3 className="text-foreground font-bold uppercase tracking-wide text-sm mb-4">
              Juego
            </h3>
            <ul className="space-y-3">
              {footerLinks.juego.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa Links */}
          <div>
            <h3 className="text-foreground font-bold uppercase tracking-wide text-sm mb-4">
              Empresa
            </h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-foreground font-bold uppercase tracking-wide text-sm mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-foreground font-bold uppercase tracking-wide text-sm mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+59521612345"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Phone size={14} className="text-primary" />
                  +595 21 612 345
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@loteriadeanimales.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Mail size={14} className="text-primary" />
                  info@loteriadeanimales.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Decorative Stripes */}
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-1 bg-[#F5B500] rounded-full" />
          <div className="flex-1 h-1 bg-[#A31621] rounded-full" />
          <div className="flex-1 h-1 bg-[#3B82F6] rounded-full" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-xs">
          <p>
            © {new Date().getFullYear()} Lotería de Animales. Todos los derechos reservados.
          </p>
          <p className="text-center">
            El juego es solo para mayores de 18 años. Juega responsablemente.
          </p>
        </div>
      </div>
    </footer>
  )
}
