"use client"

import { useState } from "react"
import { Search, Filter, X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

interface SearchFilters {
  keyword: string
  category: string
  subCategory: string
  condition: string[]
  priceRange: [number, number]
  location: string
  seller: string
  timeLeft: string
  sortBy: string
  hasImages: boolean
  freeShipping: boolean
  instantBuy: boolean
}

const categories = {
  전자제품: ["스마트폰", "노트북", "태블릿", "카메라", "게임기", "오디오"],
  "패션/의류": ["상의", "하의", "아우터", "신발", "가방", "액세서리"],
  "뷰티/화장품": ["스킨케어", "메이크업", "향수", "헤어케어"],
  "자동차/오토바이": ["승용차", "SUV", "오토바이", "자동차용품"],
}

const conditions = [
  { id: "new", label: "새 상품" },
  { id: "like-new", label: "거의 새 것" },
  { id: "good", label: "좋음" },
  { id: "fair", label: "보통" },
  { id: "poor", label: "나쁨" },
]

const locations = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
]

export default function AdvancedSearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: "",
    category: "전체",
    subCategory: "",
    condition: [],
    priceRange: [0, 5000000],
    location: "전체",
    seller: "",
    timeLeft: "전체",
    sortBy: "relevance",
    hasImages: false,
    freeShipping: false,
    instantBuy: false,
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleConditionChange = (conditionId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      condition: checked ? [...prev.condition, conditionId] : prev.condition.filter((c) => c !== conditionId),
    }))
  }

  const handleSearch = () => {
    // 검색 로직 구현
    console.log("Search with filters:", filters)
    // 실제로는 검색 결과 페이지로 이동
    window.location.href = `/search?${new URLSearchParams(filters as any).toString()}`
  }

  const resetFilters = () => {
    setFilters({
      keyword: "",
      category: "전체",
      subCategory: "",
      condition: [],
      priceRange: [0, 5000000],
      location: "전체",
      seller: "",
      timeLeft: "전체",
      sortBy: "relevance",
      hasImages: false,
      freeShipping: false,
      instantBuy: false,
    })
    setActiveFilters([])
  }

  const removeFilter = (filterKey: string) => {
    // 특정 필터 제거 로직
    setActiveFilters((prev) => prev.filter((f) => f !== filterKey))
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.keyword) count++
    if (filters.category !== "전체") count++
    if (filters.condition.length > 0) count++
    if (filters.location !== "전체") count++
    if (filters.seller) count++
    if (filters.timeLeft !== "전체") count++
    if (filters.hasImages) count++
    if (filters.freeShipping) count++
    if (filters.instantBuy) count++
    return count
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">고급 검색</h1>
          <p className="text-gray-600">원하는 조건으로 정확한 상품을 찾아보세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 검색 필터 사이드바 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    검색 필터
                  </CardTitle>
                  {getActiveFiltersCount() > 0 && (
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      <X className="w-4 h-4 mr-1" />
                      초기화
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 키워드 검색 */}
                <div>
                  <Label htmlFor="keyword" className="text-sm font-medium mb-2 block">
                    키워드
                  </Label>
                  <Input
                    id="keyword"
                    placeholder="상품명, 브랜드, 모델명 등"
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange("keyword", e.target.value)}
                  />
                </div>

                {/* 카테고리 */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">카테고리</Label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="전체">전체</SelectItem>
                      {Object.keys(categories).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* 서브 카테고리 */}
                  {filters.category && (
                    <Select
                      value={filters.subCategory}
                      onValueChange={(value) => handleFilterChange("subCategory", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="세부 카테고리" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="전체">전체</SelectItem>
                        {categories[filters.category as keyof typeof categories]?.map((subCategory) => (
                          <SelectItem key={subCategory} value={subCategory}>
                            {subCategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* 상품 상태 */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">상품 상태</Label>
                  <div className="space-y-2">
                    {conditions.map((condition) => (
                      <div key={condition.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition.id}
                          checked={filters.condition.includes(condition.id)}
                          onCheckedChange={(checked) => handleConditionChange(condition.id, checked as boolean)}
                        />
                        <Label htmlFor={condition.id} className="text-sm cursor-pointer">
                          {condition.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 가격 범위 */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    가격 범위: ₩{filters.priceRange[0].toLocaleString()} - ₩{filters.priceRange[1].toLocaleString()}
                  </Label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange("priceRange", value)}
                    max={5000000}
                    step={50000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₩0</span>
                    <span>₩5,000,000+</span>
                  </div>
                </div>

                {/* 지역 */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">지역</Label>
                  <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="전체">전체</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 판매자 */}
                <div>
                  <Label htmlFor="seller" className="text-sm font-medium mb-2 block">
                    판매자
                  </Label>
                  <Input
                    id="seller"
                    placeholder="판매자 닉네임"
                    value={filters.seller}
                    onChange={(e) => handleFilterChange("seller", e.target.value)}
                  />
                </div>

                {/* 남은 시간 */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">남은 시간</Label>
                  <Select value={filters.timeLeft} onValueChange={(value) => handleFilterChange("timeLeft", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="시간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="전체">전체</SelectItem>
                      <SelectItem value="1hour">1시간 이내</SelectItem>
                      <SelectItem value="6hours">6시간 이내</SelectItem>
                      <SelectItem value="1day">1일 이내</SelectItem>
                      <SelectItem value="3days">3일 이내</SelectItem>
                      <SelectItem value="7days">7일 이내</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 추가 옵션 */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">추가 옵션</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasImages"
                        checked={filters.hasImages}
                        onCheckedChange={(checked) => handleFilterChange("hasImages", checked)}
                      />
                      <Label htmlFor="hasImages" className="text-sm cursor-pointer">
                        사진 있는 상품만
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="freeShipping"
                        checked={filters.freeShipping}
                        onCheckedChange={(checked) => handleFilterChange("freeShipping", checked)}
                      />
                      <Label htmlFor="freeShipping" className="text-sm cursor-pointer">
                        무료배송
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="instantBuy"
                        checked={filters.instantBuy}
                        onCheckedChange={(checked) => handleFilterChange("instantBuy", checked)}
                      />
                      <Label htmlFor="instantBuy" className="text-sm cursor-pointer">
                        즉시구매 가능
                      </Label>
                    </div>
                  </div>
                </div>

                {/* 검색 버튼 */}
                <Button onClick={handleSearch} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  검색하기
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 검색 결과 영역 */}
          <div className="lg:col-span-3">
            {/* 활성 필터 표시 */}
            {getActiveFiltersCount() > 0 && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">적용된 필터 ({getActiveFiltersCount()}개)</h3>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      모두 제거
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.keyword && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        키워드: {filters.keyword}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange("keyword", "")} />
                      </Badge>
                    )}
                    {filters.category !== "전체" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {filters.category}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange("category", "전체")} />
                      </Badge>
                    )}
                    {filters.condition.length > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        상태: {filters.condition.length}개
                        <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange("condition", [])} />
                      </Badge>
                    )}
                    {filters.location !== "전체" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {filters.location}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange("location", "전체")} />
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 정렬 옵션 */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">검색 결과를 확인하려면 검색 버튼을 클릭하세요</div>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">관련도순</SelectItem>
                  <SelectItem value="price-low">낮은가격순</SelectItem>
                  <SelectItem value="price-high">높은가격순</SelectItem>
                  <SelectItem value="ending-soon">마감임박순</SelectItem>
                  <SelectItem value="newest">최신등록순</SelectItem>
                  <SelectItem value="popular">인기순</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 검색 결과 플레이스홀더 */}
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">검색 조건을 설정하고 검색해보세요</h3>
                <p className="text-gray-600">왼쪽 필터를 사용해서 원하는 상품을 정확히 찾을 수 있습니다</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
