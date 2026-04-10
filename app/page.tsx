import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PredictionsSection } from "@/components/predictions-section"
import { DreamBookSection } from "@/components/dream-book-section"
import { WinnersSection } from "@/components/winners-section"
import { LocationsSection } from "@/components/locations-section"
import { HowToPlaySection } from "@/components/how-to-play-section"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <PredictionsSection />
      <DreamBookSection />
      <WinnersSection />
      <LocationsSection />
      <HowToPlaySection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
