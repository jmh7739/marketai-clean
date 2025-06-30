"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/utils"
import SafeLink from "@/components/SafeLink"

export default function Sidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-16 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">카테고리</h2>

        <div className="space-y-1">
          {categories.map((category) => (
            <div key={category.id}>
              <div className="flex items-center">
                <Button variant="ghost" className="flex-1 justify-start px-2 py-1 h-auto text-sm" asChild>
                  <SafeLink href={`/category/${category.slug}`}>
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </SafeLink>
                </Button>

                {category.subcategories && category.subcategories.length > 0 && (
                  <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={() => toggleCategory(category.id)}>
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>

              {/* 하위 카테고리 */}
              {category.subcategories &&
                expandedCategories.includes(category.id) &&
                category.subcategories.map((subcategory) => (
                  <Button
                    key={subcategory.id}
                    variant="ghost"
                    className="w-full justify-start pl-8 py-1 h-auto text-sm text-gray-600"
                    asChild
                  >
                    <SafeLink href={`/category/${category.slug}/${subcategory.slug}`}>{subcategory.name}</SafeLink>
                  </Button>
                ))}
            </div>
          ))}
        </div>

        {/* 빠른 링크 */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-900 mb-3">빠른 링크</h3>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-sm" asChild>
              <SafeLink href="/live-auctions">🔴 실시간 경매</SafeLink>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm" asChild>
              <SafeLink href="/ending-soon">⏰ 마감임박</SafeLink>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm" asChild>
              <SafeLink href="/search?buyNowOnly=true">⚡ 즉시구매</SafeLink>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm" asChild>
              <SafeLink href="/local-trade">📍 직거래</SafeLink>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
