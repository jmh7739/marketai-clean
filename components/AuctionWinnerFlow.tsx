"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Trophy, CreditCard, Truck, CheckCircle, Clock, Package, Star, MessageCircle, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/fee-calculator"
import SafeLink from "@/components/SafeLink"

interface AuctionWinnerFlowProps {
  auctionId: string
  winnerId: string
  finalPrice: number
  productTitle: string
  productImage: string
  sellerName: string
  sellerId: string
}

type FlowStep = "won" | "payment" | "shipping" | "delivered" | "completed"

export default function AuctionWinnerFlow({
  auctionId,
  winnerId,
  finalPrice,
  productTitle,
  productImage,
  sellerName,
  sellerId,
}: AuctionWinnerFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("won")
  const [paymentDeadline, setPaymentDeadline] = useState<Date>(new Date(Date.now() + 24 * 60 * 60 * 1000))
  const [trackingNumber, setTrackingNumber] = useState<string>("")
  const [timeLeft, setTimeLeft] = useState<string>("")

  // 결제 마감 시간 카운트다운
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const deadline = paymentDeadline.getTime()
      const difference = deadline - now

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours}시간 ${minutes}분`)
      } else {
        setTimeLeft("마감")
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [paymentDeadline])

  const getStepProgress = () => {
    const steps = ["won", "payment", "shipping", "delivered", "completed"]
    const currentIndex = steps.indexOf(currentStep)
    return ((currentIndex + 1) / steps.length) * 100
  }

  const getStepIcon = (step: FlowStep) => {
    switch (step) {
      case "won":
        return <Trophy className="w-5 h-5" />
      case "payment":
        return <CreditCard className="w-5 h-5" />
      case "shipping":
        return <Truck className="w-5 h-5" />
      case "delivered":
        return <Package className="w-5 h-5" />
      case "completed":
        return <CheckCircle className="w-5 h-5" />
    }
  }

  const getStepTitle = (step: FlowStep) => {
    switch (step) {
      case "won":
        return "낙찰 완료"
      case "payment":
        return "결제 진행"
      case "shipping":
        return "배송 중"
      case "delivered":
        return "배송 완료"
      case "completed":
        return "거래 완료"
    }
  }

  const handlePayment = () => {
    // 결제 페이지로 이동
    window.location.href = `/payment/${auctionId}`
  }

  const handlePurchaseConfirmation = () => {
    // 구매 확정 처리
    setCurrentStep("completed")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <CardTitle className="text-2xl">축하합니다! 낙찰되었습니다</CardTitle>
                <p className="text-gray-600">경매에서 성공적으로 낙찰받으셨습니다</p>
              </div>
            </div>
            <Badge className="bg-green-600 text-white">{getStepTitle(currentStep)}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={getStepProgress()} className="w-full" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>낙찰</span>
            <span>결제</span>
            <span>배송</span>
            <span>수령</span>
            <span>완료</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 상품 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 상품 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>낙찰 상품</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <img
                  src={productImage || "/placeholder.svg?height=120&width=120"}
                  alt={productTitle}
                  className="w-30 h-30 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{productTitle}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">낙찰가</span>
                      <span className="text-2xl font-bold text-blue-600">{formatCurrency(finalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">판매자</span>
                      <span className="font-medium">{sellerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">낙찰 시간</span>
                      <span>{new Date().toLocaleString("ko-KR")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 현재 단계별 내용 */}
          {currentStep === "won" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  낙찰 완료
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                      <div>
                        <p className="font-medium text-yellow-800">결제 마감까지</p>
                        <p className="text-2xl font-bold text-yellow-600">{timeLeft}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    24시간 이내에 결제를 완료해주세요. 기한 내 결제하지 않으면 낙찰이 취소될 수 있습니다.
                  </p>
                  <Button onClick={handlePayment} className="w-full" size="lg">
                    <CreditCard className="w-5 h-5 mr-2" />
                    지금 결제하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
                  결제 진행 중
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-lg font-medium">결제를 처리하고 있습니다</p>
                  <p className="text-gray-600">잠시만 기다려주세요...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "shipping" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-orange-500" />
                  배송 중
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-medium mb-2">배송 정보</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>운송장번호</span>
                        <span className="font-mono">{trackingNumber || "1234567890"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>택배사</span>
                        <span>CJ대한통운</span>
                      </div>
                      <div className="flex justify-between">
                        <span>예상 도착</span>
                        <span>내일 오후</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Truck className="w-4 h-4 mr-2" />
                    배송 조회
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "delivered" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-green-500" />
                  배송 완료
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium text-green-800 mb-2">상품이 도착했습니다!</p>
                    <p className="text-sm text-green-700">상품을 확인하신 후 구매확정 버튼을 눌러주세요.</p>
                  </div>
                  <Button onClick={handlePurchaseConfirmation} className="w-full" size="lg">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    구매 확정하기
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    문제 신고하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "completed" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  거래 완료
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">거래가 완료되었습니다!</h3>
                  <p className="text-gray-600 mb-6">판매자에게 평점을 남겨주세요.</p>
                  <div className="flex justify-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-8 h-8 text-yellow-400 cursor-pointer hover:text-yellow-500" />
                    ))}
                  </div>
                  <Button className="w-full">리뷰 작성하기</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 오른쪽: 사이드바 */}
        <div className="space-y-6">
          {/* 판매자 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>판매자 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-semibold">{sellerName[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium">{sellerName}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span>4.8 (127)</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <SafeLink href={`/chat/${sellerId}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    판매자와 채팅
                  </Button>
                </SafeLink>
              </div>
            </CardContent>
          </Card>

          {/* 결제 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>결제 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>낙찰가</span>
                  <span>{formatCurrency(finalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span>무료</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>수수료</span>
                  <span>{formatCurrency(Math.floor(finalPrice * 0.05))}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제금액</span>
                  <span className="text-blue-600">{formatCurrency(finalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 도움말 */}
          <Card>
            <CardHeader>
              <CardTitle>도움이 필요하신가요?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <SafeLink href="/help/buyer-guide">
                  <Button variant="ghost" className="w-full justify-start">
                    구매자 가이드
                  </Button>
                </SafeLink>
                <SafeLink href="/help/contact">
                  <Button variant="ghost" className="w-full justify-start">
                    고객센터 문의
                  </Button>
                </SafeLink>
                <SafeLink href="/help/faq">
                  <Button variant="ghost" className="w-full justify-start">
                    자주 묻는 질문
                  </Button>
                </SafeLink>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
