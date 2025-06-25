"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Clock, Gavel, TrendingUp, Users, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"

interface AuctionData {
  id: string
  title: string
  currentBid: number
  minBidIncrement: number
  endTime: Date
  totalBids: number
  highestBidder?: string
  isActive: boolean
}

interface BidHistoryItem {
  id: string
  bidder: string
  amount: number
  timestamp: Date
  isWinning: boolean
}

export default function RealAuctionSystem({ auctionId }: { auctionId: string }) {
  const [auction, setAuction] = useState<AuctionData>({
    id: auctionId,
    title: "iPhone 15 Pro Max 256GB 자연 티타늄",
    currentBid: 1200000,
    minBidIncrement: 10000,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2시간 후
    totalBids: 23,
    highestBidder: "user_***",
    isActive: true,
  })

  const [bidAmount, setBidAmount] = useState("")
  const [bidHistory, setBidHistory] = useState<BidHistoryItem[]>([
    {
      id: "1",
      bidder: "user_***",
      amount: 1200000,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isWinning: true,
    },
    {
      id: "2",
      bidder: "buyer_***",
      amount: 1190000,
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isWinning: false,
    },
    {
      id: "3",
      bidder: "market_***",
      amount: 1180000,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isWinning: false,
    },
  ])

  const [timeLeft, setTimeLeft] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [bidError, setBidError] = useState("")
  const [bidSuccess, setBidSuccess] = useState("")
  const [isWatching, setIsWatching] = useState(false)

  const { user, isAuthenticated } = useAuth()

  // 타이머 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const diff = auction.endTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft("경매 종료")
        setAuction((prev) => ({ ...prev, isActive: false }))
        clearInterval(timer)
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${hours}시간 ${minutes}분 ${seconds}초`)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [auction.endTime])

  // 실시간 입찰 시뮬레이션
  useEffect(() => {
    if (!auction.isActive) return

    const interval = setInterval(() => {
      // 30% 확률로 새로운 입찰 발생
      if (Math.random() < 0.3) {
        const newBid = auction.currentBid + auction.minBidIncrement + Math.floor(Math.random() * 50000)
        const bidders = ["user_***", "buyer_***", "market_***", "seller_***", "auction_***"]
        const randomBidder = bidders[Math.floor(Math.random() * bidders.length)]

        setAuction((prev) => ({
          ...prev,
          currentBid: newBid,
          totalBids: prev.totalBids + 1,
          highestBidder: randomBidder,
        }))

        setBidHistory((prev) => [
          {
            id: Date.now().toString(),
            bidder: randomBidder,
            amount: newBid,
            timestamp: new Date(),
            isWinning: true,
          },
          ...prev.map((bid) => ({ ...bid, isWinning: false })),
        ])
      }
    }, 15000) // 15초마다 체크

    return () => clearInterval(interval)
  }, [auction.isActive, auction.currentBid, auction.minBidIncrement])

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setBidError("로그인이 필요합니다")
      return
    }

    const bidValue = Number.parseInt(bidAmount.replace(/,/g, ""))
    const minBid = auction.currentBid + auction.minBidIncrement

    if (!bidValue || bidValue < minBid) {
      setBidError(`최소 입찰가는 ${minBid.toLocaleString()}원입니다`)
      return
    }

    setIsLoading(true)
    setBidError("")
    setBidSuccess("")

    try {
      // 입찰 처리 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 입찰 성공
      setAuction((prev) => ({
        ...prev,
        currentBid: bidValue,
        totalBids: prev.totalBids + 1,
        highestBidder: user?.name || "나",
      }))

      setBidHistory((prev) => [
        {
          id: Date.now().toString(),
          bidder: user?.name || "나",
          amount: bidValue,
          timestamp: new Date(),
          isWinning: true,
        },
        ...prev.map((bid) => ({ ...bid, isWinning: false })),
      ])

      setBidSuccess("입찰이 성공적으로 완료되었습니다!")
      setBidAmount("")
    } catch (error) {
      setBidError("입찰 처리 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  const formatBidAmount = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "")
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBidAmount(e.target.value)
    setBidAmount(formatted)
    setBidError("")
  }

  const suggestedBids = [
    auction.currentBid + auction.minBidIncrement,
    auction.currentBid + auction.minBidIncrement * 2,
    auction.currentBid + auction.minBidIncrement * 5,
  ]

  return (
    <div className="space-y-6">
      {/* 경매 상태 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gavel className="w-5 h-5" />
              실시간 경매
            </CardTitle>
            <div className="flex items-center gap-2">
              {auction.isActive ? (
                <Badge variant="destructive" className="animate-pulse">
                  진행 중
                </Badge>
              ) : (
                <Badge variant="secondary">종료</Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWatching(!isWatching)}
                className={isWatching ? "bg-yellow-50 border-yellow-300" : ""}
              >
                {isWatching ? "관심 해제" : "관심 등록"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 현재 최고가 */}
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">현재 최고가</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">₩{auction.currentBid.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">최고 입찰자: {auction.highestBidder}</div>
            </div>

            {/* 남은 시간 */}
            <div className="text-center p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-600">남은 시간</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{timeLeft}</div>
              <div className="text-sm text-gray-500 mt-1">자동 종료</div>
            </div>

            {/* 입찰 현황 */}
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">총 입찰 수</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{auction.totalBids}회</div>
              <div className="text-sm text-gray-500 mt-1">최소 증가: ₩{auction.minBidIncrement.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 입찰하기 */}
      {auction.isActive && (
        <Card>
          <CardHeader>
            <CardTitle>입찰하기</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  입찰 금액 (최소: ₩{(auction.currentBid + auction.minBidIncrement).toLocaleString()})
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={bidAmount}
                      onChange={handleBidAmountChange}
                      placeholder="입찰 금액을 입력하세요"
                      className="text-right"
                      disabled={isLoading || !isAuthenticated}
                    />
                  </div>
                  <span className="flex items-center text-gray-500">원</span>
                </div>
              </div>

              {/* 추천 입찰가 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">추천 입찰가</label>
                <div className="flex gap-2">
                  {suggestedBids.map((amount, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setBidAmount(amount.toLocaleString())}
                      disabled={isLoading || !isAuthenticated}
                    >
                      ₩{amount.toLocaleString()}
                    </Button>
                  ))}
                </div>
              </div>

              {bidError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 text-sm">{bidError}</span>
                </div>
              )}

              {bidSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-700 text-sm">{bidSuccess}</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || !isAuthenticated || !auction.isActive}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    입찰 처리 중...
                  </div>
                ) : !isAuthenticated ? (
                  "로그인 후 입찰 가능"
                ) : (
                  "입찰하기"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 입찰 내역 */}
      <Card>
        <CardHeader>
          <CardTitle>입찰 내역</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bidHistory.map((bid) => (
              <div
                key={bid.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  bid.isWinning ? "bg-green-50 border border-green-200" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <div className="font-medium">{bid.bidder}</div>
                    <div className="text-gray-500">
                      {bid.timestamp.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">₩{bid.amount.toLocaleString()}</div>
                  {bid.isWinning && (
                    <Badge variant="default" className="bg-green-600">
                      최고가
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
