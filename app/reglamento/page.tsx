import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { PageHero } from "@/components/page-hero"
import { getPages } from "@/lib/api"
import { sanitizeWpHtml } from "@/lib/sanitize"

export const metadata = {
  title: "Reglamento | Lotería de Animales",
  description: "Leé el reglamento oficial de la Lotería de Animales de Asunción, Paraguay.",
}

export default async function ReglamentoPage() {
  let html: string | null = null

  try {
    const pages = await getPages()
    html = pages.reglamento ?? null
  } catch {
    // El endpoint puede no estar disponible; se muestra fallback amigable
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        <PageHero
          breadcrumb="Reglamento"
          title={<>Regla<span className="text-accent">mento</span></>}
          subtitle="Normativa oficial y condiciones de participación vigentes."
        />

        {/* Contenido WordPress */}
        <div className="px-4 pb-24 max-w-4xl mx-auto">
          {html ? (
            <article
              className="wp-content bg-card rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.3)]
                         [&_p]:text-slate-700 dark:[&_p]:text-gray-300
                         [&_li]:text-slate-700 dark:[&_li]:text-gray-300
                         [&_ul]:text-slate-700 dark:[&_ul]:text-gray-300
                         [&_ol]:text-slate-700 dark:[&_ol]:text-gray-300
                         [&_strong]:text-slate-900 dark:[&_strong]:text-white
                         [&_td]:text-slate-700 dark:[&_td]:text-gray-300"
              dangerouslySetInnerHTML={{ __html: sanitizeWpHtml(html ?? "") }}
            />
          ) : (
            <div className="bg-card rounded-[2.5rem] p-12 md:p-16 text-center shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="font-[family-name:var(--font-gunterz)] text-xl text-foreground uppercase mb-3">
                Contenido no disponible
              </h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                El reglamento no está disponible en este momento. Por favor, volvé a intentarlo más tarde.
              </p>
              <Link
                href="/"
                className="inline-block mt-8 px-6 py-3 rounded-full bg-accent/20 text-accent hover:bg-accent/30 transition-colors text-sm font-semibold uppercase tracking-wide"
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
