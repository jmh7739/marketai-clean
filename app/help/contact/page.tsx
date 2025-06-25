"use client"

import type React from "react"

import { useState } from "react"
import { Send, Phone, Mail, MessageCircle, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const inquiryTypes = [
  { value: "account", label: "계정 관련" },
  { value: "auction", label: "경매 관련" },
  { value: "payment", label: "결제 관련" },
  { value: "shipping", label: "배송 관련" },
  { value: "refund", label: "환불/교환" },
  { value: "technical", label: "기술적 문제" },
  { value: "other", label: "기타" },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    subject: "",
    message: "",
    orderNumber: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 실제로는 API 호출
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">문의가 접수되었습니다</h2>
            <p className="text-gray-600 mb-4">
              빠른 시일 내에 답변드리겠습니다.
              <br />
              문의번호: <strong>INQ-{Date.now().toString().slice(-6)}</strong>
            </p>
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">고객센터</h1>
          <p className="text-gray-600">궁금한 점이나 문제가 있으시면 언제든 연락주세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 연락처 정보 */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>연락처 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">전화 상담</p>
                    <p className="text-sm text-gray-600">1588-1234</p>
                    <p className="text-xs text-gray-500">평일 09:00-18:00</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">이메일</p>
                    <p className="text-sm text-gray-600">support@marketai.com</p>
                    <p className="text-xs text-gray-500">24시간 접수</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">실시간 채팅</p>
                    <p className="text-sm text-gray-600">즉시 상담 가능</p>
                    <p className="text-xs text-gray-500">평일 09:00-22:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 운영시간 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  운영시간
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>평일</span>
                    <span>09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>토요일</span>
                    <span>09:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>일요일/공휴일</span>
                    <Badge variant="secondary">휴무</Badge>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">💡 긴급한 문의는 이메일로 보내주시면 24시간 내 답변드립니다.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 문의 폼 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>1:1 문의하기</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 개인정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">이름 *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">이메일 *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">연락처</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="010-1234-5678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="orderNumber">주문번호 (선택)</Label>
                      <Input
                        id="orderNumber"
                        value={formData.orderNumber}
                        onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                        placeholder="ORD-123456"
                      />
                    </div>
                  </div>

                  {/* 문의 유형 */}
                  <div>
                    <Label htmlFor="inquiryType">문의 유형 *</Label>
                    <Select
                      value={formData.inquiryType}
                      onValueChange={(value) => handleInputChange("inquiryType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="문의 유형을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 제목 */}
                  <div>
                    <Label htmlFor="subject">제목 *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="문의 제목을 입력하세요"
                      required
                    />
                  </div>

                  {/* 내용 */}
                  <div>
                    <Label htmlFor="message">문의 내용 *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="문의 내용을 자세히 작성해주세요. 스크린샷이나 오류 메시지가 있다면 함께 첨부해주시면 더 빠른 해결이 가능합니다."
                      rows={6}
                      required
                    />
                  </div>

                  {/* 개인정보 동의 */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <input type="checkbox" id="privacy" required className="mt-1" />
                      <label htmlFor="privacy" className="text-sm text-gray-700">
                        개인정보 수집 및 이용에 동의합니다.
                        <span className="text-blue-600 underline cursor-pointer ml-1">자세히 보기</span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      수집된 개인정보는 문의 처리 목적으로만 사용되며, 처리 완료 후 즉시 파기됩니다.
                    </p>
                  </div>

                  {/* 제출 버튼 */}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        전송 중...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        문의하기
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 자주 묻는 질문 링크 */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">자주 묻는 질문을 먼저 확인해보세요</h3>
              <p className="text-gray-600 mb-4">대부분의 궁금증은 FAQ에서 빠르게 해결하실 수 있습니다</p>
              <Button variant="outline" onClick={() => (window.location.href = "/help/faq")}>
                FAQ 보러가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
