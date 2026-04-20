import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Youtube, Mail, Phone, MessageCircle } from "lucide-react"
import { getSettings } from "@/lib/api"
import type { SiteSettings } from "@/lib/types"

// ─── TikTok icon (no disponible en Lucide) ───────────────────────
function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.79a8.18 8.18 0 004.78 1.52V6.87a4.85 4.85 0 01-1.01-.18z" />
    </svg>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────
function cleanPhone(raw: string) {
  return raw.replace(/[^\d+]/g, "").replace(/^0/, "595")
}

function buildSocialLinks(s: SiteSettings) {
  return [
    s.instagram_url ? { href: s.instagram_url, label: "Instagram", Icon: Instagram } : null,
    s.facebook_url  ? { href: s.facebook_url,  label: "Facebook",  Icon: Facebook  } : null,
    s.tiktok_url    ? { href: s.tiktok_url,    label: "TikTok",    Icon: null       } : null,
    s.youtube_url   ? { href: s.youtube_url,   label: "YouTube",   Icon: Youtube   } : null,
    s.whatsapp_number
      ? {
          href: `https://wa.me/${cleanPhone(s.whatsapp_number)}`,
          label: "WhatsApp",
          Icon: MessageCircle,
        }
      : null,
  ].filter(Boolean) as { href: string; label: string; Icon: typeof Instagram | null }[]
}

// ─── Static footer links ──────────────────────────────────────────
const footerLinks = {
  juego: [
    { label: "Resultados",       href: "/resultados"       },
    { label: "Palpites IA",      href: "/#predicciones"    },
    { label: "Libro de Sueños",  href: "/#suenos"          },
    { label: "Tabla de Premios", href: "/tabla-de-premios" },
    { label: "Reglamento",       href: "/reglamento"       },
  ],
  empresa: [
    { label: "Sobre la Lotería", href: "/sobre-la-loteria" },
    { label: "Puntos de Venta",  href: "/puntos-de-venta"  },
    { label: "Ganadores",        href: "/#ganadores"       },
  ],
  legal: [
    { label: "Términos y Condiciones", href: "/terminos-y-condiciones" },
    { label: "Política de Privacidad", href: "/politica-de-privacidad" },
    { label: "Juego Responsable",      href: "/juego-responsable"      },
  ],
}

// ─── Component ───────────────────────────────────────────────────
export async function Footer() {
  let settings: SiteSettings = {}

  try {
    settings = await getSettings()
  } catch {
    // endpoint no disponible aún; se usarán fallbacks vacíos
  }

  const socialLinks = buildSocialLinks(settings)

  const phone = settings.phone?.trim()
  const email = settings.email?.trim()

  return (
    <footer className="bg-[#0f1620] border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logos/logo-dorado.png"
                alt="Lotería de Animales"
                width={280}
                height={80}
                className="h-24 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              La lotería de animales más emocionante de Paraguay. Juega responsablemente.
            </p>

            {/* Social icons — solo se renderizan si tienen URL */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    aria-label={social.label}
                  >
                    {social.Icon ? (
                      <social.Icon size={18} />
                    ) : (
                      <TikTokIcon size={18} />
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Juego Links */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wide text-sm mb-4">
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
            <h3 className="text-white font-bold uppercase tracking-wide text-sm mb-4">
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
            <h3 className="text-white font-bold uppercase tracking-wide text-sm mb-4">
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

          {/* Contact — solo se renderiza si hay datos */}
          {(phone || email) && (
            <div>
              <h3 className="text-white font-bold uppercase tracking-wide text-sm mb-4">
                Contacto
              </h3>
              <ul className="space-y-3">
                {phone && (
                  <li>
                    <a
                      href={`tel:${cleanPhone(phone)}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      <Phone size={14} className="text-primary flex-shrink-0" />
                      {phone}
                    </a>
                  </li>
                )}
                {email && (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      <Mail size={14} className="text-primary flex-shrink-0" />
                      {email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Decorative Stripes */}
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-1 bg-[#F5B500] rounded-full" />
          <div className="flex-1 h-1 bg-[#A31621] rounded-full" />
          <div className="flex-1 h-1 bg-[#3B82F6] rounded-full" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-xs">
          <p>© {new Date().getFullYear()} Lotería de Animales. Todos los derechos reservados.</p>
          <p className="text-center">El juego es solo para mayores de 18 años. Jugá responsablemente.</p>
        </div>
      </div>

      {/* Developer Credit */}
      <div className="w-full text-center py-4 mt-8 border-t border-black/5 dark:border-white/5">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
          Diseñado y desarrollado por Sebastián Mingo
        </p>
      </div>
    </footer>
  )
}
