"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Gavel, CreditCard, Truck } from "lucide-react"
import SafeLink from "@/components/SafeLink"

const steps = [
  {
    icon: Search,
    title: "상품 검색",
    description: "원하는 상품을 검색하고 경매 정보를 확인하세요",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Gavel,
    title: "입찰 참여",
    description: "실시간으로 진행되는 경매에 참여하여 입찰하세요",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: CreditCard,
    title: "결제 완료",
    description: "낙찰 후 안전한 결제 시스템으로 거래를 완료하세요",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Truck,
    title: "배송 받기",
    description: "신뢰할 수 있는 배송 서비스로 상품을 받아보세요",
    color: "bg-orange-100 text-orange-600",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">이용 방법</h2>
          <p className="text-xl text-gray-600">간단한 4단계로 경매에 참여하세요</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold text-gray-600">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <SafeLink href="/auth/signup">지금 시작하기</SafeLink>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
