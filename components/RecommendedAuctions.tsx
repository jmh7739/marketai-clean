"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Clock } from "lucide-react"
import { getActiveAuctions, formatCurrency, formatTimeRemaining, type StoredAuction } from "@/lib/utils"

export function RecommendedAuctions() {
  const [auctions, setAuctions] = useState<StoredAuction[]>([])

  useEffect(() => {
    setAuctions(getActiveAuctions(8))
  }, [])

  if (auctions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>추천 경매</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>추천할 경매가 없습니다.</p>
            <p className="text-sm mt-2">더 많은 경매가 등록되면 추천해드릴게요!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5" />
          <span>추천 경매</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {auctions.map((auction) => (
            <Link key={auction.id} href={`/auction/${auction.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <img
                    src={
                      auction.images?.[0] ??
                      ("/placeholder.svg?height=200&width=200&query=recommended+auction" || "/placeholder.svg")
                    }
                    alt={auction.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-green-500">진행중</Badge>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{auction.title}</h3>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-blue-600">{formatCurrency(auction.currentBid)}</div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeRemaining(auction.endTime)}
                    </div>
                    <div className="text-xs text-gray-400">
                      입찰 {(auction.bids?.length ?? 0).toLocaleString()}회 · 관심{" "}
                      {(auction.watchers ?? 0).toLocaleString()}명
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecommendedAuctions
