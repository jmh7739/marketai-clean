"use client"

import { useState, useEffect } from "react"
import { Gavel, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface AutoBidSystemProps {
  currentPrice: number
  minimumBid: number
  bidIncrement: number
  onBidPlaced: (amount: number, isAutoBid: boolean) => void
  userMaxBid?: number
  isUserWinning: boolean
}

export default function AutoBidSystem({
  currentPrice,
  minimumBid,
  bidIncrement,
  onBidPlaced,
  userMaxBid,
  isUserWinning,
}: AutoBidSystemProps) {
  const [maxBidAmount, setMaxBidAmount] = useState("")
  const [showAutoBidForm, setShowAutoBidForm] = useState(false)
  const [manualBidAmount, setManualBidAmount] = useState("")
  const [bidHistory, setBidHistory] = useState<
    Array<{
      amount: number
      bidder: string
      time: string
      isAutoBid: boolean
      isUser: boolean
    }>
  >([
    {
      amount: currentPrice,
      bidder: "user***1",
      time: "2분 전",
      isAutoBid: false,
      isUser: false,
    },
  ])

  // 자동 입찰 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && userMaxBid) {
        // 20% 확률로 다른 사용자가 입찰
        const otherUserBid = currentPrice + bidIncrement + Math.floor(Math.random() * 50000)

        if (otherUserBid < userMaxBid) {
          // 사용자의 최대 입찰가가 더 높으면 자동으로 재입찰
          const newUserBid = Math.min(otherUserBid + bidIncrement, userMaxBid)

          setBidHistory((prev) => [
            {
              amount: newUserBid,
              bidder: "나 (자동입찰)",
              time: "방금 전",
              isAutoBid: true,
              isUser: true,
            },
            {
              amount: otherUserBid,
              bidder: "buyer***2",
              time: "방금 전",
              isAutoBid: false,
              isUser: false,
            },
            ...prev.slice(0, 8),
          ])

          onBidPlaced(newUserBid, true)
        } else {
          // 다른 사용자가 더 높게 입찰
          setBidHistory((prev) => [
            {
              amount: otherUserBid,
              bidder: "buyer***2",
              time: "방금 전",
              isAutoBid: false,
              isUser: false,
            },
            ...prev.slice(0, 9),
          ])

          onBidPlaced(otherUserBid, false)
        }
      }
    }, 15000) // 15초마다 체크

    return () => clearInterval(interval)
  }, [userMaxBid, currentPrice, bidIncrement, onBidPlaced])

  const handleAutoBid = () => {
    const amount = Number.parseInt(maxBidAmount)
    if (!amount || amount <= currentPrice) {
      alert(`현재가(₩${currentPrice.toLocaleString()})보다 높은 금액을 입력해주세요.`)
      return
    }

    // 즉시 최소 입찰가로 입찰
    const initialBid = currentPrice + bidIncrement

    setBidHistory((prev) => [
      {
        amount: initialBid,
        bidder: "나 (자동입찰)",
        time: "방금 전",
        isAutoBid: true,
        isUser: true,
      },
      ...prev.slice(0, 9),
    ])

    onBidPlaced(initialBid, true)
    setMaxBidAmount("")
    setShowAutoBidForm(false)
  }

  const handleManualBid = () => {
    const amount = Number.parseInt(manualBidAmount)
    if (!amount || amount < minimumBid) {
      alert(`최소 입찰가는 ₩${minimumBid.toLocaleString()}입니다.`)
      return
    }

    setBidHistory((prev) => [
      {
        amount,
        bidder: "나",
        time: "방금 전",
        isAutoBid: false,
        isUser: true,
      },
      ...prev.slice(0, 9),
    ])

    onBidPlaced(amount, false)
    setManualBidAmount("")
  }

  return (
    <div className="space-y-6">
      {/* 현재 입찰 상태 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">현재 입찰 상황</h3>
              <div className="text-3xl font-bold text-blue-600">₩{currentPrice.toLocaleString()}</div>
            </div>
            <div className="text-right">
              {isUserWinning ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-semibold">최고가 입찰 중</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-semibold">입찰이 밀렸습니다</span>
                </div>
              )}
              {userMaxBid && (
                <div className="text-sm text-gray-600 mt-1">최대 입찰가: ₩{userMaxBid.toLocaleString()}</div>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            최소 입찰가: ₩{minimumBid.toLocaleString()} (₩{bidIncrement.toLocaleString()} 단위)
          </div>
        </CardContent>
      </Card>

      {/* 입찰 방법 선택 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 자동 입찰 */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Gavel className="w-5 h-5 mr-2" />
              자동 입찰 (추천)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">자동 입찰이란?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 최대 입찰가를 설정하면 자동으로 입찰</li>
                  <li>• 다른 입찰자보다 항상 최소 단위만큼 높게 입찰</li>
                  <li>• 최대 입찰가 내에서만 입찰됩니다</li>
                </ul>
              </div>

              {!showAutoBidForm ? (
                <Button onClick={() => setShowAutoBidForm(true)} className="w-full">
                  자동 입찰 설정하기
                </Button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="maxBid">최대 입찰가</Label>
                    <Input
                      id="maxBid"
                      type="number"
                      value={maxBidAmount}
                      onChange={(e) => setMaxBidAmount(e.target.value)}
                      placeholder={`${(currentPrice + bidIncrement * 2).toLocaleString()}`}
                    />
                    <p className="text-xs text-gray-500 mt-1">현재가보다 높은 금액을 입력하세요</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAutoBid} className="flex-1">
                      자동 입찰 시작
                    </Button>
                    <Button variant="outline" onClick={() => setShowAutoBidForm(false)}>
                      취소
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 수동 입찰 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              수동 입찰
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="manualBid">입찰 금액</Label>
                <Input
                  id="manualBid"
                  type="number"
                  value={manualBidAmount}
                  onChange={(e) => setManualBidAmount(e.target.value)}
                  placeholder={minimumBid.toLocaleString()}
                />
                <p className="text-xs text-gray-500 mt-1">최소 입찰가: ₩{minimumBid.toLocaleString()}</p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setManualBidAmount(minimumBid.toString())} className="flex-1">
                  최소가
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setManualBidAmount((minimumBid + bidIncrement * 2).toString())}
                  className="flex-1"
                >
                  +₩{(bidIncrement * 2).toLocaleString()}
                </Button>
              </div>

              <Button onClick={handleManualBid} variant="outline" className="w-full">
                입찰하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 입찰 내역 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            입찰 내역
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {bidHistory.map((bid, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  bid.isUser
                    ? bid.isAutoBid
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-green-50 border border-green-200"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-semibold">₩{bid.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{bid.bidder}</div>
                  </div>
                  {bid.isAutoBid && (
                    <Badge variant="outline" className="text-xs">
                      자동입찰
                    </Badge>
                  )}
                  {index === 0 && <Badge className="bg-green-500 text-xs">최고가</Badge>}
                </div>
                <div className="text-sm text-gray-500">{bid.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
