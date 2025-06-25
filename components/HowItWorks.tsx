import { Upload, Search, Gavel, Package } from "lucide-react"

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "상품 등록",
      description: "사진만 올려도 AI가 자동으로 상품 정보를 분석해드려요",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Search,
      title: "상품 검색",
      description: "원하는 상품을 쉽고 빠르게 찾아보세요",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Gavel,
      title: "경매 참여",
      description: "실시간으로 입찰하고 원하는 가격에 구매하세요",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Package,
      title: "안전 거래",
      description: "안전결제 시스템으로 믿을 수 있는 거래를 보장합니다",
      color: "bg-orange-100 text-orange-600",
    },
  ]

  return (
    <div className="px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">MarketAI 이용방법</h2>
          <p className="text-gray-600 text-lg">간단한 4단계로 스마트한 경매를 경험해보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
