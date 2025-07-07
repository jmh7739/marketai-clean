"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Clock } from "lucide-react"
import { getPopularAuctions, formatCurrency, formatTimeRemaining, type StoredAuction } from "@/lib/utils"

export function PopularAuctions() {
  const [auctions, setAuctions] = useState<StoredAuction[]>([])

  useEffect(() => {
    setAuctions(getPopularAuctions(6))
  }, [])

  if (auctions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>인기 경매</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>진행중인 경매가 없습니다.</p>
            <p className="text-sm mt-2">첫 번째 경매를 등록해보세요!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>인기 경매</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {auctions.map((auction) => (
            <Link key={auction.id} href={`/auction/${auction.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <img
                    src={
                      auction.images?.[0] ??
                      ("/placeholder.svg?height=200&width=200&query=auction" || "/placeholder.svg")
                    }
                    alt={auction.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                    <Eye className="h-3 w-3 mr-1" />
                    {auction.views ?? auction.view_count ?? 0}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{auction.title}</h3>
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-blue-600">{formatCurrency(auction.currentBid)}</div>
                    <div className="flex items-center text-sm text-gray-500">
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

export default PopularAuctions
