"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BidSystem } from "@/components/BidSystem"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useAuctionStore } from "@/stores/auction-store"
import { formatCurrency } from "@/lib/fee-calculator"
import { Clock, MapPin, Truck, Shield, Eye, Heart, Share2, Flag, User, Star } from "lucide-react"

export default function AuctionDetailPage() {
  const params = useParams()
  const auctionId = params.id as string
  const { currentAuction, loading, error, fetchAuctionById, subscribeToAuctionBids } = useAuctionStore()
  const [timeLeft, setTimeLeft] = useState("")
  const [isWatched, setIsWatched] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 임시 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
  const userId = "temp-user-id"

  useEffect(() => {
    if (auctionId) {
      fetchAuctionById(auctionId)

      // 실시간 입찰 구독
      const unsubscribe = subscribeToAuctionBids(auctionId)
      return unsubscribe
    }
  }, [auctionId, fetchAuctionById, subscribeToAuctionBids])

  useEffect(() => {
    if (!currentAuction) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const endTime = new Date(currentAuction.end_time).getTime()
      const difference = endTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        if (days > 0) {
          setTimeLeft(`${days}일 ${hours}시간 ${minutes}분`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}시간 ${minutes}분 ${seconds}초`)
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}분 ${seconds}초`)
        } else {
          setTimeLeft(`${seconds}초`)
        }
      } else {
        setTimeLeft("경매 종료")
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [currentAuction])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !currentAuction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">경매를 찾을 수 없습니다</h2>
          <p className="text-gray-600">{error || "존재하지 않는 경매입니다."}</p>
        </div>
      </div>
    )
  }

  const isEnded = new Date(currentAuction.end_time) <= new Date()
  const minimumBid = currentAuction.current_price + 1000

  const getConditionText = (condition: string) => {
    const conditionMap = {
      new: "새상품",
      like_new: "거의새것",
      good: "좋음",
      fair: "보통",
      poor: "나쁨",
    }
    return conditionMap[condition as keyof typeof conditionMap] || "알 수 없음"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 이미지 및 상품 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 이미지 갤러리 */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={currentAuction.images[currentImageIndex] || "/placeholder.svg?height=600&width=600"}
                    alt={currentAuction.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 이미지 썸네일 */}
                {currentAuction.images.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex space-x-2 overflow-x-auto">
                      {currentAuction.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                            index === currentImageIndex ? "border-blue-500" : "border-gray-200"
                          }`}
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`${currentAuction.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 상품 상세 정보 */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{currentAuction.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant="outline">{getConditionText(currentAuction.condition)}</Badge>
                      {currentAuction.category && <Badge variant="secondary">{currentAuction.category.name}</Badge>}
                      {isEnded ? (
                        <Badge variant="destructive">경매 종료</Badge>
                      ) : (
                        <Badge variant="default">진행중</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Heart className={`h-4 w-4 ${isWatched ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* 경매 정보 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">시작가</span>
                    <p className="font-semibold">{formatCurrency(currentAuction.starting_price)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">현재가</span>
                    <p className="font-bold text-xl text-blue-600">{formatCurrency(currentAuction.current_price)}</p>
                  </div>
                  {currentAuction.buy_now_price && (
                    <div>
                      <span className="text-sm text-gray-600">즉시구매가</span>
                      <p className="font-semibold text-green-600">{formatCurrency(currentAuction.buy_now_price)}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-600">입찰 수</span>
                    <p className="font-semibold">{currentAuction.total_bids}회</p>
                  </div>
                </div>

                <Separator />

                {/* 상품 설명 */}
                <div>
                  <h3 className="font-semibold mb-3">상품 설명</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{currentAuction.description}</p>
                  </div>
                </div>

                <Separator />

                {/* 배송 정보 */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    배송 정보
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">배송비</span>
                      <span>
                        {currentAuction.shipping_cost === 0 ? "무료배송" : formatCurrency(currentAuction.shipping_cost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">배송방법</span>
                      <span>{currentAuction.shipping_method}</span>
                    </div>
                    {currentAuction.location && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">발송지</span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {currentAuction.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 판매자 정보 */}
            {currentAuction.seller && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    판매자 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        {currentAuction.seller.profile_image ? (
                          <img
                            src={currentAuction.seller.profile_image || "/placeholder.svg"}
                            alt={currentAuction.seller.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{currentAuction.seller.nickname || currentAuction.seller.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span>{currentAuction.seller.rating.toFixed(1)}</span>
                          </div>
                          <span>•</span>
                          <span>판매 {currentAuction.seller.total_sales}회</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      판매자 상점
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 오른쪽: 입찰 시스템 */}
          <div className="space-y-6">
            {/* 남은 시간 */}
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2">남은 시간</h3>
                <p className={`text-2xl font-bold ${isEnded ? "text-red-600" : "text-blue-600"}`}>{timeLeft}</p>
                {!isEnded && (
                  <p className="text-sm text-gray-600 mt-2">
                    {new Date(currentAuction.end_time).toLocaleString("ko-KR")} 종료
                  </p>
                )}
              </CardContent>
            </Card>

            {/* 입찰 시스템 */}
            <BidSystem
              auctionId={currentAuction.id}
              currentPrice={currentAuction.current_price}
              minimumBid={minimumBid}
              buyNowPrice={currentAuction.buy_now_price}
              userId={userId}
              isEnded={isEnded}
            />

            {/* 안전 거래 안내 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-semibold">안전 거래 보장</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 에스크로 결제 시스템</li>
                  <li>• 상품 확인 후 결제 완료</li>
                  <li>• 분쟁 시 중재 서비스</li>
                  <li>• 가짜 상품 100% 환불</li>
                </ul>
              </CardContent>
            </Card>

            {/* 조회수 정보 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>조회 {currentAuction.view_count}회</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>관심 {currentAuction.watch_count}명</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
