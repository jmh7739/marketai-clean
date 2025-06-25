"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Hero } from "@/components/Hero"
import { FeaturedAuctions } from "@/components/FeaturedAuctions"
import HowItWorks from "@/components/HowItWorks"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedAuctions />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
