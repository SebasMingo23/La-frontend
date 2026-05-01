import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { PageHero } from "@/components/page-hero"
import { getPages } from "@/lib/api"
import { sanitizeWpHtml } from "@/lib/sanitize"

export const metadata = {
  title: "Juego Responsable | Lotería de Animales",
  description: "Información sobre prácticas de juego responsable en la Lotería de Animales.",
}

export default async function JuegoResponsablePage() {
  let html: string | null = null

  try {
    const pages = await getPages()
    html = pages.juego_responsable ?? null
  } catch {
    // El endpoint puede no estar disponible; se muestra fallback amigable
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        <PageHero
          breadcrumb="Juego Responsable"
          title={<>Juego{" "}<span className="text-primary">Responsable</span></>}
          subtitle="Jugá con conciencia. El juego es solo para mayores de 18 años."
        />

        {/* Contenido WordPress */}
        <div className="px-4 pb-24 max-w-4xl mx-auto">
          {html ? (
            <article
              className="wp-content bg-card rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
              dangerouslySetInnerHTML={{ __html: sanitizeWpHtml(html ?? "") }}
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
                La información sobre juego responsable no está disponible en este momento. Por favor, volvé a intentarlo más tarde.
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
