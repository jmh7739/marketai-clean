"use client"

import { useState } from "react"
import { Calendar, Eye, Pin, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Notice {
  id: string
  title: string
  content: string
  type: "important" | "update" | "event" | "maintenance"
  isPinned: boolean
  views: number
  createdAt: string
  author: string
}

const notices: Notice[] = [
  {
    id: "1",
    title: "낙찰 후 구매 취소 제재 정책 안내",
    content: `안녕하세요, MarketAI입니다.

건전한 경매 문화 조성을 위해 낙찰 후 구매 취소에 대한 제재 정책을 안내드립니다.

📋 제재 정책:
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

입찰 전 신중하게 검토해주시기 바랍니다.

감사합니다.`,
    type: "important",
    isPinned: true,
    views: 1234,
    createdAt: "2024-01-15",
    author: "MarketAI 운영팀",
  },
  {
    id: "2",
    title: "수수료 정책 안내",
    content: `MarketAI의 수수료 정책을 안내드립니다.

📊 수수료 구조 (거래액 기준):
• 1만원 미만: 10%
• 1-5만원: 9%
• 5-10만원: 8%
• 10-30만원: 7%
• 30-50만원: 6.5%
• 50-100만원: 6%
• 100-300만원: 5.5%
• 300만원 이상: 5%

✅ 구매자는 수수료가 없습니다!
✅ 상품 등록 시에는 수수료가 없습니다!

수수료는 구매확정 후 7일 뒤 정산 시 차감됩니다.`,
    type: "update",
    isPinned: true,
    views: 987,
    createdAt: "2024-01-10",
    author: "MarketAI 운영팀",
  },
  {
    id: "3",
    title: "계정 보안 강화 안내",
    content: `계정 보안 강화를 위한 정책 변경을 안내드립니다.

🔐 로그인 보안:
- 5회 연속 로그인 실패 시 24시간 계정 잠금
- 잠금 해제는 본인 인증 또는 비밀번호 재설정으로 가능

🔑 비밀번호 정책:
- 최소 8자 이상
- 숫자, 특수문자 포함 필수
- 정기적인 비밀번호 변경 권장

📱 본인 인증:
- 전화번호 인증 필수
- 고액 거래 시 추가 인증 요구

안전한 거래를 위해 협조 부탁드립니다.`,
    type: "important",
    isPinned: false,
    views: 756,
    createdAt: "2024-01-08",
    author: "MarketAI 보안팀",
  },
  {
    id: "4",
    title: "신규 카테고리 추가 안내",
    content: `사용자 편의를 위해 새로운 카테고리 기능을 추가했습니다.

✨ 새로운 기능:
- 모든 대분류에 "기타" 카테고리 추가
- 소분류에 "기타 (직접입력)" 옵션 제공
- 사용자가 직접 카테고리명 입력 가능

📝 상품 상태:
- 기존 옵션 외에 "기타 (직접입력)" 추가
- 더욱 정확한 상품 상태 표시 가능

더욱 편리해진 상품 등록을 경험해보세요!`,
    type: "update",
    isPinned: false,
    views: 543,
    createdAt: "2024-01-05",
    author: "MarketAI 개발팀",
  },
  {
    id: "5",
    title: "설 연휴 고객센터 운영 안내",
    content: `설 연휴 기간 고객센터 운영 시간을 안내드립니다.

📅 운영 일정:
- 2월 9일(금): 정상 운영 (09:00-18:00)
- 2월 10일(토) ~ 2월 12일(월): 휴무
- 2월 13일(화): 정상 운영 재개

📞 긴급 문의:
- 이메일: support@marketai.com
- 24시간 접수 가능 (답변은 운영 재개 후)

🎊 새해 복 많이 받으세요!`,
    type: "event",
    isPinned: false,
    views: 432,
    createdAt: "2024-01-03",
    author: "MarketAI 고객센터",
  },
]

const typeLabels = {
  important: "중요",
  update: "업데이트",
  event: "이벤트",
  maintenance: "점검",
}

const typeColors = {
  important: "bg-red-100 text-red-800",
  update: "bg-blue-100 text-blue-800",
  event: "bg-green-100 text-green-800",
  maintenance: "bg-yellow-100 text-yellow-800",
}

export default function NoticesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const pinnedNotices = filteredNotices.filter((notice) => notice.isPinned)
  const regularNotices = filteredNotices.filter((notice) => !notice.isPinned)

  if (selectedNotice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-4">
            <Button variant="outline" onClick={() => setSelectedNotice(null)}>
              ← 목록으로 돌아가기
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {selectedNotice.isPinned && <Pin className="w-4 h-4 text-red-500" />}
                <Badge className={typeColors[selectedNotice.type]}>{typeLabels[selectedNotice.type]}</Badge>
              </div>
              <CardTitle className="text-2xl">{selectedNotice.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedNotice.createdAt}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {selectedNotice.views.toLocaleString()}
                </div>
                <span>{selectedNotice.author}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">{selectedNotice.content}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">공지사항</h1>
          <p className="text-gray-600">MarketAI의 최신 소식과 정책을 확인하세요</p>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="공지사항을 검색하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* 고정 공지사항 */}
        {pinnedNotices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Pin className="w-5 h-5 text-red-500" />
              중요 공지
            </h2>
            <div className="space-y-3">
              {pinnedNotices.map((notice) => (
                <Card
                  key={notice.id}
                  className="border-red-200 bg-red-50 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-4" onClick={() => setSelectedNotice(notice)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Pin className="w-4 h-4 text-red-500" />
                          <Badge className={typeColors[notice.type]}>{typeLabels[notice.type]}</Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{notice.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{notice.createdAt}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {notice.views.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 일반 공지사항 */}
        <div className="space-y-3">
          {regularNotices.map((notice) => (
            <Card key={notice.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4" onClick={() => setSelectedNotice(notice)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={typeColors[notice.type]}>{typeLabels[notice.type]}</Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{notice.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{notice.createdAt}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {notice.views.toLocaleString()}
                      </span>
                      <span>{notice.author}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotices.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 키워드로 검색해보세요</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
