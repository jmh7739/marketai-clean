"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, TrendingUp, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import SafeLink from "@/components/SafeLink"

const bannerSlides = [
  {
    id: 1,
    title: "AI 기반 스마트 경매",
    subtitle: "인공지능이 분석하는 정확한 시세와 투명한 거래",
    description: "머신러닝 알고리즘으로 상품 가치를 정확히 평가하고, 공정한 경매 환경을 제공합니다.",
    bgColor: "from-blue-600 to-purple-700",
    primaryAction: { text: "경매 참여하기", href: "/search" },
    secondaryAction: { text: "판매하기", href: "/sell" },
  },
  {
    id: 2,
    title: "안전한 거래 보장",
    subtitle: "에스크로 시스템과 실명 인증으로 신뢰할 수 있는 거래",
    description: "전화번호 인증, 본인확인, 안전결제 시스템으로 사기 없는 깨끗한 거래환경을 만듭니다.",
    bgColor: "from-green-600 to-teal-700",
    primaryAction: { text: "안전거래 알아보기", href: "/terms" },
    secondaryAction: { text: "회원가입", href: "/auth/signup" },
  },
  {
    id: 3,
    title: "실시간 경매 현황",
    subtitle: "지금 이 순간 진행되는 뜨거운 경매들",
    description: "실시간 입찰 현황과 AI 추천으로 놓치지 말아야 할 경매를 찾아보세요.",
    bgColor: "from-orange-600 to-red-700",
    primaryAction: { text: "실시간 경매 보기", href: "/live-auctions" },
    secondaryAction: { text: "경매 테스트", href: "/auction-test" },
  },
]

// 실제 데이터베이스에서 가져오는 실시간 통계
const getRealTimeStats = () => {
  try {
    // 실제 로컬스토리지에서 데이터 가져오기
    const auctions = JSON.parse(localStorage.getItem("auctions") || "[]")
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]")

    const now = new Date()
    const today = now.toDateString()

    // 오늘 거래 완료된 것들
    const todayTransactions = transactions.filter((t: any) => {
      try {
        return new Date(t.completedAt).toDateString() === today
      } catch {
        return false
      }
    })

    // 진행중인 경매 (종료시간이 현재보다 미래)
    const activeAuctions = auctions.filter((auction: any) => {
      try {
        return new Date(auction.endTime) > now && auction.status === "active"
      } catch {
        return false
      }
    })

    return {
      activeAuctions: activeAuctions.length,
      totalUsers: users.length,
      todayTransactions: todayTransactions.length,
    }
  } catch (error) {
    console.error("통계 데이터 로드 실패:", error)
    return {
      activeAuctions: 0,
      totalUsers: 0,
      todayTransactions: 0,
    }
  }
}

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [stats, setStats] = useState(getRealTimeStats())

  // 슬라이드 자동 전환
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // 실시간 통계 업데이트 (실제 데이터 기반)
  useEffect(() => {
    const updateStats = () => {
      setStats(getRealTimeStats())
    }

    // 초기 로드
    updateStats()

    // 30초마다 업데이트
    const statsTimer = setInterval(updateStats, 30000)

    // 로컬스토리지 변경 감지
    const handleStorageChange = () => {
      updateStats()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      clearInterval(statsTimer)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)
  }

  const currentBanner = bannerSlides[currentSlide]

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
              <p className="text-base mb-6 opacity-80">{currentBanner.description}</p>
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
              {bannerSlides.map((_, index) => (
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

        {/* 실시간 경매 현황 (실제 데이터) */}
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
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.activeAuctions}</div>
              <div className="text-sm text-gray-600">진행중인 경매</div>
              <div className="text-xs text-green-600 mt-1">↗ 실시간 업데이트</div>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">전체 회원수</div>
              <div className="text-xs text-blue-600 mt-1">📈 실제 회원수</div>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.todayTransactions}</div>
              <div className="text-sm text-gray-600">오늘 거래 완료</div>
              <div className="text-xs text-purple-600 mt-1">💰 실제 거래</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
