import React from 'react'
import { Clock, Eye, Heart, User } from 'lucide-react'

const PersonalizedRecommendations = () => {
  const recommendations = [
    {
      id: 1,
      title: '당신이 관심있어할 만한 상품',
      subtitle: '최근 본 상품과 유사한 아이템들',
      items: [
        {
          id: 1,
          title: 'iPad Pro 11인치 M2',
          currentPrice: 950000,
          originalPrice: 1200000,
          timeLeft: '4시간 30분',
          bidCount: 18,
          viewCount: 89,
          image: '/placeholder.svg?height=150&width=150&text=iPad',
          category: '전자제품',
          seller: 'TechStore',
          rating: 4.9
        },
        {
          id: 2,
          title: '삼성 갤럭시 워치 6',
          currentPrice: 280000,
          originalPrice: 350000,
          timeLeft: '2일 12시간',
          bidCount: 25,
          viewCount: 156,
          image: '/placeholder.svg?height=150&width=150&text=Watch',
          category: '전자제품',
          seller: 'WatchWorld',
          rating: 4.7
        },
        {
          id: 3,
          title: 'AirPods Pro 2세대',
          currentPrice: 220000,
          originalPrice: 350000,
          timeLeft: '1일 8시간',
          bidCount: 42,
          viewCount: 203,
          image: '/placeholder.svg?height=150&width=150&text=AirPods',
          category: '전자제품',
          seller: 'AudioShop',
          rating: 4.8
        }
      ]
    },
    {
      id: 2,
      title: '판매 이력 기반 추천',
      subtitle: '이전에 판매하신 상품과 관련된 아이템들',
      items: [
        {
          id: 4,
          title: '캐논 EOS R6 Mark II',
          currentPrice: 2800000,
          originalPrice: 3500000,
          timeLeft: '5시간 45분',
          bidCount: 8,
          viewCount: 67,
          image: '/placeholder.svg?height=150&width=150&text=Camera',
          category: '전자제품',
          seller: 'CameraShop',
          rating: 4.9
        },
        {
          id: 5,
          title: '소니 FX3 시네마 카메라',
          currentPrice: 3200000,
          originalPrice: 4200000,
          timeLeft: '3일 2시간',
          bidCount: 12,
          viewCount: 134,
          image: '/placeholder.svg?height=150&width=150&text=Sony',
          category: '전자제품',
          seller: 'ProVideo',
          rating: 5.0
        }
      ]
    }
  ]

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
              {section.items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* 상품 이미지 */}
                  <div className="relative">
                    <img 
                      src={item.image || "/placeholder.svg"} 
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* 상품 정보 */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    {/* 가격 정보 */}
                    <div className="mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-blue-600">
                          ₩{item.currentPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₩{item.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-red-600 font-medium">
                        {Math.round((1 - item.currentPrice / item.originalPrice) * 100)}% 할인
                      </div>
                    </div>

                    {/* 경매 정보 */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{item.timeLeft} 남음</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span>입찰 {item.bidCount}회</span>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{item.viewCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* 판매자 정보 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-600">
                        판매자: <span className="font-medium">{item.seller}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
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
        </div>
      ))}
    </div>
  )
}

export default PersonalizedRecommendations
