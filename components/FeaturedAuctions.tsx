"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, Heart } from "lucide-react"
import SafeLink from "@/components/SafeLink"

interface FeaturedAuction {
  id: string
  title: string
  currentBid: number
  buyNowPrice?: number
  bidCount: number
  timeLeft: string
  image: string
  category: string
  isHot: boolean
}

const featuredAuctions: FeaturedAuction[] = [
  {
    id: "1",
    title: "아이폰 14 Pro 256GB 딥퍼플",
    currentBid: 850000,
    buyNowPrice: 1200000,
    bidCount: 23,
    timeLeft: "2시간 15분",
    image: "/placeholder.svg?height=200&width=300&text=iPhone+14+Pro",
    category: "전자기기",
    isHot: true,
  },
  {
    id: "2",
    title: "맥북 에어 M2 13인치 실버",
    currentBid: 1100000,
    buyNowPrice: 1500000,
    bidCount: 18,
    timeLeft: "1일 5시간",
    image: "/placeholder.svg?height=200&width=300&text=MacBook+Air+M2",
    category: "컴퓨터",
    isHot: false,
  },
  {
    id: "3",
    title: "에어팟 프로 2세대",
    currentBid: 180000,
    buyNowPrice: 250000,
    bidCount: 12,
    timeLeft: "3시간 42분",
    image: "/placeholder.svg?height=200&width=300&text=AirPods+Pro+2",
    category: "오디오",
    isHot: true,
  },
  {
    id: "4",
    title: "삼성 갤럭시 S23 Ultra",
    currentBid: 720000,
    buyNowPrice: 950000,
    bidCount: 31,
    timeLeft: "6시간 18분",
    image: "/placeholder.svg?height=200&width=300&text=Galaxy+S23+Ultra",
    category: "전자기기",
    isHot: false,
  },
]

export function FeaturedAuctions() {
  const [auctions, setAuctions] = useState<FeaturedAuction[]>([])

  useEffect(() => {
    setAuctions(featuredAuctions)
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">인기 경매</h2>
          <p className="text-xl text-gray-600">지금 가장 인기 있는 경매 상품들을 확인해보세요</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {auctions.map((auction) => (
            <Card key={auction.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={auction.image || "/placeholder.svg"}
                  alt={auction.title}
                  className="w-full h-48 object-cover"
                />
                {auction.isHot && <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">🔥 HOT</Badge>}
                <Button variant="ghost" size="sm" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <CardContent className="p-4">
                <Badge variant="secondary" className="text-xs mb-2">
                  {auction.category}
                </Badge>

                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{auction.title}</h3>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">현재가</span>
                    <span className="font-bold text-blue-600">{auction.currentBid.toLocaleString()}원</span>
                  </div>
                  {auction.buyNowPrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">즉시구매</span>
                      <span className="text-sm text-gray-700">{auction.buyNowPrice.toLocaleString()}원</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {auction.bidCount}회 입찰
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {auction.timeLeft}
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

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <SafeLink href="/live-auctions">더 많은 경매 보기</SafeLink>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedAuctions
