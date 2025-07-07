"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Heart, Zap } from "lucide-react"

interface RecommendationData {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  category: string
  reason: string
  confidence: number
  tags: string[]
}

interface AIRecommendationEngineProps {
  userId?: string
  context: "homepage" | "product" | "category" | "search"
  currentProductId?: string
  categoryId?: string
  searchQuery?: string
}

export default function AIRecommendationEngine({
  userId,
  context,
  currentProductId,
  categoryId,
  searchQuery,
}: AIRecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 모의 AI 추천 데이터
  const mockRecommendations: RecommendationData[] = [
    {
      id: "1",
      title: "iPhone 15 Pro Max 256GB",
      price: 1350000,
      originalPrice: 1500000,
      image: "/placeholder.svg?height=200&width=200&text=iPhone",
      rating: 4.8,
      reviewCount: 124,
      category: "전자제품",
      reason: "최근 스마트폰 검색 기록 기반",
      confidence: 0.92,
      tags: ["인기", "할인", "프리미엄"],
    },
    {
      id: "2",
      title: "MacBook Air M2 13인치",
      price: 1200000,
      image: "/placeholder.svg?height=200&width=200&text=MacBook",
      rating: 4.9,
      reviewCount: 89,
      category: "전자제품",
      reason: "iPhone과 함께 자주 구매되는 상품",
      confidence: 0.87,
      tags: ["연관상품", "고평점"],
    },
    {
      id: "3",
      title: "AirPods Pro 3세대",
      price: 350000,
      originalPrice: 400000,
      image: "/placeholder.svg?height=200&width=200&text=AirPods",
      rating: 4.7,
      reviewCount: 256,
      category: "전자제품",
      reason: "Apple 생태계 완성",
      confidence: 0.85,
      tags: ["할인", "베스트셀러"],
    },
    {
      id: "4",
      title: "Samsung Galaxy Watch 6",
      price: 280000,
      image: "/placeholder.svg?height=200&width=200&text=Watch",
      rating: 4.6,
      reviewCount: 178,
      category: "전자제품",
      reason: "웨어러블 기기 관심 증가",
      confidence: 0.78,
      tags: ["트렌딩", "스마트워치"],
    },
  ]

  useEffect(() => {
    // AI 추천 알고리즘 시뮬레이션
    const generateRecommendations = async () => {
      setIsLoading(true)

      // 컨텍스트별 추천 로직
      let filteredRecommendations = [...mockRecommendations]

      switch (context) {
        case "homepage":
          // 개인화된 추천 (사용자 행동 기반)
          filteredRecommendations = mockRecommendations.sort((a, b) => b.confidence - a.confidence)
          break
        case "product":
          // 연관 상품 추천
          filteredRecommendations = mockRecommendations.filter(
            (item) => item.id !== currentProductId && item.reason.includes("함께"),
          )
          break
        case "category":
          // 카테고리 내 인기 상품
          filteredRecommendations = mockRecommendations
            .filter((item) => item.category === categoryId)
            .sort((a, b) => b.rating - a.rating)
          break
        case "search":
          // 검색 결과 기반 추천
          filteredRecommendations = mockRecommendations.filter((item) =>
            item.title.toLowerCase().includes(searchQuery?.toLowerCase() || ""),
          )
          break
      }

      // 추천 점수 재계산 (사용자 프로필, 시간, 트렌드 등 고려)
      const scoredRecommendations = filteredRecommendations
        .map((item) => ({
          ...item,
          aiScore: calculateAIScore(item, context, userId),
        }))
        .sort((a, b) => b.aiScore - a.aiScore)

      setTimeout(() => {
        setRecommendations(scoredRecommendations.slice(0, 4))
        setIsLoading(false)
      }, 1000) // AI 처리 시간 시뮬레이션
    }

    generateRecommendations()
  }, [context, currentProductId, categoryId, searchQuery, userId])

  const calculateAIScore = (item: RecommendationData, context: string, userId?: string) => {
    let score = item.confidence * 100

    // 컨텍스트별 가중치
    if (context === "homepage") score += 10
    if (context === "product") score += 15

    // 상품 품질 점수
    score += item.rating * 5
    score += Math.min(item.reviewCount / 10, 20)

    // 할인율 보너스
    if (item.originalPrice) {
      const discountRate = (item.originalPrice - item.price) / item.originalPrice
      score += discountRate * 30
    }

    // 태그 보너스
    if (item.tags.includes("인기")) score += 5
    if (item.tags.includes("할인")) score += 8
    if (item.tags.includes("프리미엄")) score += 3

    return Math.round(score)
  }

  const getRecommendationTitle = () => {
    switch (context) {
      case "homepage":
        return "🤖 AI 맞춤 추천"
      case "product":
        return "🔗 함께 보면 좋은 상품"
      case "category":
        return "⭐ 카테고리 인기 상품"
      case "search":
        return "🎯 검색 기반 추천"
      default:
        return "🤖 AI 추천"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-500" />
            {getRecommendationTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-500" />
            {getRecommendationTitle()}
          </div>
          <Badge variant="outline" className="text-xs">
            AI 신뢰도 평균{" "}
            {Math.round(
              (recommendations.reduce((acc, item) => acc + item.confidence, 0) / recommendations.length) * 100,
            )}
            %
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.originalPrice && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    {Math.round((1 - item.price / item.originalPrice) * 100)}% 할인
                  </Badge>
                )}
                <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">{item.title}</h3>

                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {item.rating} ({item.reviewCount})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">₩{item.price.toLocaleString()}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₩{item.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">💡 {item.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
