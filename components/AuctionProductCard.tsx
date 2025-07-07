"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Clock, Users, Eye } from "lucide-react"
import Link from "next/link"

interface AuctionProduct {
  id: string
  title: string
  description: string
  images: string[]
  currentBid: number
  buyNowPrice?: number
  endTime: Date
  totalBids: number
  watchers: number
  location: string
  condition: string
  category: string
}

interface AuctionProductCardProps {
  product: AuctionProduct
  onWatchToggle: (productId: string) => void
}

export default function AuctionProductCard({ product, onWatchToggle }: AuctionProductCardProps) {
  const [isWatched, setIsWatched] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleWatchToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWatched(!isWatched)
    onWatchToggle(product.id)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price)
  }

  const getTimeRemaining = () => {
    const now = new Date()
    const end = new Date(product.endTime)
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return "경매 종료"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}일 ${hours}시간`
    if (hours > 0) return `${hours}시간 ${minutes}분`
    return `${minutes}분`
  }

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-300">
        <div className="relative">
          {/* 상품 이미지 */}
          <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
            {!imageError ? (
              <img
                src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-400">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Eye className="w-8 h-8" />
                  </div>
                  <p className="text-sm">이미지 없음</p>
                </div>
              </div>
            )}
          </div>

          {/* 찜하기 버튼 */}
          <button
            onClick={handleWatchToggle}
            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
          >
            <Heart className={`w-4 h-4 ${isWatched ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>

          {/* 상태 배지 */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              {product.condition}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* 상품 제목 */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          {/* 현재 입찰가 */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-600">{formatPrice(product.currentBid)}</span>
              {product.buyNowPrice && (
                <span className="text-sm text-gray-500 line-through">{formatPrice(product.buyNowPrice)}</span>
              )}
            </div>
          </div>

          {/* 경매 정보 */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{product.totalBids}회 입찰</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{product.watchers}명 관심</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-orange-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{getTimeRemaining()}</span>
            </div>
          </div>

          {/* 위치 정보 */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">{product.location}</p>
          </div>

          {/* 입찰 버튼 */}
          <div className="mt-4">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // 입찰 페이지로 이동
                window.location.href = `/product/${product.id}#bid`
              }}
            >
              입찰하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
