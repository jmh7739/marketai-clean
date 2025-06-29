"use client"

import { useEffect } from "react"
import { Hero } from "@/components/Hero"
import { RealTimeAuctionCard } from "@/components/RealTimeAuctionCard"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useAuctionStore } from "@/stores/auction-store"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function HomePage() {
  const { auctions, loading, error, fetchAuctions, subscribeToAuctions } = useAuctionStore()

  useEffect(() => {
    // 초기 데이터 로드
    fetchAuctions()

    // 실시간 구독 시작
    const unsubscribe = subscribeToAuctions()

    return unsubscribe
  }, [fetchAuctions, subscribeToAuctions])

  const handleRefresh = () => {
    fetchAuctions()
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">실시간 경매</h2>
              <p className="text-gray-600">지금 진행중인 인기 경매를 확인하세요</p>
            </div>
            <Button onClick={handleRefresh} variant="outline" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              새로고침
            </Button>
          </div>

          {loading && auctions.length === 0 ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : auctions.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">진행중인 경매가 없습니다</h3>
                <p className="text-gray-600 mb-4">첫 번째 경매를 시작해보세요!</p>
                <Button asChild>
                  <a href="/sell">경매 등록하기</a>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {auctions.map((auction) => (
                  <RealTimeAuctionCard key={auction.id} auction={auction} />
                ))}
              </div>

              {auctions.length > 0 && (
                <div className="text-center mt-8">
                  <p className="text-gray-600 mb-4">총 {auctions.length}개의 경매가 진행중입니다</p>
                  <Button variant="outline" asChild>
                    <a href="/search">더 많은 경매 보기</a>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
