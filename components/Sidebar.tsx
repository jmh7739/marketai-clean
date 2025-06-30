"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"

const categories = [
  {
    name: "전자제품",
    slug: "electronics",
    subcategories: [
      { name: "스마트폰", slug: "smartphones" },
      { name: "노트북", slug: "laptops" },
      { name: "태블릿", slug: "tablets" },
      { name: "카메라", slug: "cameras" },
      { name: "게임기", slug: "gaming" },
    ],
  },
  {
    name: "패션",
    slug: "fashion",
    subcategories: [
      { name: "남성의류", slug: "mens-clothing" },
      { name: "여성의류", slug: "womens-clothing" },
      { name: "신발", slug: "shoes" },
      { name: "가방", slug: "bags" },
      { name: "액세서리", slug: "accessories" },
    ],
  },
  {
    name: "가구/인테리어",
    slug: "furniture",
    subcategories: [
      { name: "침실가구", slug: "bedroom" },
      { name: "거실가구", slug: "living-room" },
      { name: "주방가구", slug: "kitchen" },
      { name: "사무용가구", slug: "office" },
      { name: "조명", slug: "lighting" },
    ],
  },
  {
    name: "자동차",
    slug: "automotive",
    subcategories: [
      { name: "승용차", slug: "cars" },
      { name: "오토바이", slug: "motorcycles" },
      { name: "자동차용품", slug: "car-accessories" },
      { name: "타이어/휠", slug: "tires-wheels" },
    ],
  },
  {
    name: "스포츠/레저",
    slug: "sports",
    subcategories: [
      { name: "헬스/피트니스", slug: "fitness" },
      { name: "골프", slug: "golf" },
      { name: "자전거", slug: "bicycles" },
      { name: "캠핑", slug: "camping" },
      { name: "낚시", slug: "fishing" },
    ],
  },
  {
    name: "도서/음반",
    slug: "books-media",
    subcategories: [
      { name: "도서", slug: "books" },
      { name: "음반/CD", slug: "music" },
      { name: "DVD/블루레이", slug: "movies" },
      { name: "게임", slug: "games" },
    ],
  },
]

export default function Sidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))
  }

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">카테고리</h2>
        <nav className="space-y-1">
          {categories.map((category) => (
            <div key={category.slug}>
              <button
                onClick={() => toggleCategory(category.slug)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span>{category.name}</span>
                {expandedCategories.includes(category.slug) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedCategories.includes(category.slug) && (
                <div className="ml-4 mt-1 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.slug}
                      href={`/category/${category.slug}/${subcategory.slug}`}
                      className="block px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
