"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Eye, Clock, Gavel } from "lucide-react"
import { formatCurrency } from "@/lib/fee-calculator"
import type { Auction } from "@/lib/supabase"
import Link from "next/link"

interface RealTimeAuctionCardProps {
  auction: Auction
}

export function RealTimeAuctionCard({ auction }: RealTimeAuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState("")
  const [isWatched, setIsWatched] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const endTime = new Date(auction.end_time).getTime()
      const difference = endTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        if (days > 0) {
          setTimeLeft(`${days}일 ${hours}시간`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}시간 ${minutes}분`)
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
  }, [auction.end_time])

  const handleWatchToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWatched(!isWatched)
    // TODO: API 호출로 관심목록 추가/제거
  }

  const getConditionBadge = (condition: string) => {
    const conditionMap = {
      new: { label: "새상품", variant: "default" as const },
      like_new: { label: "거의새것", variant: "secondary" as const },
      good: { label: "좋음", variant: "outline" as const },
      fair: { label: "보통", variant: "outline" as const },
      poor: { label: "나쁨", variant: "destructive" as const },
    }
    return conditionMap[condition as keyof typeof conditionMap] || conditionMap.good
  }

  const conditionInfo = getConditionBadge(auction.condition)

  return (
    <Link href={`/auction/${auction.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
        <div className="relative">
          <div className="aspect-square overflow-hidden rounded-t-lg">
            <img
              src={auction.images[0] || "/placeholder.svg?height=300&width=300"}
              alt={auction.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* 상태 배지 */}
          <div className="absolute top-2 left-2">
            <Badge variant={conditionInfo.variant} className="text-xs">
              {conditionInfo.label}
            </Badge>
          </div>

          {/* 관심목록 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
            onClick={handleWatchToggle}
          >
            <Heart className={`h-4 w-4 ${isWatched ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>

          {/* 시간 남은 표시 */}
          <div className="absolute bottom-2 left-2">
            <Badge variant="destructive" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {timeLeft}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {auction.title}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">현재가</span>
              <span className="font-bold text-lg text-blue-600">{formatCurrency(auction.current_price)}</span>
            </div>

            {auction.buy_now_price && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">즉시구매가</span>
                <span className="font-medium text-gray-900">{formatCurrency(auction.buy_now_price)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Gavel className="h-4 w-4 mr-1" />
                <span>{auction.total_bids}회</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{auction.view_count}</span>
              </div>
            </div>

            {auction.seller && (
              <div className="flex items-center">
                <span className="text-xs">판매자: {auction.seller.nickname || auction.seller.name}</span>
                <div className="ml-1 flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="text-xs ml-1">{auction.seller.rating.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full bg-transparent" variant="outline">
            <Gavel className="h-4 w-4 mr-2" />
            입찰하기
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
