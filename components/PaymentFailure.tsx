"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, RefreshCw, Home, HelpCircle } from "lucide-react"
import Link from "next/link"
import type { PaymentResult, PaymentInfo } from "@/types/payment"

interface PaymentFailureProps {
  paymentResult: PaymentResult
  paymentInfo: PaymentInfo
  onRetry: () => void
}

export default function PaymentFailure({ paymentResult, paymentInfo, onRetry }: PaymentFailureProps) {
  const getErrorMessage = (error?: string) => {
    switch (error) {
      case "PAYMENT_FAILED":
        return "결제 승인이 거절되었습니다. 카드 정보를 확인하거나 다른 결제 방법을 시도해보세요."
      case "NETWORK_ERROR":
        return "네트워크 연결에 문제가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요."
      case "INSUFFICIENT_FUNDS":
        return "잔액이 부족합니다. 계좌 잔액을 확인하고 다시 시도해주세요."
      case "CARD_EXPIRED":
        return "카드 유효기간이 만료되었습니다. 다른 카드를 사용해주세요."
      case "INVALID_CARD":
        return "유효하지 않은 카드 정보입니다. 카드 정보를 다시 확인해주세요."
      default:
        return paymentResult.message || "알 수 없는 오류가 발생했습니다."
    }
  }

  const getRetryTips = (error?: string) => {
    const tips = ["카드 정보가 정확한지 확인해주세요", "다른 결제 방법을 시도해보세요", "잠시 후 다시 시도해주세요"]

    switch (error) {
      case "PAYMENT_FAILED":
        return ["카드 한도를 확인해주세요", "해외결제 차단 설정을 확인해주세요", "카드사에 문의해보세요"]
      case "NETWORK_ERROR":
        return ["인터넷 연결을 확인해주세요", "브라우저를 새로고침해주세요", "다른 브라우저를 사용해보세요"]
      case "INSUFFICIENT_FUNDS":
        return ["계좌 잔액을 확인해주세요", "다른 계좌나 카드를 사용해주세요", "일부 금액만 결제해보세요"]
      default:
        return tips
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-8 text-center">
          {/* 실패 아이콘 */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          {/* 실패 메시지 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제에 실패했습니다</h1>
          <p className="text-gray-600 mb-8">{getErrorMessage(paymentResult.error)}</p>

          {/* 주문 정보 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-medium mb-4">주문 정보</h3>
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={paymentInfo.productImage || "/placeholder.svg?height=60&width=60"}
                alt={paymentInfo.productTitle}
                className="w-15 h-15 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium">{paymentInfo.productTitle}</p>
                <p className="text-sm text-gray-600">판매자: {paymentInfo.sellerName}</p>
                <p className="font-bold text-blue-600">₩{paymentInfo.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* 해결 방법 */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-medium mb-4 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
              해결 방법
            </h3>
            <ul className="space-y-2">
              {getRetryTips(paymentResult.error).map((tip, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 액션 버튼들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={onRetry} className="h-12">
              <RefreshCw className="w-5 h-5 mr-2" />
              다시 시도하기
            </Button>

            <Link href="/">
              <Button variant="outline" className="w-full h-12">
                <Home className="w-5 h-5 mr-2" />
                홈으로 돌아가기
              </Button>
            </Link>
          </div>

          {/* 고객센터 안내 */}
          <div className="mt-8 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>계속 문제가 발생하나요?</strong>
              <br />
              고객센터: 1588-1234 (평일 09:00-18:00)
              <br />
              또는 채팅 상담을 이용해주세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
