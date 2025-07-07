"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Grid, List, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const categoryNames = {
  electronics: "전자제품",
  fashion: "패션/의류",
  beauty: "뷰티/화장품",
  sports: "스포츠/레저",
  books: "도서/음반",
  home: "생활/가전",
  auto: "자동차/오토바이",
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("ending-soon")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const categoryName = categoryNames[slug as keyof typeof categoryNames] || "카테고리"

  useEffect(() => {
    // 실제 카테고리 상품 로드
    const loadCategoryProducts = async () => {
      setLoading(true)
      try {
        // 실제로는 Firestore에서 카테고리별 상품을 가져올 예정
        const categoryProducts = []
        setProducts(categoryProducts)
      } catch (error) {
        console.error("카테고리 상품 로드 실패:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCategoryProducts()
  }, [slug])

  const conditions = ["새 상품", "거의 새 것", "좋음", "보통", "나쁨"]

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setSelectedConditions([...selectedConditions, condition])
    } else {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName}</h1>
          <p className="text-gray-600">{products.length}개의 상품이 있습니다</p>
        </div>

        <div className="flex gap-8">
          {/* 사이드바 필터 */}
          <div className="w-64 space-y-6">
            {/* 검색 */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">검색</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="상품명 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 가격 범위 */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">가격 범위</h3>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="최소가격"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    />
                    <Input
                      placeholder="최대가격"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    />
                  </div>
                  <Button variant="outline" className="w-full">
                    적용
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 상품 상태 */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">상품 상태</h3>
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={selectedConditions.includes(condition)}
                        onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                      />
                      <label htmlFor={condition} className="text-sm cursor-pointer">
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="flex-1">
            {/* 정렬 및 뷰 옵션 */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ending-soon">마감임박순</SelectItem>
                    <SelectItem value="newest">새로등록순</SelectItem>
                    <SelectItem value="price-low">낮은가격순</SelectItem>
                    <SelectItem value="price-high">높은가격순</SelectItem>
                    <SelectItem value="popular">인기순</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 상품 목록 */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {/* 실제 상품 데이터가 있을 때 표시 */}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Filter className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{categoryName}에 등록된 상품이 없습니다</h3>
                <p className="text-gray-600 mb-6">첫 번째 상품을 등록해보세요!</p>
                <Button>상품 등록하기</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
