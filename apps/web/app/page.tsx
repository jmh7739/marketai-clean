import Hero from "@/components/Hero"
import Categories from "@/components/Categories"
import FeaturedAuctions from "@/components/FeaturedAuctions"
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations"
import HowItWorks from "@/components/HowItWorks"
import Sidebar from "@/components/Sidebar"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <Hero />
        
        {/* 인기 경매 상품 - 가장 눈에 띄는 위치 */}
        <section className="py-8">
          <FeaturedAuctions />
        </section>

        {/* 개인화 추천 상품 */}
        <section className="py-8">
          <PersonalizedRecommendations />
        </section>

        <Categories />
        <HowItWorks />
      </main>
    </div>
  )
}
