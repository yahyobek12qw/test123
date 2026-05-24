import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { StatsStrip } from '@/components/landing/StatsStrip'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { DarkCTASection } from '@/components/landing/DarkCTASection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financial Intelligence Platform',
  description:
    "Shaxsiy moliya va global iqtisodiy razvedka - barchasi bitta platformada. O'zbekiston iqtisodiyoti, real-time bozorlar va AI tahlili.",
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsStrip />
      <FeaturesGrid />
      <DarkCTASection />
      <Footer />
    </>
  )
}
