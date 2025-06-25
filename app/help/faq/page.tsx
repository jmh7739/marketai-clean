"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import SafeLink from "@/components/SafeLink"

interface FAQItem {
  id: string
  category: string
  question: string
  answer: string
  tags: string[]
  helpful: number
}

const faqData: FAQItem[] = [
  {
    id: "1",
    category: "경매 참여",
    question: "경매에 어떻게 참여하나요?",
    answer:
      "경매 참여는 매우 간단합니다. 1) 회원가입 후 로그인 2) 원하는 상품 클릭 3) '입찰하기' 버튼 클릭 4) 입찰가 입력 후 확인. 입찰 시 현재 최고가보다 높은 금액을 입력해야 합니다.",
    tags: ["입찰", "경매", "참여방법"],
    helpful: 245,
  },
  {
    id: "2",
    category: "결제",
    question: "결제는 어떻게 하나요?",
    answer:
      "낙찰 후 24시간 내에 계좌이체로 결제해주세요. 1) 낙찰 알림 확인 2) 결제 페이지에서 계좌정보 확인 3) 정확한 금액 입금 4) 입금 확인 신고. 입금 확인 후 판매자가 상품을 발송합니다.",
    tags: ["결제", "계좌이체", "낙찰"],
    helpful: 189,
  },
  {
    id: "3",
    category: "배송",
    question: "배송은 언제 시작되나요?",
    answer:
      "결제 확인 후 판매자가 1-3일 내에 발송합니다. 발송 시 운송장 번호가 자동으로 전송되며, 배송조회 페이지에서 실시간 추적이 가능합니다. 직접 픽업도 가능한 상품이 있습니다.",
    tags: ["배송", "발송", "운송장"],
    helpful: 156,
  },
  {
    id: "4",
    category: "판매",
    question: "상품을 어떻게 등록하나요?",
    answer:
      "판매하기 페이지에서 쉽게 등록할 수 있습니다. 1) 상품 사진 업로드 (AI가 자동 분석) 2) 카테고리 및 상품 정보 입력 3) 경매 시작가 설정 4) 배송 정보 입력 5) 등록 완료. AI가 적정 가격을 추천해드립니다.",
    tags: ["판매", "상품등록", "AI추천"],
    helpful: 134,
  },
  {
    id: "5",
    category: "계정",
    question: "비밀번호를 잊어버렸어요",
    answer:
      "로그인 페이지에서 '비밀번호 찾기'를 클릭하세요. 가입시 등록한 이메일 또는 휴대폰 번호로 인증 후 새 비밀번호를 설정할 수 있습니다. 보안을 위해 정기적으로 비밀번호를 변경해주세요.",
    tags: ["비밀번호", "계정", "찾기"],
    helpful: 98,
  },
  {
    id: "6",
    category: "환불/교환",
    question: "환불이나 교환이 가능한가요?",
    answer:
      "상품 수령 후 7일 이내에 환불/교환 신청이 가능합니다. 단, 상품이 설명과 다르거나 하자가 있는 경우에만 가능하며, 단순 변심으로는 불가능합니다. 환불 시 배송비는 구매자 부담입니다.",
    tags: ["환불", "교환", "반품"],
    helpful: 87,
  },
  {
    id: "7",
    category: "수수료",
    question: "수수료는 얼마인가요?",
    answer:
      "구매자는 별도 수수료가 없습니다. 판매자는 낙찰가의 5%를 수수료로 지불합니다. 예를 들어 100만원에 낙찰되면 5만원이 수수료입니다. 수수료는 판매 완료 후 자동으로 정산됩니다.",
    tags: ["수수료", "비용", "정산"],
    helpful: 76,
  },
  {
    id: "8",
    category: "보안",
    question: "거래가 안전한가요?",
    answer:
      "네, 매우 안전합니다. 1) 모든 거래는 플랫폼을 통해 진행 2) 결제 후 상품 발송 시스템 3) 구매자 보호 정책 4) 24시간 고객지원. 직거래는 권장하지 않으며, 사기 방지를 위해 반드시 플랫폼 내에서 거래해주세요.",
    tags: ["보안", "안전", "사기방지"],
    helpful: 65,
  },
]

const categories = ["전체", "경매 참여", "결제", "배송", "판매", "계정", "환불/교환", "수수료", "보안"]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "전체" || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">자주 묻는 질문</h1>
          <p className="text-gray-600">궁금한 점을 빠르게 해결해보세요</p>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="질문이나 키워드를 검색하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ 목록 */}
        <div className="space-y-4 mb-8">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-600">다른 키워드로 검색해보시거나 고객센터에 문의해주세요</p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQs.map((faq) => {
              const isExpanded = expandedItems.includes(faq.id)
              return (
                <Card key={faq.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                            <span className="text-xs text-gray-500">👍 {faq.helpful}명이 도움됨</span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                          <div className="flex flex-wrap gap-1">
                            {faq.tags.map((tag) => (
                              <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="ml-4">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 border-t bg-gray-50">
                        <div className="pt-4">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                          <div className="mt-4 flex items-center gap-4">
                            <Button variant="outline" size="sm">
                              👍 도움됨
                            </Button>
                            <Button variant="outline" size="sm">
                              👎 도움안됨
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* 추가 도움말 */}
        <Card>
          <CardHeader>
            <CardTitle>원하는 답변을 찾지 못하셨나요?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SafeLink href="/help/contact">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <MessageCircle className="w-6 h-6 mb-2" />
                  <span>1:1 문의하기</span>
                </Button>
              </SafeLink>

              <SafeLink href="tel:1588-1234">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <Phone className="w-6 h-6 mb-2" />
                  <span>전화 상담</span>
                  <span className="text-xs text-gray-500">1588-1234</span>
                </Button>
              </SafeLink>

              <SafeLink href="mailto:support@marketai.com">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <Mail className="w-6 h-6 mb-2" />
                  <span>이메일 문의</span>
                  <span className="text-xs text-gray-500">support@marketai.com</span>
                </Button>
              </SafeLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
