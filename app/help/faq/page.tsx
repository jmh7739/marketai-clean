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
    answer: `경매 참여는 매우 간단합니다:

1. 회원가입 후 로그인
2. 원하는 상품 클릭
3. '입찰하기' 버튼 클릭
4. 입찰가 입력 후 확인

⚠️ 주의사항:
- 입찰 시 현재 최고가보다 높은 금액을 입력해야 합니다
- 입찰 후에는 취소가 불가능합니다
- 낙찰 시 반드시 구매해야 하며, 구매 취소 시 제재를 받습니다`,
    tags: ["입찰", "경매", "참여방법"],
    helpful: 245,
  },
  {
    id: "2",
    category: "수수료",
    question: "수수료는 얼마인가요?",
    answer: `MarketAI의 수수료는 거래액에 따라 차등 적용됩니다:

📊 수수료 구조:
• 1만원 미만: 10%
• 1-5만원: 9%
• 5-10만원: 8%
• 10-30만원: 7%
• 30-50만원: 6.5%
• 50-100만원: 6%
• 100-300만원: 5.5%
• 300만원 이상: 5%

💡 예시:
- 50,000원 낙찰 → 수수료 4,500원
- 200,000원 낙찰 → 수수료 14,000원
- 1,000,000원 낙찰 → 수수료 60,000원

✅ 구매자는 수수료가 없습니다!
✅ 상품 등록 시에는 수수료가 없습니다!`,
    tags: ["수수료", "비용", "정산"],
    helpful: 189,
  },
  {
    id: "3",
    category: "구매 취소",
    question: "낙찰 후 구매를 취소할 수 있나요?",
    answer: `⚠️ 낙찰 후 단순 변심으로 인한 구매 취소는 제재 대상입니다.

🚨 제재 단계:
• 1회 취소: 경고
• 2회 취소: 7일 이용 정지
• 3회 취소: 30일 이용 정지  
• 4회 이상: 영구 이용 정지

📅 제재 기록 초기화:
- 6개월 동안 추가 위반이 없으면 제재 횟수가 초기화됩니다

✅ 예외 상황:
- 상품이 설명과 다른 경우
- 상품에 하자가 있는 경우
- 판매자가 배송하지 않는 경우

💡 입찰 전 신중하게 검토해주세요!`,
    tags: ["구매취소", "제재", "환불"],
    helpful: 156,
  },
  {
    id: "4",
    category: "경매 방법",
    question: "경매는 어떻게 진행되나요?",
    answer: `📋 경매 진행 과정:

1️⃣ 상품 등록
- 판매자가 상품 정보, 시작가, 경매 기간 설정
- 즉시구매가 설정 가능 (선택사항)

2️⃣ 경매 진행
- 설정된 기간 동안 입찰 진행
- 실시간으로 최고가 업데이트
- 마감 10분 전 입찰 시 5분 연장

3️⃣ 낙찰 결정
- 경매 종료 시 최고 입찰자가 낙찰
- 즉시구매가로 구매 시 경매 즉시 종료

4️⃣ 거래 완료
- 낙찰자는 24시간 내 결제
- 판매자는 결제 확인 후 48시간 내 발송
- 구매자 수령 후 구매확정

🎯 프록시 입찰:
- 최대 입찰가를 미리 설정
- 다른 입찰자가 나타나면 자동으로 입찰
- 설정한 최대가 내에서만 자동 입찰`,
    tags: ["경매방법", "진행과정", "프록시입찰"],
    helpful: 134,
  },
  {
    id: "5",
    category: "결제",
    question: "결제는 어떻게 하나요?",
    answer: `💳 결제 방법:

✅ 지원 결제 수단:
- 계좌이체 (모든 은행)
- 가상계좌 입금
- 카드결제 (토스페이먼츠)

⏰ 결제 기한:
- 낙찰 후 24시간 이내 결제 필수
- 기한 내 미결제 시 낙찰 취소 및 제재

🔒 안전한 거래:
- 모든 결제는 에스크로 시스템 적용
- 구매확정 전까지 판매자에게 입금되지 않음
- 문제 발생 시 100% 환불 보장

📱 결제 과정:
1. 낙찰 알림 수신
2. 결제 페이지 접속
3. 결제 수단 선택
4. 결제 완료
5. 판매자에게 발송 요청`,
    tags: ["결제", "계좌이체", "에스크로"],
    helpful: 98,
  },
  {
    id: "6",
    category: "배송",
    question: "배송은 어떻게 되나요?",
    answer: `📦 배송 정책:

💰 배송비:
- 판매자가 배송비 정책 결정
- 무료배송 또는 착불 중 선택
- 제주/도서산간 추가 배송비 있을 수 있음

📅 배송 일정:
- 결제 확인 후 48시간 내 발송
- 운송장 등록 시 실시간 추적 가능
- 평균 배송 기간: 2-3일

📍 배송 추적:
- 운송장 번호로 실시간 위치 확인
- 배송 단계별 알림 발송
- 배송 완료 시 자동 알림

🚚 배송 방법:
- 일반택배 (CJ대한통운, 한진택배 등)
- 편의점택배
- 직거래 (안전거래존 이용)`,
    tags: ["배송", "발송", "운송장"],
    helpful: 87,
  },
  {
    id: "7",
    category: "계정 보안",
    question: "로그인이 안 되는데 어떻게 하나요?",
    answer: `🔐 로그인 문제 해결:

❌ 로그인 실패 시:
- 5회 연속 실패 시 10분간 계정 잠금
- 잠금 해제는 본인 인증 또는 비밀번호 재설정으로 가능

🔑 비밀번호 재설정:
1. 로그인 페이지에서 '비밀번호 찾기' 클릭
2. 가입 시 등록한 전화번호 입력
3. SMS 인증번호 입력
4. 새 비밀번호 설정

📱 본인 인증:
1. 고객센터 1588-1234 연락
2. 본인 확인 절차 진행
3. 계정 잠금 즉시 해제

💡 보안 팁:
- 정기적으로 비밀번호 변경
- 타인과 계정 정보 공유 금지
- 공용 컴퓨터에서 로그아웃 필수`,
    tags: ["로그인", "비밀번호", "계정잠금"],
    helpful: 76,
  },
  {
    id: "8",
    category: "구매확정",
    question: "구매확정은 언제 해야 하나요?",
    answer: `✅ 구매확정 정책:

⏰ 확정 기간:
- 운송장 등록된 경우: 배송완료 후 평일 기준 7일
- 운송장 미등록된 경우: 경매종료 후 30일
- 구매자가 언제든 수동으로 확정 가능

🚚 운송장 등록 효과:
- 등록 시: 빠른 자동확정 (7일)
- 미등록 시: 늦은 자동확정 (30일)
- 판매자에게 운송장 등록 유도 효과

💰 정산 일정:
- 구매확정 후 7일 뒤 판매자에게 정산
- 매주 금요일 일괄 정산 처리
- 수수료 차감 후 입금

⚠️ 주의사항:
- 상품에 문제가 있으면 확정 전 신고
- 확정 후에는 환불/교환 어려움
- 자동확정 전 충분히 검수하세요`,
    tags: ["구매확정", "자동확정", "정산"],
    helpful: 65,
  },
]

const categories = ["전체", "경매 참여", "수수료", "구매 취소", "경매 방법", "결제", "배송", "계정 보안", "구매확정"]

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

        {/* 중요 공지 */}
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="text-red-500 mt-1">⚠️</div>
              <div>
                <h3 className="font-semibold text-red-800 mb-2">중요 공지사항</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• 낙찰 후 단순 변심으로 인한 구매 취소 시 제재를 받습니다</li>
                  <li>• 제재 횟수는 6개월 후 초기화됩니다</li>
                  <li>• 로그인 5회 실패 시 10분간 계정 잠금됩니다</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

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
                          <div className="text-gray-700 leading-relaxed whitespace-pre-line">{faq.answer}</div>
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
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center bg-transparent"
                >
                  <MessageCircle className="w-6 h-6 mb-2" />
                  <span>1:1 문의하기</span>
                </Button>
              </SafeLink>

              <SafeLink href="tel:1588-1234">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center bg-transparent"
                >
                  <Phone className="w-6 h-6 mb-2" />
                  <span>전화 상담</span>
                  <span className="text-xs text-gray-500">1588-1234</span>
                </Button>
              </SafeLink>

              <SafeLink href="mailto:support@marketai.com">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center bg-transparent"
                >
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
