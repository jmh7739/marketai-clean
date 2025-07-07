"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const banners = [
  {
    id: 1,
    title: "MarketAI 경매 플랫폼에 오신 것을 환영합니다!",
    subtitle: "AI 기반 스마트 경매로 더 나은 거래 경험을 제공합니다",
    background: "bg-gradient-to-r from-blue-600 to-purple-600",
    textColor: "text-white",
  },
  {
    id: 2,
    title: "실시간 경매 진행중",
    subtitle: "지금 바로 참여하여 원하는 상품을 경매로 만나보세요",
    background: "bg-gradient-to-r from-green-500 to-teal-600",
    textColor: "text-white",
  },
  {
    id: 3,
    title: "안전한 거래 보장",
    subtitle: "에스크로 시스템으로 안전하고 신뢰할 수 있는 거래",
    background: "bg-gradient-to-r from-orange-500 to-red-600",
    textColor: "text-white",
  },
  {
    id: 4,
    title: "첫 경매 수수료 무료",
    subtitle: "지금 가입하고 첫 경매 등록 시 수수료 면제 혜택을 받으세요",
    background: "bg-gradient-to-r from-purple-600 to-pink-600",
    textColor: "text-white",
  },
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          } ${banner.background}`}
        >
          <div className="flex items-center justify-center h-full px-8">
            <div className={`text-center ${banner.textColor}`}>
              <h1 className="text-2xl md:text-4xl font-bold mb-4">{banner.title}</h1>
              <p className="text-lg md:text-xl opacity-90">{banner.subtitle}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroBanner
