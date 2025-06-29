"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gavel, TrendingUp, Clock, AlertCircle } from "lucide-react"
import { formatCurrency, calculateFee } from "@/lib/fee-calculator"
import { useAuctionStore } from "@/stores/auction-store"
import { toast } from "sonner"

interface BidSystemProps {
  auctionId: string
  currentPrice: number
  minimumBid: number
  buyNowPrice?: number
  userId?: string
  isEnded?: boolean
}

export function BidSystem({
  auctionId,
  currentPrice,
  minimumBid,
  buyNowPrice,
  userId,
  isEnded = false,
}: BidSystemProps) {
  const [bidAmount, setBidAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { placeBid } = useAuctionStore()

  const suggestedBids = [minimumBid, minimumBid + 1000, minimumBid + 5000, minimumBid + 10000].filter(
    (amount) => !buyNowPrice || amount < buyNowPrice,
  )

  const handleBidSubmit = async () => {
    if (!userId) {
      toast.error("로그인이 필요합니다.")
      return
    }

    const amount = Number.parseInt(bidAmount.replace(/,/g, ""))

    if (isNaN(amount) || amount < minimumBid) {
      toast.error(`최소 입찰가는 ${formatCurrency(minimumBid)}입니다.`)
      return
    }

    if (buyNowPrice && amount >= buyNowPrice) {
      toast.error(`즉시구매가(${formatCurrency(buyNowPrice)}) 미만으로 입찰해주세요.`)
      return
    }

    setIsSubmitting(true)

    try {
      const result = await placeBid(auctionId, amount, userId)

      if (result.success) {
        toast.success("입찰이 완료되었습니다!")
        setBidAmount("")
      } else {
        toast.error(result.error || "입찰에 실패했습니다.")
      }
    } catch (error) {
      toast.error("입찰 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBuyNow = async () => {
    if (!userId) {
      toast.error("로그인이 필요합니다.")
      return
    }

    if (!buyNowPrice) return

    setIsSubmitting(true)

    try {
      const result = await placeBid(auctionId, buyNowPrice, userId)

      if (result.success) {
        toast.success("즉시구매가 완료되었습니다!")
      } else {
        toast.error(result.error || "즉시구매에 실패했습니다.")
      }
    } catch (error) {
      toast.error("즉시구매 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatInputValue = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputValue(e.target.value)
    setBidAmount(formatted)
  }

  if (isEnded) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">경매가 종료되었습니다</h3>
          <p className="text-gray-600">최종 낙찰가: {formatCurrency(currentPrice)}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* 현재 입찰 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            현재 입찰 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">현재 최고가</span>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(currentPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">최소 입찰가</span>
              <span className="font-semibold">{formatCurrency(minimumBid)}</span>
            </div>
            {buyNowPrice && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">즉시구매가</span>
                <span className="font-semibold text-green-600">{formatCurrency(buyNowPrice)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 입찰 시스템 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gavel className="h-5 w-5 mr-2" />
            입찰하기
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 추천 입찰가 */}
          <div>
            <label className="text-sm font-medium mb-2 block">추천 입찰가</label>
            <div className="grid grid-cols-2 gap-2">
              {suggestedBids.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBidAmount(amount.toLocaleString())}
                  disabled={isSubmitting}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>
          </div>

          {/* 직접 입찰가 입력 */}
          <div>
            <label className="text-sm font-medium mb-2 block">직접 입력</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="입찰가를 입력하세요"
                  value={bidAmount}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <span className="flex items-center text-gray-500">원</span>
            </div>
          </div>

          {/* 수수료 정보 */}
          {bidAmount && !isNaN(Number.parseInt(bidAmount.replace(/,/g, ""))) && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">낙찰 시 예상 수수료</div>
              {(() => {
                const amount = Number.parseInt(bidAmount.replace(/,/g, ""))
                const { fee, feeRate } = calculateFee(amount)
                return (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">수수료 ({(feeRate * 100).toFixed(1)}%)</span>
                    <span className="font-medium text-red-600">{formatCurrency(fee)}</span>
                  </div>
                )
              })()}
            </div>
          )}

          {/* 입찰 버튼 */}
          <div className="space-y-2">
            <Button
              onClick={handleBidSubmit}
              disabled={!bidAmount || isSubmitting || !userId}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  입찰 중...
                </div>
              ) : (
                <>
                  <Gavel className="h-4 w-4 mr-2" />
                  {bidAmount ? `${bidAmount}원으로 입찰` : "입찰하기"}
                </>
              )}
            </Button>

            {buyNowPrice && (
              <Button
                onClick={handleBuyNow}
                disabled={isSubmitting || !userId}
                variant="secondary"
                className="w-full"
                size="lg"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {formatCurrency(buyNowPrice)} 즉시구매
              </Button>
            )}
          </div>

          {!userId && (
            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">입찰하려면 로그인이 필요합니다.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
