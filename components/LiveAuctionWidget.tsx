"use client"

import { useState, useEffect } from "react"
import { Gavel } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const LiveAuctionWidget = () => {
  const [liveAuctions, setLiveAuctions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제 실시간 경매 데이터 로드
    const loadLiveAuctions = async () => {
      try {
        // 실제로는 Firestore에서 실시간 경매 데이터를 가져올 예정
        const auctions = []
        setLiveAuctions(auctions)
      } catch (error) {
        console.error("실시간 경매 로드 실패:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLiveAuctions()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          실시간 경매
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : liveAuctions.length > 0 ? (
          <div className="space-y-4">
            {liveAuctions.map((auction) => (
              <div key={auction.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* 실제 경매 데이터 표시 */}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Gavel className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-semibold mb-2">진행 중인 실시간 경매가 없습니다</h3>
            <p className="text-gray-600 text-sm mb-4">새로운 경매가 시작되면 알려드릴게요</p>
          </div>
        )}

        <div className="mt-4 text-center">
          <Link href="/live-auctions">
            <Button variant="outline" className="w-full">
              모든 실시간 경매 보기
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default LiveAuctionWidget
