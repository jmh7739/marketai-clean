"use client"

import { useState } from "react"
import { Bell, Pin, Calendar, Eye, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SafeLink from "@/components/SafeLink"

interface Notice {
  id: number
  title: string
  content: string
  category: string
  date: string
  views: number
  isPinned: boolean
  isNew: boolean
}

const mockNotices: Notice[] = [
  {
    id: 1,
    title: "MarketAI 새해 이벤트 안내",
    content: "새해를 맞아 특별한 이벤트를 준비했습니다. 1월 한 달간 진행되는 다양한 혜택을 확인해보세요!",
    category: "이벤트",
    date: "2024-01-15",
    views: 1234,
    isPinned: true,
    isNew: true,
  },
  {
    id: 2,
    title: "시스템 점검 안내 (1월 20일 02:00-04:00)",
    content: "서비스 개선을 위한 시스템 점검이 예정되어 있습니다. 점검 시간 동안 서비스 이용이 제한됩니다.",
    category: "시스템",
    date: "2024-01-14",
    views: 856,
    isPinned: true,
    isNew: false,
  },
  {
    id: 3,
    title: "개인정보처리방침 개정 안내",
    content: "개인정보보호법 개정에 따라 개인정보처리방침이 일부 변경됩니다. 변경 내용을 확인해주세요.",
    category: "정책",
    date: "2024-01-12",
    views: 567,
    isPinned: false,
    isNew: false,
  },
  {
    id: 4,
    title: "모바일 앱 업데이트 (v2.1.0) 출시",
    content: "새로운 기능과 개선사항이 포함된 모바일 앱 업데이트가 출시되었습니다.",
    category: "업데이트",
    date: "2024-01-10",
    views: 432,
    isPinned: false,
    isNew: false,
  },
  {
    id: 5,
    title: "결제 시스템 개선 안내",
    content: "더욱 안전하고 편리한 결제를 위해 결제 시스템이 개선되었습니다.",
    category: "서비스",
    date: "2024-01-08",
    views: 321,
    isPinned: false,
    isNew: false,
  },
  {
    id: 6,
    title: "고객센터 운영시간 변경 안내",
    content: "고객센터 운영시간이 변경됩니다. 새로운 운영시간을 확인해주세요.",
    category: "서비스",
    date: "2024-01-05",
    views: 289,
    isPinned: false,
    isNew: false,
  },
]

const categories = ["전체", "이벤트", "시스템", "정책", "업데이트", "서비스"]

export default function NoticesPage() {
  const [notices] = useState<Notice[]>(mockNotices)
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [expandedNotice, setExpandedNotice] = useState<number | null>(null)

  const filteredNotices = notices.filter((notice) => {
    if (selectedCategory === "전체") return true
    return notice.category === selectedCategory
  })

  const pinnedNotices = filteredNotices.filter((notice) => notice.isPinned)
  const regularNotices = filteredNotices.filter((notice) => !notice.isPinned)

  const toggleExpanded = (id: number) => {
    setExpandedNotice(expandedNotice === id ? null : id)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "이벤트":
        return "bg-red-100 text-red-800"
      case "시스템":
        return "bg-orange-100 text-orange-800"
      case "정책":
        return "bg-blue-100 text-blue-800"
      case "업데이트":
        return "bg-green-100 text-green-800"
      case "서비스":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">공지사항</h1>
          </div>
          <p className="text-gray-600">MarketAI의 최신 소식과 중요한 안내사항을 확인하세요</p>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-6">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {/* 고정 공지사항 */}
          {pinnedNotices.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Pin className="w-5 h-5 text-red-500" />
                중요 공지
              </h2>
              <div className="space-y-3">
                {pinnedNotices.map((notice) => (
                  <Card key={notice.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleExpanded(notice.id)}
                        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Pin className="w-4 h-4 text-red-500" />
                              <Badge className={getCategoryColor(notice.category)}>{notice.category}</Badge>
                              {notice.isNew && <Badge className="bg-red-500 text-white">NEW</Badge>}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{notice.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{notice.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{notice.views.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              expandedNotice === notice.id ? "rotate-90" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {expandedNotice === notice.id && (
                        <div className="px-6 pb-6 border-t bg-gray-50">
                          <div className="pt-4">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{notice.content}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 일반 공지사항 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">전체 공지사항</h2>
            <div className="space-y-3">
              {regularNotices.map((notice) => (
                <Card key={notice.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleExpanded(notice.id)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getCategoryColor(notice.category)}>{notice.category}</Badge>
                            {notice.isNew && <Badge className="bg-red-500 text-white">NEW</Badge>}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{notice.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{notice.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{notice.views.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedNotice === notice.id ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {expandedNotice === notice.id && (
                      <div className="px-6 pb-6 border-t bg-gray-50">
                        <div className="pt-4">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{notice.content}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* 빈 상태 */}
        {filteredNotices.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">공지사항이 없습니다</h3>
              <p className="text-gray-600">선택한 카테고리에 공지사항이 없습니다</p>
            </CardContent>
          </Card>
        )}

        {/* 고객센터 링크 */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">더 궁금한 점이 있으신가요?</h3>
            <p className="text-gray-600 mb-4">공지사항에서 찾지 못한 정보는 고객센터에서 확인하세요</p>
            <div className="flex justify-center space-x-4">
              <SafeLink href="/help/faq">
                <Button variant="outline">자주 묻는 질문</Button>
              </SafeLink>
              <SafeLink href="/help/contact">
                <Button>1:1 문의하기</Button>
              </SafeLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
