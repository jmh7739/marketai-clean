"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

const banners = [
  {
    id: 1,
    title: "MarketAI에 오신 것을 환영합니다",
    subtitle: "AI 기술로 더 스마트한 쇼핑 경험을 제공합니다",
    bgColor: "bg-gradient-to-r from-blue-600 to-purple-600",
    buttonText: "지금 시작하기",
  },
  {
    id: 2,
    title: "🔥 실시간 인기 경매",
    subtitle: "지금 가장 핫한 상품들을 확인해보세요",
    bgColor: "bg-gradient-to-r from-red-500 to-pink-600",
    buttonText: "인기 상품 보기",
  },
  {
    id: 3,
    title: "💎 특가 세일",
    subtitle: "최대 70% 할인된 상품들을 만나보세요",
    bgColor: "bg-gradient-to-r from-green-500 to-teal-600",
    buttonText: "특가 상품 보기",
  },
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000) // 5초마다 자동 슬라이드

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const currentBanner = banners[currentSlide]

  return (
    <section className="relative h-64 overflow-hidden rounded-lg mx-4 mt-4">
      <div className={`${currentBanner.bgColor} h-full flex items-center justify-center text-white relative`}>
        <div className="text-center z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{currentBanner.title}</h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">{currentBanner.subtitle}</p>
          <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100">
            {currentBanner.buttonText}
          </Button>
        </div>

        {/* 이전/다음 버튼 */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* 인디케이터 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
