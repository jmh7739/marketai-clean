"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Hero } from "@/components/Hero"
import { FeaturedAuctions } from "@/components/FeaturedAuctions"
import HowItWorks from "@/components/HowItWorks"
import Sidebar from "@/components/Sidebar"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        {/* 사이드바 */}
        <div className="hidden lg:block w-64 bg-white shadow-sm">
          <Sidebar />
        </div>

        {/* 메인 콘텐츠 */}
        <main className="flex-1">
          <Hero />
          <FeaturedAuctions />
          <HowItWorks />
        </main>
      </div>
      <Footer />
    </div>
  )
}
