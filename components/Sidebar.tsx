"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Gavel, Clock, TrendingUp, Star, MapPin } from "lucide-react"
import SafeLink from "@/components/SafeLink"

const categories = [
  {
    name: "전자제품",
    icon: "📱",
    subcategories: ["스마트폰", "노트북/PC", "태블릿", "카메라", "게임기", "오디오"],
  },
  {
    name: "패션/의류",
    icon: "👕",
    subcategories: ["남성의류", "여성의류", "신발", "가방", "시계", "액세서리"],
  },
  {
    name: "뷰티/화장품",
    icon: "💄",
    subcategories: ["스킨케어", "메이크업", "향수", "헤어케어", "바디케어"],
  },
  {
    name: "자동차/오토바이",
    icon: "🚗",
    subcategories: ["승용차", "SUV", "오토바이", "자동차용품", "타이어/휠"],
  },
  {
    name: "도서/음반/DVD",
    icon: "📚",
    subcategories: ["소설/에세이", "자기계발", "전문서적", "만화", "음반/CD", "DVD/블루레이"],
  },
  {
    name: "홈&리빙",
    icon: "🏠",
    subcategories: ["가구", "인테리어", "주방용품", "생활용품", "침구/수납"],
  },
  {
    name: "유아동",
    icon: "🧸",
    subcategories: ["의류", "장난감", "도서", "용품", "유모차/카시트"],
  },
  {
    name: "스포츠/레저",
    icon: "⚽",
    subcategories: ["운동복", "운동화", "운동기구", "아웃도어", "골프", "자전거"],
  },
  {
    name: "반려동물",
    icon: "🐕",
    subcategories: ["사료/간식", "용품", "의류", "장난감", "건강관리"],
  },
  {
    name: "기타",
    icon: "📦",
    subcategories: ["수집품", "예술품", "악기", "문구/사무용품", "기타"],
  },
]

const quickMenus = [
  { name: "실시간 경매", icon: Gavel, href: "/live-auctions", color: "text-red-600" },
  { name: "마감임박", icon: Clock, href: "/ending-soon", color: "text-orange-600" },
  { name: "인기경매", icon: TrendingUp, href: "/trending", color: "text-blue-600" },
  { name: "프리미엄", icon: Star, href: "/premium", color: "text-purple-600" },
  { name: "지역거래", icon: MapPin, href: "/local", color: "text-green-600" },
]

export default function Sidebar() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName)
  }

  return (
    <div className="h-full bg-white">
      <div className="p-4">
        {/* 빠른 메뉴 */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">빠른 메뉴</h3>
          <div className="space-y-1">
            {quickMenus.map((menu) => (
              <SafeLink key={menu.name} href={menu.href}>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                  <menu.icon className={`w-4 h-4 ${menu.color}`} />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{menu.name}</span>
                </div>
              </SafeLink>
            ))}
          </div>
        </div>

        {/* 카테고리 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">카테고리</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <div key={category.name}>
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{category.name}</span>
                  </div>
                  {expandedCategory === category.name ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedCategory === category.name && (
                  <div className="ml-6 mt-1 space-y-1">
                    {category.subcategories.map((sub) => (
                      <SafeLink key={sub} href={`/category/${category.name}/${sub}`}>
                        <div className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <span className="text-sm text-gray-600 hover:text-gray-900">{sub}</span>
                        </div>
                      </SafeLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
