"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Eye, Gavel, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAuctions, formatPrice, getTimeRemaining } from "@/lib/utils"
import type { Auction } from "@/types"

export default function FeaturedAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    const loadAuctions = () => {
      const allAuctions = getAuctions()
      // 활성 경매 중 입찰이 많은 순으로 정렬하여 상위 8개 선택
      const featuredAuctions = allAuctions
        .filter((auction) => auction.status === "active")
        .sort((a, b) => b.bidCount - a.bidCount)
        .slice(0, 8)

      setAuctions(featuredAuctions)
    }

    loadAuctions()

    // 실시간 업데이트
    const interval = setInterval(loadAuctions, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const updateTimeRemaining = () => {
      const newTimeRemaining: { [key: string]: any } = {}
      auctions.forEach((auction) => {
        newTimeRemaining[auction.id] = getTimeRemaining(auction.endTime)
      })
      setTimeRemaining(newTimeRemaining)
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [auctions])

  if (auctions.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 경매</h2>
            <p className="text-gray-600 mb-8">현재 진행중인 경매가 없습니다.</p>
            <Button asChild>
              <Link href="/sell">첫 번째 경매 시작하기</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 경매</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">AI가 분석한 인기 경매와 맞춤형 추천 상품을 확인해보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {auctions.map((auction) => {
            const timeLeft = timeRemaining[auction.id]
            const isEndingSoon = timeLeft && timeLeft.total > 0 && timeLeft.total < 24 * 60 * 60 * 1000

            return (
              <Card key={auction.id} className="group hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <Image
                      src={
                        auction.images[0] ||
                        `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(auction.title)}`
                      }
                      alt={auction.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="absolute top-2 left-2 flex gap-2">
                    {isEndingSoon && (
                      <Badge variant="destructive" className="text-xs">
                        마감임박
                      </Badge>
                    )}
                    {auction.bidCount > 10 && <Badge className="bg-orange-500 text-xs">인기</Badge>}
                  </div>

                  <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <CardContent className="p-4">
                  <Link href={`/auction/${auction.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {auction.title}
                    </h3>
                  </Link>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">현재가</span>
                      <span className="font-bold text-lg text-blue-600">{formatPrice(auction.currentPrice)}</span>
                    </div>

                    {auction.buyNowPrice && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">즉시구매가</span>
                        <span className="text-sm text-gray-700">{formatPrice(auction.buyNowPrice)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Gavel className="w-4 h-4" />
                      <span>{auction.bidCount}회 입찰</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{auction.watchers}명 관심</span>
                    </div>
                  </div>

                  {timeLeft && timeLeft.total > 0 && (
                    <div className="flex items-center gap-1 text-sm mb-4">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className={isEndingSoon ? "text-red-600 font-medium" : "text-gray-600"}>
                        {timeLeft.days > 0 && `${timeLeft.days}일 `}
                        {timeLeft.hours.toString().padStart(2, "0")}:{timeLeft.minutes.toString().padStart(2, "0")}:
                        {timeLeft.seconds.toString().padStart(2, "0")} 남음
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button asChild className="flex-1" size="sm">
                      <Link href={`/auction/${auction.id}`}>입찰하기</Link>
                    </Button>
                    {auction.buyNowPrice && (
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        즉시구매
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/live-auctions">모든 경매 보기</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
