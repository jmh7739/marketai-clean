"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Building2, Smartphone, Shield, CheckCircle, AlertCircle, ArrowLeft, Lock } from "lucide-react"
import type { PaymentMethod, PaymentInfo, PaymentResult } from "@/types/payment"

interface MockPaymentSystemProps {
  paymentInfo: PaymentInfo
  onPaymentComplete: (result: PaymentResult) => void
  onCancel: () => void
}

export default function MockPaymentSystem({ paymentInfo, onPaymentComplete, onCancel }: MockPaymentSystemProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      type: "card",
      name: "신용/체크카드",
      icon: "💳",
      isAvailable: true,
    },
    {
      id: "bank",
      type: "bank",
      name: "계좌이체",
      icon: "🏦",
      isAvailable: true,
    },
    {
      id: "kakao",
      type: "kakao",
      name: "카카오페이",
      icon: "💛",
      isAvailable: true,
    },
    {
      id: "naver",
      type: "naver",
      name: "네이버페이",
      icon: "💚",
      isAvailable: true,
    },
    {
      id: "payco",
      type: "payco",
      name: "페이코",
      icon: "🔴",
      isAvailable: false,
    },
  ]

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("결제 방법을 선택해주세요.")
      return
    }

    setIsProcessing(true)

    // 결제 처리 시뮬레이션
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000)) // 3초 대기

      // 90% 확률로 성공
      const isSuccess = Math.random() > 0.1

      const result: PaymentResult = {
        success: isSuccess,
        paymentId: isSuccess ? `PAY_${Date.now()}` : undefined,
        transactionId: isSuccess ? `TXN_${Date.now()}` : undefined,
        message: isSuccess ? "결제가 성공적으로 완료되었습니다!" : "결제 처리 중 오류가 발생했습니다.",
        error: isSuccess ? undefined : "PAYMENT_FAILED",
      }

      onPaymentComplete(result)
    } catch (error) {
      onPaymentComplete({
        success: false,
        message: "결제 처리 중 오류가 발생했습니다.",
        error: "NETWORK_ERROR",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  if (isProcessing) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">결제 처리 중...</h3>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center text-yellow-800 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              브라우저를 닫지 마세요
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">결제하기</h1>
          <p className="text-gray-600">안전한 결제를 위해 정보를 확인해주세요</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 주문 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>주문 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <img
                src={paymentInfo.productImage || "/placeholder.svg?height=80&width=80"}
                alt={paymentInfo.productTitle}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium line-clamp-2">{paymentInfo.productTitle}</h3>
                <p className="text-sm text-gray-600 mt-1">판매자: {paymentInfo.sellerName}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>낙찰가</span>
                <span>₩{paymentInfo.finalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span>₩{paymentInfo.shippingFee.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>총 결제금액</span>
                <span className="text-blue-600">₩{paymentInfo.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center text-blue-800 text-sm">
                <Shield className="w-4 h-4 mr-2" />
                구매자 보호 정책 적용
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 결제 방법 */}
        <Card>
          <CardHeader>
            <CardTitle>결제 방법</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${!method.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => method.isAvailable && setSelectedMethod(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium">{method.name}</span>
                    </div>
                    {!method.isAvailable && <Badge variant="secondary">준비중</Badge>}
                    {selectedMethod === method.id && <CheckCircle className="w-5 h-5 text-blue-500" />}
                  </div>
                </div>
              ))}
            </div>

            {/* 카드 정보 입력 */}
            {selectedMethod === "card" && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  카드 정보
                </h4>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="cardNumber">카드번호</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardInfo.number}
                      onChange={(e) =>
                        setCardInfo((prev) => ({
                          ...prev,
                          number: formatCardNumber(e.target.value),
                        }))
                      }
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="expiry">유효기간</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardInfo.expiry}
                        onChange={(e) =>
                          setCardInfo((prev) => ({
                            ...prev,
                            expiry: formatExpiry(e.target.value),
                          }))
                        }
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cardInfo.cvc}
                        onChange={(e) =>
                          setCardInfo((prev) => ({
                            ...prev,
                            cvc: e.target.value.replace(/\D/g, ""),
                          }))
                        }
                        maxLength={3}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName">카드소유자명</Label>
                    <Input
                      id="cardName"
                      placeholder="홍길동"
                      value={cardInfo.name}
                      onChange={(e) =>
                        setCardInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 간편결제 안내 */}
            {(selectedMethod === "kakao" || selectedMethod === "naver") && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="font-medium">간편결제 안내</span>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedMethod === "kakao" ? "카카오페이" : "네이버페이"} 앱으로 이동하여 결제를 진행합니다.
                </p>
              </div>
            )}

            {/* 계좌이체 안내 */}
            {selectedMethod === "bank" && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">계좌이체 안내</span>
                </div>
                <p className="text-sm text-gray-600">은행 사이트로 이동하여 실시간 계좌이체를 진행합니다.</p>
              </div>
            )}

            {/* 결제 버튼 */}
            <Button onClick={handlePayment} disabled={!selectedMethod || isProcessing} className="w-full h-12 text-lg">
              <Lock className="w-5 h-5 mr-2" />₩{paymentInfo.totalAmount.toLocaleString()} 결제하기
            </Button>

            <div className="text-xs text-gray-500 text-center">
              <p>결제 진행 시 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.</p>
              <p className="mt-1">💡 이것은 개발용 모의 결제 시스템입니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
