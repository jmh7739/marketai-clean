"use client"

import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, Upload, Gavel, CreditCard } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "회원가입",
    description: "간단한 회원가입으로 MarketAI에 참여하세요",
    color: "bg-blue-500",
  },
  {
    icon: Upload,
    title: "상품 등록",
    description: "판매하고 싶은 상품을 사진과 함께 등록하세요",
    color: "bg-green-500",
  },
  {
    icon: Gavel,
    title: "경매 참여",
    description: "원하는 상품에 입찰하거나 경매를 진행하세요",
    color: "bg-purple-500",
  },
  {
    icon: CreditCard,
    title: "안전한 거래",
    description: "에스크로 시스템으로 안전하게 거래를 완료하세요",
    color: "bg-orange-500",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">이용 방법</h2>
          <p className="text-gray-600 mt-4">MarketAI에서 경매하는 방법을 알아보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="mb-2 text-sm font-semibold text-gray-500">STEP {index + 1}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
