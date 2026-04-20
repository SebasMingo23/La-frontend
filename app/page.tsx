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
import { getDreamsDictionary } from "@/lib/api"
import { ScrollBackground } from "@/components/scroll-background"

export default async function Home() {
  const dreamEntries = await getDreamsDictionary().catch(() => [])

  return (
    <ScrollBackground>
      <Header />
      <HeroSection />
      <WinnersSection />
      <BannersSlider />
      <PalpitesSection />
      <PredictionsSection />
      <DreamsSearchClient entries={dreamEntries} />
      <LocationsSection />
      <HowToPlaySection />
      <Footer />
      <WhatsAppButton />
    </ScrollBackground>
  )
}
