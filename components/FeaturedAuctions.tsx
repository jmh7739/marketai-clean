"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Eye, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAuctions, formatPrice, getTimeRemaining } from "@/lib/utils"
import type { Auction } from "@/types"

export default function FeaturedAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAuctions = () => {
      const allAuctions = getAuctions()
      const activeAuctions = allAuctions
        .filter((auction) => auction.status === "active")
        .sort((a, b) => b.bidCount - a.bidCount)
        .slice(0, 8)

      setAuctions(activeAuctions)
      setLoading(false)
    }

    loadAuctions()

    // Listen for storage changes
    const handleStorageChange = () => {
      loadAuctions()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">인기 경매</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (auctions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">인기 경매</h2>
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Clock className="h-16 w-16 mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">진행중인 경매가 없습니다</h3>
          <p className="text-gray-600 mb-6">첫 번째 경매를 등록해보세요!</p>
          <Button asChild>
            <Link href="/sell">경매 등록하기</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">인기 경매</h2>
        <Button variant="outline" asChild>
          <Link href="/live-auctions">모든 경매 보기</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {auctions.map((auction) => (
          <Card key={auction.id} className="group hover:shadow-lg transition-shadow">
            <Link href={`/product/${auction.id}`}>
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <Image
                  src={auction.images[0] || "/placeholder.svg?height=300&width=300"}
                  alt={auction.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90">
                    {getTimeRemaining(auction.endTime)}
                  </Badge>
                </div>
              </div>
            </Link>

            <CardContent className="p-4">
              <Link href={`/product/${auction.id}`}>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                  {auction.title}
                </h3>
              </Link>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">현재가</span>
                  <span className="font-bold text-lg text-blue-600">{formatPrice(auction.currentPrice)}</span>
                </div>

                {auction.buyNowPrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">즉시구매</span>
                    <span className="font-semibold text-gray-900">{formatPrice(auction.buyNowPrice)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{auction.watchers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{auction.bidCount}회 입찰</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
