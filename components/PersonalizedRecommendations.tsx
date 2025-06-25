import { User } from "lucide-react"

const PersonalizedRecommendations = () => {
  // 실제 추천 데이터는 props로 받거나 API에서 가져올 예정
  const recommendations = []

  if (recommendations.length === 0) {
    return (
      <div className="px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                맞춤 추천
              </h2>
              <p className="text-gray-600">당신의 관심사에 맞는 상품을 추천해드립니다</p>
            </div>
          </div>

          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">맞춤 추천을 준비 중입니다</h3>
            <p className="text-gray-600">상품을 둘러보시면 개인화된 추천을 제공해드릴게요</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4">
      {recommendations.map((section) => (
        <div key={section.id} className="mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  {section.title}
                </h2>
                <p className="text-gray-600">{section.subtitle}</p>
              </div>
              <button className="btn outline">더보기</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 실제 추천 상품들이 여기에 표시됩니다 */}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PersonalizedRecommendations
