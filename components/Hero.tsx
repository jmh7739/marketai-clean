"use client"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const heroSlides = [
  {
    id: 1,
    title: "AI가 도와주는 스마트 경매",
    subtitle: "사진만 올려도 자동으로 상품 정보를 분석해드려요",
    image: "/placeholder.svg?height=400&width=800&text=AI+Smart+Auction",
    cta: "지금 판매하기",
    link: "/sell",
    bgColor: "from-blue-600 to-purple-600",
  },
  {
    id: 2,
    title: "실시간 경매의 짜릿함",
    subtitle: "투명하고 공정한 경매 시스템으로 최고가에 판매하세요",
    image: "/placeholder.svg?height=400&width=800&text=Live+Auction",
    cta: "경매 참여하기",
    link: "/auth/signup",
    bgColor: "from-green-600 to-blue-600",
  },
  {
    id: 3,
    title: "안전한 거래 보장",
    subtitle: "에스크로 시스템으로 안전하게 거래하세요",
    image: "/placeholder.svg?height=400&width=800&text=Safe+Trading",
    cta: "더 알아보기",
    link: "/how-it-works",
    bgColor: "from-purple-600 to-pink-600",
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="w-full">
      {/* 메인 히어로 섹션 */}
      <div className="relative h-[500px] overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        {/* 슬라이드 배경 */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-90`} />
              <img
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                className="w-full h-full object-cover opacity-20"
              />
            </div>
          ))}
        </div>

        {/* 컨텐츠 */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* 왼쪽: 텍스트 컨텐츠 */}
              <div className="text-white">
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">{heroSlides[currentSlide].title}</h1>
                <p className="text-xl mb-8 text-blue-100 leading-relaxed">{heroSlides[currentSlide].subtitle}</p>

                {/* CTA 버튼 */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                    <Link href={heroSlides[currentSlide].link}>{heroSlides[currentSlide].cta}</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
                  >
                    <Link href="/how-it-works">이용방법 보기</Link>
                  </Button>
                </div>
              </div>

              {/* 오른쪽: 이미지 (모바일에서는 숨김) */}
              <div className="hidden lg:block">
                <div className="relative">
                  <img
                    src={heroSlides[currentSlide].image || "/placeholder.svg"}
                    alt={heroSlides[currentSlide].title}
                    className="w-full max-w-lg mx-auto rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 슬라이드 네비게이션 화살표 */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all z-20 backdrop-blur-sm"
          aria-label="이전 슬라이드"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all z-20 backdrop-blur-sm"
          aria-label="다음 슬라이드"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 슬라이드 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
