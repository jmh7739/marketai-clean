"use client"

import { useState } from "react"
import { CheckCircle, Star, AlertTriangle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { EscrowService } from "@/lib/escrow"
import type { EscrowTransaction } from "@/types/escrow"

interface PurchaseConfirmationProps {
  transaction: EscrowTransaction
  onConfirmed: () => void
}

export default function PurchaseConfirmation({ transaction, onConfirmed }: PurchaseConfirmationProps) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [isConfirming, setIsConfirming] = useState(false)
  const [showDispute, setShowDispute] = useState(false)

  // 자동 확정까지 남은 시간 계산
  const getTimeUntilAutoConfirm = () => {
    if (!transaction.autoConfirmDate) return null

    const now = new Date()
    const autoConfirmDate = new Date(transaction.autoConfirmDate)
    const diffTime = autoConfirmDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays > 0 ? diffDays : 0
  }

  const handleConfirmPurchase = async () => {
    setIsConfirming(true)

    try {
      const result = await EscrowService.confirmPurchase({
        transactionId: transaction.id,
        buyerId: transaction.buyerId,
        confirmationType: "manual",
        confirmationDate: new Date(),
        rating: rating > 0 ? rating : undefined,
        review: review.trim() || undefined,
      })

      if (result.success) {
        onConfirmed()
      }
    } catch (error) {
      console.error("구매 확정 실패:", error)
    } finally {
      setIsConfirming(false)
    }
  }

  const daysLeft = getTimeUntilAutoConfirm()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">구매 확정</CardTitle>
            <p className="text-gray-600 mt-1">{transaction.productTitle}</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            배송 완료
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 자동 확정 안내 */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">자동 구매 확정 안내</h3>
          </div>
          <p className="text-blue-700 text-sm">
            {daysLeft && daysLeft > 0 ? (
              <>
                <strong>{daysLeft}일 후</strong> 자동으로 구매가 확정됩니다.
                <br />
                문제가 있다면 그 전에 분쟁을 신청해주세요.
              </>
            ) : (
              "곧 자동으로 구매가 확정됩니다."
            )}
          </p>
        </div>

        {/* 상품 정보 */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">📦</div>
          <div className="flex-1">
            <h4 className="font-medium">{transaction.productTitle}</h4>
            <p className="text-sm text-gray-600">결제금액: ₩{transaction.amount.toLocaleString()}</p>
            <p className="text-sm text-gray-600">배송완료: {transaction.deliveryDate?.toLocaleDateString()}</p>
          </div>
        </div>

        {/* 평점 */}
        <div>
          <label className="block text-sm font-medium mb-2">판매자 평가</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* 리뷰 */}
        <div>
          <label className="block text-sm font-medium mb-2">거래 후기 (선택사항)</label>
          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="다른 구매자들에게 도움이 되는 후기를 남겨주세요..."
            rows={3}
          />
        </div>

        {/* 액션 버튼들 */}
        <div className="flex space-x-3">
          <Button
            onClick={handleConfirmPurchase}
            disabled={isConfirming}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isConfirming ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                확정 처리 중...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                구매 확정하기
              </div>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowDispute(true)}
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            분쟁 신청
          </Button>
        </div>

        {/* 구매 확정 안내 */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ 구매 확정 전 확인사항</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 상품을 실제로 받으셨나요?</li>
            <li>• 상품 상태가 설명과 일치하나요?</li>
            <li>• 구매 확정 후에는 환불이 어렵습니다</li>
            <li>• 문제가 있다면 분쟁 신청을 먼저 해주세요</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
