"use client"

import type React from "react"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Home,
  Smartphone,
  Shirt,
  Gem,
  Car,
  Book,
  Sofa,
  Baby,
  Dumbbell,
  Palette,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SafeLink from "@/components/SafeLink"

interface SubCategory {
  name: string
  slug: string
  icon?: React.ComponentType<{ className?: string }>
}

interface Category {
  name: string
  slug: string
  icon: React.ComponentType<{ className?: string }>
  subCategories: SubCategory[]
}

const categories: Category[] = [
  {
    name: "전자제품",
    slug: "electronics",
    icon: Smartphone,
    subCategories: [
      { name: "스마트폰", slug: "smartphones" },
      { name: "노트북/PC", slug: "computers" },
      { name: "태블릿", slug: "tablets" },
      { name: "카메라", slug: "cameras" },
      { name: "게임기", slug: "gaming" },
      { name: "오디오", slug: "audio" },
      { name: "웨어러블", slug: "wearables" },
      { name: "기타 전자제품", slug: "other-electronics" },
    ],
  },
  {
    name: "패션/의류",
    slug: "fashion",
    icon: Shirt,
    subCategories: [
      { name: "남성의류", slug: "mens-clothing" },
      { name: "여성의류", slug: "womens-clothing" },
      { name: "신발", slug: "shoes" },
      { name: "가방", slug: "bags" },
      { name: "시계", slug: "watches" },
      { name: "액세서리", slug: "accessories" },
      { name: "아동복", slug: "kids-clothing" },
    ],
  },
  {
    name: "뷰티/화장품",
    slug: "beauty",
    icon: Gem,
    subCategories: [
      { name: "스킨케어", slug: "skincare" },
      { name: "메이크업", slug: "makeup" },
      { name: "향수", slug: "perfume" },
      { name: "헤어케어", slug: "haircare" },
      { name: "바디케어", slug: "bodycare" },
      { name: "네일", slug: "nail" },
    ],
  },
  {
    name: "자동차/오토바이",
    slug: "automotive",
    icon: Car,
    subCategories: [
      { name: "승용차", slug: "cars" },
      { name: "SUV", slug: "suv" },
      { name: "오토바이", slug: "motorcycles" },
      { name: "자동차용품", slug: "car-accessories" },
      { name: "타이어/휠", slug: "tires-wheels" },
    ],
  },
  {
    name: "도서/음반/DVD",
    slug: "books-media",
    icon: Book,
    subCategories: [
      { name: "소설/에세이", slug: "novels" },
      { name: "자기계발", slug: "self-help" },
      { name: "전문서적", slug: "professional" },
      { name: "만화", slug: "comics" },
      { name: "음반/CD", slug: "music" },
      { name: "DVD/블루레이", slug: "movies" },
    ],
  },
  {
    name: "가구/인테리어",
    slug: "furniture",
    icon: Sofa,
    subCategories: [
      { name: "침실가구", slug: "bedroom" },
      { name: "거실가구", slug: "living-room" },
      { name: "주방가구", slug: "kitchen" },
      { name: "사무용가구", slug: "office" },
      { name: "조명", slug: "lighting" },
      { name: "인테리어소품", slug: "decor" },
    ],
  },
  {
    name: "유아동/출산",
    slug: "baby-kids",
    icon: Baby,
    subCategories: [
      { name: "유아용품", slug: "baby-items" },
      { name: "아동의류", slug: "kids-clothes" },
      { name: "장난감", slug: "toys" },
      { name: "출산용품", slug: "maternity" },
      { name: "유모차/카시트", slug: "strollers-carseats" },
    ],
  },
  {
    name: "스포츠/레저",
    slug: "sports",
    icon: Dumbbell,
    subCategories: [
      { name: "헬스/요가", slug: "fitness" },
      { name: "골프", slug: "golf" },
      { name: "등산/캠핑", slug: "outdoor" },
      { name: "자전거", slug: "bicycles" },
      { name: "수영/수상스포츠", slug: "water-sports" },
      { name: "구기스포츠", slug: "ball-sports" },
    ],
  },
  {
    name: "취미/수집품",
    slug: "hobbies",
    icon: Palette,
    subCategories: [
      { name: "수집품", slug: "collectibles" },
      { name: "미술용품", slug: "art-supplies" },
      { name: "악기", slug: "instruments" },
      { name: "모형/프라모델", slug: "models" },
      { name: "보드게임", slug: "board-games" },
    ],
  },
  {
    name: "공구/산업용품",
    slug: "tools",
    icon: Wrench,
    subCategories: [
      { name: "전동공구", slug: "power-tools" },
      { name: "수공구", slug: "hand-tools" },
      { name: "측정기기", slug: "measuring" },
      { name: "안전용품", slug: "safety" },
      { name: "산업장비", slug: "industrial" },
    ],
  },
]

const Sidebar = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => (prev.includes(slug) ? prev.filter((cat) => cat !== slug) : [...prev, slug]))
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">카테고리</h2>

        {/* 홈 링크 */}
        <SafeLink href="/" className="block mb-4">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="w-4 h-4 mr-3" />홈
          </Button>
        </SafeLink>

        {/* 카테고리 목록 */}
        <div className="space-y-2">
          {categories.map((category) => {
            const isExpanded = expandedCategories.includes(category.slug)
            const Icon = category.icon

            return (
              <div key={category.slug}>
                {/* 메인 카테고리 */}
                <div className="flex items-center">
                  <SafeLink href={`/category/${category.slug}`} className="flex-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <Icon className="w-4 h-4 mr-3" />
                      {category.name}
                    </Button>
                  </SafeLink>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategory(category.slug)}
                    className="p-1 h-8 w-8"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </div>

                {/* 서브 카테고리 */}
                {isExpanded && (
                  <div className="ml-6 mt-2 space-y-1">
                    {category.subCategories.map((subCategory) => (
                      <SafeLink key={subCategory.slug} href={`/category/${category.slug}/${subCategory.slug}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-sm text-gray-600 hover:text-gray-900"
                        >
                          {subCategory.name}
                        </Button>
                      </SafeLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 빠른 링크 */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">빠른 메뉴</h3>
            <div className="space-y-2">
              <SafeLink href="/live-auctions">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  🔥 실시간 경매
                </Button>
              </SafeLink>
              <SafeLink href="/ending-soon">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  ⏰ 마감임박
                </Button>
              </SafeLink>
              <SafeLink href="/new-arrivals">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  ✨ 신규등록
                </Button>
              </SafeLink>
              <SafeLink href="/popular">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  📈 인기상품
                </Button>
              </SafeLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Sidebar
