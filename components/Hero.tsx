"use client"
import { Button } from "@/components/ui/button"
import SafeLink from "@/components/SafeLink"
import { useState, useEffect } from "react"
import { useAppNavigation } from "@/lib/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [liveStats, setLiveStats] = useState({
    activeAuctions: 0,
    todayItems: 0,
    activeUsers: 0,
  })
  const { navigate } = useAppNavigation()

  // 배너 슬라이드 데이터
  const banners = [
    {
      title: "AI가 만드는 스마트 경매",
      subtitle: "인공지능 기술로 더 정확한 가격 예측과 안전한 거래를 제공하는 차세대 경매 플랫폼입니다.",
      bgColor: "from-blue-600 to-purple-600",
      primaryAction: { text: "경매 둘러보기", href: "/search" },
      secondaryAction: { text: "판매하기", href: "/sell" },
    },
    {
      title: "🔥 HOT 경매 진행중!",
      subtitle: "지금 가장 인기있는 상품들의 치열한 경매가 진행중입니다. 놓치지 마세요!",
      bgColor: "from-red-500 to-orange-500",
      primaryAction: { text: "HOT 경매 보기", href: "/live-auctions" },
      secondaryAction: { text: "입찰 참여", href: "/search" },
    },
    {
      title: "💎 프리미엄 상품 특가",
      subtitle: "엄선된 프리미엄 상품들을 특별한 가격으로 만나보세요. 한정 수량!",
      bgColor: "from-emerald-500 to-teal-500",
      primaryAction: { text: "프리미엄 보기", href: "/category/premium" },
      secondaryAction: { text: "알림 설정", href: "/notifications" },
    },
  ]

  // 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  // 실제 API에서 실시간 통계 가져오기
  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        // 실제 API 호출 (현재는 더미 데이터)
        // const response = await fetch('/api/stats/live')
        // const data = await response.json()

        // 임시로 실제 수치 시뮬레이션
        const now = new Date()
        const hour = now.getHours()

        // 시간대별 실제적인 수치 계산
        const baseActiveAuctions = 850 + Math.floor(Math.sin((hour * Math.PI) / 12) * 200)
        const baseTodayItems = 2100 + Math.floor(Math.random() * 300)
        const baseActiveUsers = 8500 + Math.floor(Math.sin((hour * Math.PI) / 12) * 3000)

        setLiveStats({
          activeAuctions: baseActiveAuctions,
          todayItems: baseTodayItems,
          activeUsers: baseActiveUsers,
        })
      } catch (error) {
        console.error("Failed to fetch live stats:", error)
      }
    }

    fetchRealStats()
    const interval = setInterval(fetchRealStats, 60000) // 1분마다 업데이트

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const currentBanner = banners[currentSlide]

  return (
    <section className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 슬라이더 배너 */}
        <div className="relative mb-8">
          <div
            className={`bg-gradient-to-r ${currentBanner.bgColor} rounded-2xl p-8 text-white relative overflow-hidden`}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white transform translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white transform -translate-x-24 translate-y-24"></div>
            </div>

            <div className="relative z-10 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{currentBanner.title}</h1>
              <p className="text-lg mb-6 opacity-90">{currentBanner.subtitle}</p>
              <div className="flex gap-4">
                <SafeLink href={currentBanner.primaryAction.href}>
                  <Button size="lg" variant="secondary">
                    {currentBanner.primaryAction.text}
                  </Button>
                </SafeLink>
                <SafeLink href={currentBanner.secondaryAction.href}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-gray-900"
                  >
                    {currentBanner.secondaryAction.text}
                  </Button>
                </SafeLink>
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 실시간 경매 현황 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              실시간 경매 현황
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                LIVE
              </span>
            </h2>
            <SafeLink href="/live-auctions">
              <Button variant="outline" size="sm">
                전체보기
              </Button>
            </SafeLink>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <div className="text-2xl font-bold text-blue-600 mb-1">{liveStats.activeAuctions.toLocaleString()}</div>
              <div className="text-sm text-gray-600">진행중인 경매</div>
              <div className="text-xs text-green-600 mt-1">↗ 실시간 업데이트</div>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
              <div className="text-2xl font-bold text-green-600 mb-1">{liveStats.todayItems.toLocaleString()}</div>
              <div className="text-sm text-gray-600">오늘 등록된 상품</div>
              <div className="text-xs text-blue-600 mt-1">📈 실시간 집계</div>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
              <div className="text-2xl font-bold text-purple-600 mb-1">{liveStats.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">활성 사용자</div>
              <div className="text-xs text-orange-600 mt-1">🔥 현재 접속중</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
