import Link from "next/link"
import type { ReactNode } from "react"

interface PageHeroProps {
  breadcrumb: string
  title: ReactNode
  subtitle: string
  maxWidth?: string
}

export function PageHero({ breadcrumb, title, subtitle, maxWidth = "max-w-4xl" }: PageHeroProps) {
  return (
    <div
      className="bg-brand-hero pt-24 pb-10 px-4"
      style={{ backgroundColor: '#009640' }}
    >
      <div className={`${maxWidth} mx-auto`}>
        <nav className="mb-6 flex items-center gap-2 text-sm text-white/60">
          <Link href="/" className="hover:text-white/90 transition-colors">
            Inicio
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-white/90">{breadcrumb}</span>
        </nav>

        <h1 className="font-[family-name:var(--font-gunterz)] text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-none mb-4">
          {title}
        </h1>
        <p className="text-white/60 text-lg max-w-xl">{subtitle}</p>

        <div className="mt-8 h-px w-full bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
      </div>
    </div>
  )
}
