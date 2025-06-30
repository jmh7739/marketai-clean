"use client"

import { Search, Gavel, CreditCard, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    icon: Search,
    title: "상품 검색",
    description: "AI 추천 시스템으로 원하는 상품을 쉽게 찾아보세요",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Gavel,
    title: "스마트 입찰",
    description: "자동 입찰 시스템으로 놓치지 않고 경매에 참여하세요",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: CreditCard,
    title: "안전한 결제",
    description: "에스크로 시스템으로 안전하게 거래를 완료하세요",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Truck,
    title: "빠른 배송",
    description: "실시간 배송 추적으로 상품을 안전하게 받아보세요",
    color: "bg-purple-100 text-purple-600",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">이용 방법</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            MarketAI의 스마트한 경매 시스템으로 간편하고 안전하게 거래하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="text-sm text-blue-600 font-medium mb-2">STEP {index + 1}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 특징 섹션 */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI 가격 예측</h3>
            <p className="text-gray-600">머신러닝 알고리즘이 시장 데이터를 분석하여 적정 가격을 예측합니다</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">🛡️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">안전한 거래</h3>
            <p className="text-gray-600">에스크로 시스템과 사기 방지 시스템으로 안전한 거래를 보장합니다</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">실시간 알림</h3>
            <p className="text-gray-600">입찰 현황과 경매 종료 알림을 실시간으로 받아보세요</p>
          </div>
        </div>
      </div>
    </section>
  )
}
