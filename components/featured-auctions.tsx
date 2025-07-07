"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, Heart, Gavel } from "lucide-react"
import SafeLink from "@/components/SafeLink"

export interface Auction {
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

export interface FeaturedAuctionsProps {
  auctions?: Auction[]
}

/**
 * FeaturedAuctions
 *
 * UI 카드에 인기(또는 최근) 경매를 표시한다.
 * 1. 아무 데이터가 없으면 비어있는 상태 UI 렌더
 * 2. 남은 시간을 1 분마다 갱신 (인터벌은 1 개만 유지)
 * 3. `auctions` prop 은 선택(Optional)-값으로 두어 `undefined` 보호
 */
export default function FeaturedAuctions({ auctions = [] }: FeaturedAuctionsProps) {
  /* ───────────────────────────────────
   * 남은 시간을 경매 ID ➜ 남은시간 문자열 형태로 저장
   * ─────────────────────────────────── */
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({})

  /* `auctions` 가 바뀔 때마다 최신 값을 ref 에 동기화
     → 인터벌(의존성 X)에서 최신 목록을 참조하기 위함 */
  const auctionsRef = useRef<Auction[]>(auctions)
  useEffect(() => {
    auctionsRef.current = auctions
  }, [auctions])

  /* 인터벌은 오직 1 회만 생성 */
  useEffect(() => {
    const calculateLeft = () => {
      const next: Record<string, string> = {}

      auctionsRef.current.forEach((auction) => {
        const now = Date.now()
        const end = new Date(auction.endTime).getTime()
        const diff = end - now

        if (diff > 0) {
          const days = Math.floor(diff / 86_400_000) // 1000*60*60*24
          const hours = Math.floor((diff % 86_400_000) / 3_600_000)
          const mins = Math.floor((diff % 3_600_000) / 60_000)

          next[auction.id] = days > 0 ? `${days}일 ${hours}시간` : hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`
        } else {
          next[auction.id] = "경매 종료"
        }
      })

      // ⚠️ 상태 변화를 줄이기 위해 shallow compare
      setTimeLeft((prev) => {
        const changed =
          Object.keys(prev).length !== Object.keys(next).length || Object.entries(next).some(([k, v]) => prev[k] !== v)

        return changed ? next : prev
      })
    }

    // 최초 1 회 즉시 실행
    calculateLeft()
    const timer = setInterval(calculateLeft, 60_000) // 1 분

    return () => clearInterval(timer)
  }, []) // ← 빈 배열: Mount/Unmount 시점에만 실행

  /* ─────────────── 비어있는 상태 ─────────────── */
  if (!Array.isArray(auctions) || auctions.length === 0) {
    return (
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">진행중인 경매</h2>
          <p className="text-gray-500 mb-6">현재 진행중인 경매가 없습니다.</p>
          <SafeLink href="/sell">
            <Button size="lg">
              <Gavel className="w-4 h-4 mr-2" />첫 경매 등록하기
            </Button>
          </SafeLink>
        </div>
      </section>
    )
  }

  /* ─────────────── 메인 UI ─────────────── */
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">진행중인 경매</h2>
          <SafeLink href="/search">
            <Button variant="outline">전체보기</Button>
          </SafeLink>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {auctions.slice(0, 8).map((auction) => (
            <Card key={auction.id} className="group cursor-pointer transition-shadow hover:shadow-lg">
              <SafeLink href={`/auction/${auction.id}`}>
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={
                      auction.images?.[0] ??
                      ("/placeholder.svg?height=300&width=300&query=auction-item" || "/placeholder.svg")
                    }
                    alt={auction.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </SafeLink>

              <CardContent className="p-4">
                {/* 카테고리/브랜드 뱃지 */}
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {auction.category}
                  </Badge>
                  {auction.brand && (
                    <Badge variant="outline" className="text-xs">
                      {auction.brand}
                    </Badge>
                  )}
                </div>

                {/* 제목 */}
                <SafeLink href={`/auction/${auction.id}`}>
                  <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 transition-colors hover:text-blue-600">
                    {auction.title}
                  </h3>
                </SafeLink>

                {/* 가격/남은시간 */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">현재가</span>
                    <span className="font-bold text-blue-600">{auction.currentBid.toLocaleString()}원</span>
                  </div>

                  {auction.buyNowPrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">즉시구매</span>
                      <span className="font-semibold text-green-600">
                        {Number(auction.buyNowPrice).toLocaleString()}원
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">남은시간</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-red-600">
                      <Clock className="h-3 w-3" />
                      {timeLeft[auction.id] ?? "계산중..."}
                    </span>
                  </div>
                </div>

                {/* 통계 + 배송비 */}
                <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Gavel className="h-3 w-3" />
                      {auction.totalBids}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {auction.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {auction.watchers}
                    </span>
                  </div>
                  <div>{auction.freeShipping ? "무료배송" : `배송비 ${auction.shippingCost}원`}</div>
                </div>

                <SafeLink href={`/auction/${auction.id}`}>
                  <Button size="sm" className="w-full">
                    입찰하기
                  </Button>
                </SafeLink>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 더보기 */}
        {auctions.length > 8 && (
          <div className="mt-8 text-center">
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
