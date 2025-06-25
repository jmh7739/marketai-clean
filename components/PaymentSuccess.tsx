"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, MessageCircle, Download, Home } from "lucide-react"
import Link from "next/link"
import type { PaymentResult, PaymentInfo } from "@/types/payment"

interface PaymentSuccessProps {
  paymentResult: PaymentResult
  paymentInfo: PaymentInfo
}

export default function PaymentSuccess({ paymentResult, paymentInfo }: PaymentSuccessProps) {
  const handleDownloadReceipt = () => {
    // 영수증 다운로드 로직
    const receiptData = {
      paymentId: paymentResult.paymentId,
      transactionId: paymentResult.transactionId,
      productTitle: paymentInfo.productTitle,
      amount: paymentInfo.totalAmount,
      date: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(receiptData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `receipt_${paymentResult.paymentId}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-8 text-center">
          {/* 성공 아이콘 */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* 성공 메시지 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h1>
          <p className="text-gray-600 mb-8">{paymentResult.message}</p>

          {/* 결제 정보 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">결제번호</p>
                <p className="font-mono text-sm">{paymentResult.paymentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">거래번호</p>
                <p className="font-mono text-sm">{paymentResult.transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">상품명</p>
                <p className="font-medium">{paymentInfo.productTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">결제금액</p>
                <p className="font-bold text-lg text-blue-600">₩{paymentInfo.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* 다음 단계 안내 */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div className="text-left">
                <p className="font-medium">판매자가 상품을 준비합니다</p>
                <p className="text-sm text-gray-600">보통 1-2일 소요됩니다</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold text-sm">2</span>
              </div>
              <div className="text-left">
                <p className="font-medium">배송이 시작됩니다</p>
                <p className="text-sm text-gray-600">배송 정보를 SMS로 알려드립니다</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold text-sm">3</span>
              </div>
              <div className="text-left">
                <p className="font-medium">상품을 받고 거래를 완료하세요</p>
                <p className="text-sm text-gray-600">리뷰 작성으로 다른 구매자에게 도움을 주세요</p>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleDownloadReceipt} variant="outline" className="h-12">
              <Download className="w-5 h-5 mr-2" />
              영수증 다운로드
            </Button>

            <Link href={`/chat/${paymentInfo.sellerId}`}>
              <Button variant="outline" className="w-full h-12">
                <MessageCircle className="w-5 h-5 mr-2" />
                판매자와 채팅
              </Button>
            </Link>

            <Link href="/my-account">
              <Button variant="outline" className="w-full h-12">
                <Package className="w-5 h-5 mr-2" />
                주문 내역 보기
              </Button>
            </Link>

            <Link href="/">
              <Button className="w-full h-12">
                <Home className="w-5 h-5 mr-2" />
                홈으로 돌아가기
              </Button>
            </Link>
          </div>

          {/* 고객센터 안내 */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>문의사항이 있으신가요?</strong>
              <br />
              고객센터: 1588-1234 (평일 09:00-18:00)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
