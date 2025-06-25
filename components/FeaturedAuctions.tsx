import { Clock, Eye, Heart } from "lucide-react"

const FeaturedAuctions = () => {
  // 실제 데이터는 props로 받거나 API에서 가져올 예정
  const auctions = []

  if (auctions.length === 0) {
    return (
      <div className="px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">🔥 실시간 인기 경매</h2>
              <p className="text-gray-600">지금 가장 핫한 경매 상품들을 확인해보세요</p>
            </div>
          </div>

          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">진행 중인 인기 경매가 없습니다</h3>
            <p className="text-gray-600">새로운 경매가 시작되면 여기에 표시됩니다</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">🔥 실시간 인기 경매</h2>
            <p className="text-gray-600">지금 가장 핫한 경매 상품들을 확인해보세요</p>
          </div>
          <button className="btn outline">전체보기</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={auction.image || "/placeholder.svg"}
                  alt={auction.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">{auction.category}</span>
                </div>
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{auction.title}</h3>

                <div className="mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">₩{auction.currentPrice.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 line-through">
                      ₩{auction.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-red-600 font-medium">
                    {Math.round((1 - auction.currentPrice / auction.originalPrice) * 100)}% 할인
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{auction.timeLeft} 남음</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span>입찰 {auction.bidCount}회</span>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{auction.viewCount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 btn primary">입찰하기</button>
                  <button className="flex-1 btn outline">즉시구매</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturedAuctions
