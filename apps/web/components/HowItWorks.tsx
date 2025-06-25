import React from 'react'

const HowItWorks = () => {
  const steps = [
    { title: '회원가입', description: '간단한 회원가입으로 시작하세요' },
    { title: '상품 탐색', description: 'AI 추천으로 원하는 상품을 찾아보세요' },
    { title: '입찰 참여', description: '실시간 경매에 참여하세요' },
    { title: '안전 거래', description: '안전한 결제 시스템으로 거래하세요' },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">이용 방법</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks