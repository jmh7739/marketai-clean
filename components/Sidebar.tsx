"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRealStats } from "@/lib/firebase"

const categories = [
  {
    name: "전자제품",
    icon: "📱",
    subcategories: ["스마트폰", "노트북", "태블릿", "게임기", "카메라", "오디오"],
  },
  {
    name: "패션",
    icon: "👗",
    subcategories: ["여성의류", "남성의류", "신발", "가방", "액세서리", "시계"],
  },
  {
    name: "가구/인테리어",
    icon: "🏠",
    subcategories: ["침실가구", "거실가구", "주방용품", "조명", "인테리어소품", "수납용품"],
  },
  {
    name: "뷰티",
    icon: "💄",
    subcategories: ["스킨케어", "메이크업", "향수", "헤어케어", "바디케어", "네일"],
  },
  {
    name: "스포츠/레저",
    icon: "⚽",
    subcategories: ["운동기구", "골프", "등산", "자전거", "수영", "요가"],
  },
  {
    name: "예술/수집품",
    icon: "🎨",
    subcategories: ["그림", "조각", "골동품", "우표", "동전", "피규어"],
  },
]

const specialAuctions = [
  { name: "실시간 경매", href: "/live-auctions", badge: "LIVE" },
  { name: "종료 임박", href: "/ending-soon", badge: "HOT" },
  { name: "무료배송", href: "/free-shipping" },
  { name: "신규 상품", href: "/new-items" },
  { name: "인기 경매", href: "/popular" },
]

export function Sidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAuctions: 0,
    totalBids: 0,
  })

  useEffect(() => {
    // 브라우저에서만 실행
    if (typeof window !== "undefined") {
      loadStats()
    }
  }, [])

  const loadStats = async () => {
    try {
      // 브라우저에서만 Firebase 호출
      if (typeof window === "undefined") {
        return
      }

      const realStats = await getRealStats()
      setStats(realStats)
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((name) => name !== categoryName) : [...prev, categoryName],
    )
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* Categories */}
      <Card className="m-4 border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center">📂 카테고리</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {categories.map((category) => (
              <div key={category.name}>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto font-normal hover:bg-gray-50"
                  onClick={() => toggleCategory(category.name)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </div>
                  {expandedCategories.includes(category.name) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>

                {expandedCategories.includes(category.name) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/category/${encodeURIComponent(category.name)}/${encodeURIComponent(sub)}`}
                        className="block"
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-2 h-auto font-normal text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        >
                          • {sub}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Special Auctions */}
      <Card className="m-4 border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center">⭐ 특별 경매</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {specialAuctions.map((auction) => (
              <Link key={auction.name} href={auction.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto font-normal text-sm hover:bg-gray-50"
                >
                  <span>{auction.name}</span>
                  {auction.badge && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        auction.badge === "LIVE" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {auction.badge}
                    </span>
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real Stats */}
      <Card className="m-4 border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center">📊 실시간 현황</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">진행중 경매</span>
              <span className="font-semibold text-blue-600">{stats.activeAuctions || 0}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">총 회원수</span>
              <span className="font-semibold text-green-600">{stats.totalUsers || 0}명</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">총 입찰수</span>
              <span className="font-semibold text-purple-600">{stats.totalBids || 0}회</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Sidebar
