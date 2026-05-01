import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { BannersSlider } from "@/components/banners-slider"
import { PalpitesSection } from "@/components/palpites-section"
import { DreamsSearchClient } from "@/components/dreams-search"
import { PredictionsSection } from "@/components/predictions-section"
import { WinnersSection } from "@/components/winners-section"
import { LocationsSection } from "@/components/locations-section"
import { HowToPlaySection } from "@/components/how-to-play-section"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getDreamsDictionary, getResultados } from "@/lib/api"
import { ScrollBackground } from "@/components/scroll-background"

export default async function Home() {
  const [dreamEntries, resultados] = await Promise.all([
    getDreamsDictionary().catch(() => []),
    getResultados(1).catch(() => []),
  ])

  const winnerAnimalId = resultados[0]?.numero != null
    ? parseInt(resultados[0].numero, 10)
    : null

  return (
    <ScrollBackground>
      <Header />
      <HeroSection />
      <BannersSlider />
      <WinnersSection />
      <PalpitesSection />
      <PredictionsSection />
      <DreamsSearchClient entries={dreamEntries} winnerAnimalId={winnerAnimalId} />
      <LocationsSection />
      <HowToPlaySection />
      <Footer />
      <WhatsAppButton />
    </ScrollBackground>
  )
}
