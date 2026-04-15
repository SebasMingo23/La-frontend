import { Suspense } from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { LocationsPageClient } from "@/components/puntos-de-venta/locations-page-client"
import { getLocales } from "@/lib/api"

export const metadata: Metadata = {
  title: "Puntos de Venta — Lotería de Animales",
  description: "Encontrá tu agencia más cercana en Paraguay. Más de 50 puntos de venta en Asunción y Gran Asunción.",
}

export default async function PuntosDeVentaPage() {
  // Fetch server-side — los datos ya llegan al cliente sin spinner inicial
  const locales = await getLocales().catch(() => [])

  return (
    <>
      <Header />
      {/*
        Suspense es obligatorio porque LocationsPageClient usa useSearchParams().
        El fallback es null porque el Header ya se renderiza y el mapa tiene su propio loading state.
      */}
      <Suspense fallback={null}>
        <LocationsPageClient locales={locales} />
      </Suspense>
    </>
  )
}
