import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getPages } from "@/lib/api"

export const metadata = {
  title: "Sobre la Lotería | Lotería de Animales",
  description: "Conocé la historia y misión de la Lotería de Animales de Asunción, Paraguay.",
}

export default async function SobreLaLoteriaPage() {
  let html: string | null = null

  try {
    const pages = await getPages()
    html = pages.sobre_loteria ?? null
  } catch {
    // El endpoint puede no estar disponible; se muestra fallback amigable
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Barra de acento superior */}
        <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />

        {/* Hero de página */}
        <div className="pt-24 pb-10 px-4 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-foreground">Sobre la Lotería</span>
          </nav>

          {/* Título */}
          <h1 className="font-[family-name:var(--font-gunterz)] text-4xl md:text-5xl lg:text-6xl text-foreground uppercase tracking-tight leading-none mb-4">
            Sobre{" "}
            <span className="text-primary">la Lotería</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Historia, misión y valores de la Lotería de Animales de Paraguay.
          </p>

          {/* Separador */}
          <div className="mt-8 h-px w-full bg-gradient-to-r from-primary/40 via-border to-transparent" />
        </div>

        {/* Contenido WordPress */}
        <div className="px-4 pb-24 max-w-4xl mx-auto">
          {html ? (
            <article
              className="wp-content bg-card rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <div className="bg-card rounded-[2.5rem] p-12 md:p-16 text-center shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="font-[family-name:var(--font-gunterz)] text-xl text-foreground uppercase mb-3">
                Contenido no disponible
              </h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                La información sobre la lotería no está disponible en este momento. Por favor, volvé a intentarlo más tarde.
              </p>
              <Link
                href="/"
                className="inline-block mt-8 px-6 py-3 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-semibold uppercase tracking-wide"
              >
                Volver al inicio
              </Link>
            </div>
          )}
        </div>

        <Footer />
      </main>

      <WhatsAppButton />
    </>
  )
}
