"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, Heart, Gavel } from "lucide-react"
import SafeLink from "@/components/SafeLink"

interface Auction {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  brand?: string
  condition: string
  images: string[]
  currentBid: number
  startingPrice: number
  buyNowPrice?: string
  totalBids: number
  endTime: string
  sellerId: string
  sellerName: string
  status: string
  watchers: number
  views: number
  shippingCost: string
  freeShipping: boolean
  localPickup: boolean
}

interface FeaturedAuctionsProps {
  auctions: Auction[]
}

export function FeaturedAuctions({ auctions }: FeaturedAuctionsProps) {
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({})

  // 남은 시간 계산
  useEffect(() => {
    const updateTimeLeft = () => {
      const newTimeLeft: Record<string, string> = {}

      auctions.forEach((auction) => {
        const now = new Date().getTime()
        const endTime = new Date(auction.endTime).getTime()
        const difference = endTime - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

          if (days > 0) {
            newTimeLeft[auction.id] = `${days}일 ${hours}시간`
          } else if (hours > 0) {
            newTimeLeft[auction.id] = `${hours}시간 ${minutes}분`
          } else {
            newTimeLeft[auction.id] = `${minutes}분`
          }
        } else {
          newTimeLeft[auction.id] = "경매 종료"
        }
      })

      setTimeLeft(newTimeLeft)
    }

    updateTimeLeft()
    const timer = setInterval(updateTimeLeft, 60000) // 1분마다 업데이트

    return () => clearInterval(timer)
  }, [auctions])

  if (auctions.length === 0) {
    return (
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">진행중인 경매</h2>
            <div className="bg-gray-100 rounded-lg p-12">
              <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">아직 진행중인 경매가 없습니다</h3>
              <p className="text-gray-500 mb-6">첫 번째 경매를 등록하고 MarketAI를 시작해보세요!</p>
              <SafeLink href="/sell">
                <Button size="lg">
                  <Gavel className="w-4 h-4 mr-2" />첫 경매 등록하기
                </Button>
              </SafeLink>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">진행중인 경매</h2>
          <SafeLink href="/search">
            <Button variant="outline">전체보기</Button>
          </SafeLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {auctions.slice(0, 8).map((auction) => (
            <Card key={auction.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <SafeLink href={`/auction/${auction.id}`}>
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={auction.images[0] || "/placeholder.svg?height=300&width=300"}
                    alt={auction.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </SafeLink>

              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {auction.category}
                  </Badge>
                  {auction.brand && (
                    <Badge variant="outline" className="text-xs">
                      {auction.brand}
                    </Badge>
                  )}
                </div>

                <SafeLink href={`/auction/${auction.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {auction.title}
                  </h3>
                </SafeLink>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">현재가</span>
                    <span className="font-bold text-blue-600">{auction.currentBid.toLocaleString()}원</span>
                  </div>

                  {auction.buyNowPrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">즉시구매</span>
                      <span className="font-semibold text-green-600">
                        {Number.parseFloat(auction.buyNowPrice).toLocaleString()}원
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">남은시간</span>
                    <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeLeft[auction.id] || "계산중..."}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Gavel className="w-3 h-3" />
                      {auction.totalBids}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {auction.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {auction.watchers}
                    </span>
                  </div>
                  <div className="text-right">
                    <div>{auction.freeShipping ? "무료배송" : `배송비 ${auction.shippingCost}원`}</div>
                  </div>
                </div>

                <SafeLink href={`/auction/${auction.id}`}>
                  <Button className="w-full" size="sm">
                    입찰하기
                  </Button>
                </SafeLink>
              </CardContent>
            </Card>
          ))}
        </div>

        {auctions.length > 8 && (
          <div className="text-center mt-8">
            <SafeLink href="/search">
              <Button variant="outline" size="lg">
                더 많은 경매 보기 ({auctions.length - 8}개 더)
              </Button>
            </SafeLink>
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedAuctions
