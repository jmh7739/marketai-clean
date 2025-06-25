import React from 'react'
import { Clock, Eye, Heart } from 'lucide-react'

const FeaturedAuctions = () => {
  const auctions = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max 256GB',
      currentPrice: 1200000,
      originalPrice: 1500000,
      timeLeft: '2시간 15분',
      bidCount: 23,
      viewCount: 156,
      image: '/placeholder.svg?height=200&width=200&text=iPhone',
      category: '전자제품',
      seller: 'TechStore',
      rating: 4.8
    },
    {
      id: 2,
      title: '나이키 에어맥스 270',
      currentPrice: 89000,
      originalPrice: 150000,
      timeLeft: '1일 5시간',
      bidCount: 45,
      viewCount: 234,
      image: '/placeholder.svg?height=200&width=200&text=Nike',
      category: '패션',
      seller: 'ShoesWorld',
      rating: 4.9
    },
    {
      id: 3,
      title: 'MacBook Air M2 13인치',
      currentPrice: 1350000,
      originalPrice: 1690000,
      timeLeft: '3시간 42분',
      bidCount: 67,
      viewCount: 445,
      image: '/placeholder.svg?height=200&width=200&text=MacBook',
      category: '전자제품',
      seller: 'AppleStore',
      rating: 5.0
    },
    {
      id: 4,
      title: '샤넬 클래식 플랩백',
      currentPrice: 4500000,
      originalPrice: 6000000,
      timeLeft: '12시간 30분',
      bidCount: 12,
      viewCount: 89,
      image: '/placeholder.svg?height=200&width=200&text=Chanel',
      category: '패션',
      seller: 'LuxuryBag',
      rating: 4.7
    },
    {
      id: 5,
      title: 'LG 올레드 TV 65인치',
      currentPrice: 1800000,
      originalPrice: 2500000,
      timeLeft: '6시간 15분',
      bidCount: 34,
      viewCount: 178,
      image: '/placeholder.svg?height=200&width=200&text=LG+TV',
      category: '전자제품',
      seller: 'ElectronicsHub',
      rating: 4.6
    },
    {
      id: 6,
      title: '다이슨 에어랩 스타일러',
      currentPrice: 450000,
      originalPrice: 650000,
      timeLeft: '8시간 45분',
      bidCount: 28,
      viewCount: 267,
      image: '/placeholder.svg?height=200&width=200&text=Dyson',
      category: '뷰티',
      seller: 'BeautyWorld',
      rating: 4.8
    }
  ]

  return (
    <section className="p-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">🔥 실시간 인기 경매</h2>
            <p className="text-gray-600">지금 가장 핫한 경매 상품들을 확인해보세요</p>
          </div>
          <button className="btn outline">전체보기</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div key={auction.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* 상품 이미지 */}
              <div className="relative">
                <img 
                  src={auction.image || "/placeholder.svg"} 
                  alt={auction.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {auction.category}
                  </span>
                </div>
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* 상품 정보 */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {auction.title}
                </h3>
                
                {/* 가격 정보 */}
                <div className="mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">
                      ₩{auction.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₩{auction.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-red-600 font-medium">
                    {Math.round((1 - auction.currentPrice / auction.originalPrice) * 100)}% 할인
                  </div>
                </div>

                {/* 경매 정보 */}
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

                {/* 판매자 정보 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    판매자: <span className="font-medium">{auction.seller}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600 ml-1">{auction.rating}</span>
                  </div>
                </div>

                {/* 버튼 */}
                <div className="flex space-x-2">
                  <button className="flex-1 btn primary">입찰하기</button>
                  <button className="flex-1 btn outline">즉시구매</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedAuctions