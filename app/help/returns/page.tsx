"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { RotateCcw, AlertCircle, CheckCircle, Upload, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface OrderInfo {
  orderId: string
  productTitle: string
  productImage: string
  seller: string
  finalPrice: number
  orderDate: string
  deliveryDate: string
  canReturn: boolean
  returnDeadline: string
}

const mockOrderInfo: OrderInfo = {
  orderId: "ORD-001",
  productTitle: "iPhone 15 Pro Max 256GB 자연 티타늄",
  productImage: "/placeholder.svg?height=100&width=100&text=iPhone",
  seller: "TechStore",
  finalPrice: 1250000,
  orderDate: "2024-01-15",
  deliveryDate: "2024-01-17",
  canReturn: true,
  returnDeadline: "2024-01-24",
}

const returnReasons = [
  { value: "defective", label: "상품 불량/하자" },
  { value: "different", label: "설명과 다른 상품" },
  { value: "damaged", label: "배송 중 파손" },
  { value: "wrong", label: "잘못된 상품 배송" },
  { value: "change-mind", label: "단순 변심" },
  { value: "other", label: "기타" },
]

export default function ReturnsPage() {
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null)
  const [formData, setFormData] = useState({
    orderId: "",
    returnType: "", // return, exchange
    reason: "",
    customReason: "",
    description: "",
    images: [] as File[],
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    agreeToTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // URL에서 주문번호 가져오기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const order = urlParams.get("order")
    if (order) {
      setFormData((prev) => ({ ...prev, orderId: order }))
      loadOrderInfo(order)
    }
  }, [])

  const loadOrderInfo = (orderId: string) => {
    // 실제로는 API 호출
    if (orderId === "ORD-001") {
      setOrderInfo(mockOrderInfo)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 실제로는 API 호출
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">신청이 접수되었습니다</h2>
            <p className="text-gray-600 mb-4">
              빠른 시일 내에 처리해드리겠습니다.
              <br />
              신청번호: <strong>RET-{Date.now().toString().slice(-6)}</strong>
            </p>
            <Button onClick={() => (window.location.href = "/my-account/orders")} className="w-full">
              주문 내역으로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">환불/교환 신청</h1>
          <p className="text-gray-600">상품에 문제가 있거나 교환을 원하시면 신청해주세요</p>
        </div>

        {/* 주문 조회 */}
        {!orderInfo && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>주문번호 입력</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="주문번호를 입력하세요 (예: ORD-001)"
                  value={formData.orderId}
                  onChange={(e) => handleInputChange("orderId", e.target.value)}
                />
                <Button onClick={() => loadOrderInfo(formData.orderId)}>조회</Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">💡 테스트용 주문번호: ORD-001</p>
            </CardContent>
          </Card>
        )}

        {/* 주문 정보 */}
        {orderInfo && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>주문 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <img
                    src={orderInfo.productImage || "/placeholder.svg"}
                    alt={orderInfo.productTitle}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">{orderInfo.productTitle}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">주문번호: {orderInfo.orderId}</p>
                        <p className="text-gray-600">판매자: {orderInfo.seller}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">주문일: {orderInfo.orderDate}</p>
                        <p className="text-gray-600">배송완료일: {orderInfo.deliveryDate}</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-blue-600 mt-2">₩{orderInfo.finalPrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* 환불/교환 가능 여부 */}
                <div className="mt-4 p-4 rounded-lg border">
                  {orderInfo.canReturn ? (
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span>환불/교환 신청 가능 (마감: {orderInfo.returnDeadline})</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-700">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <span>환불/교환 신청 기간이 지났습니다</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 환불/교환 신청 폼 */}
            {orderInfo.canReturn && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5" />
                    환불/교환 신청
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 신청 유형 */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">신청 유형</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="return"
                            name="returnType"
                            value="return"
                            checked={formData.returnType === "return"}
                            onChange={(e) => handleInputChange("returnType", e.target.value)}
                          />
                          <Label htmlFor="return" className="cursor-pointer">
                            환불
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="exchange"
                            name="returnType"
                            value="exchange"
                            checked={formData.returnType === "exchange"}
                            onChange={(e) => handleInputChange("returnType", e.target.value)}
                          />
                          <Label htmlFor="exchange" className="cursor-pointer">
                            교환
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* 사유 선택 */}
                    <div>
                      <Label className="text-base font-medium mb-2 block">신청 사유</Label>
                      <Select value={formData.reason} onValueChange={(value) => handleInputChange("reason", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="사유를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {returnReasons.map((reason) => (
                            <SelectItem key={reason.value} value={reason.value}>
                              {reason.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* 기타 사유 직접 입력 */}
                      {formData.reason === "other" && (
                        <Input
                          className="mt-2"
                          placeholder="사유를 직접 입력해주세요"
                          value={formData.customReason}
                          onChange={(e) => handleInputChange("customReason", e.target.value)}
                        />
                      )}
                    </div>

                    {/* 상세 설명 */}
                    <div>
                      <Label htmlFor="description" className="text-base font-medium mb-2 block">
                        상세 설명
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="상품의 문제점이나 교환 사유를 자세히 설명해주세요"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={4}
                      />
                    </div>

                    {/* 사진 첨부 */}
                    <div>
                      <Label className="text-base font-medium mb-2 block">사진 첨부</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-2">상품 상태를 확인할 수 있는 사진을 첨부해주세요</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button type="button" variant="outline" asChild>
                          <label htmlFor="image-upload" className="cursor-pointer">
                            사진 선택
                          </label>
                        </Button>
                      </div>
                      {formData.images.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.images.map((image, index) => (
                            <Badge key={index} variant="secondary">
                              {image.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 환불 계좌 정보 (환불 선택시만) */}
                    {formData.returnType === "return" && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold mb-4">환불 계좌 정보</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="bankName">은행명</Label>
                            <Input
                              id="bankName"
                              placeholder="예: 국민은행"
                              value={formData.bankName}
                              onChange={(e) => handleInputChange("bankName", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="accountNumber">계좌번호</Label>
                            <Input
                              id="accountNumber"
                              placeholder="계좌번호 입력"
                              value={formData.accountNumber}
                              onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="accountHolder">예금주</Label>
                            <Input
                              id="accountHolder"
                              placeholder="예금주명"
                              value={formData.accountHolder}
                              onChange={(e) => handleInputChange("accountHolder", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 주의사항 */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 환불/교환 주의사항</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• 상품 수령 후 7일 이내에만 신청 가능합니다</li>
                        <li>• 단순 변심의 경우 배송비는 구매자 부담입니다</li>
                        <li>• 상품에 하자가 있는 경우 배송비는 판매자 부담입니다</li>
                        <li>• 사용한 상품이나 포장이 훼손된 경우 교환/환불이 제한될 수 있습니다</li>
                      </ul>
                    </div>

                    {/* 동의 체크박스 */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                      />
                      <Label htmlFor="agreeToTerms" className="cursor-pointer">
                        환불/교환 정책에 동의합니다
                      </Label>
                    </div>

                    {/* 제출 버튼 */}
                    <Button type="submit" className="w-full" disabled={isLoading || !formData.agreeToTerms}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          처리중...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          {formData.returnType === "return" ? "환불" : "교환"} 신청하기
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* 고객센터 안내 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  추가 문의
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">환불/교환에 대해 궁금한 점이 있으시면 언제든 연락주세요</p>
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => (window.location.href = "/help/contact")}>
                    1:1 문의하기
                  </Button>
                  <Button variant="outline" onClick={() => (window.location.href = "tel:1588-1234")}>
                    전화 상담 (1588-1234)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
