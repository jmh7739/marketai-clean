"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Filter, X, Star, Search } from "lucide-react"

interface FilterState {
  priceRange: [number, number]
  categories: string[]
  condition: string[]
  location: string
  rating: number
  shipping: string[]
  seller: string[]
  timeLeft: string
  sortBy: string
  features: string[]
}

interface AdvancedSearchFilterProps {
  onFilterChange: (filters: FilterState) => void
  onSearch: (query: string) => void
}

export default function AdvancedSearchFilter({ onFilterChange, onSearch }: AdvancedSearchFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000000],
    categories: [],
    condition: [],
    location: "",
    rating: 0,
    shipping: [],
    seller: [],
    timeLeft: "",
    sortBy: "relevance",
    features: [],
  })

  const categories = ["전자제품", "패션/의류", "홈&리빙", "스포츠/레저", "뷰티/미용", "유아동", "도서/음반", "자동차"]

  const conditions = ["새상품", "거의새것", "사용감있음", "고장/파손"]

  const locations = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기",
    "강원",
    "충북",
    "충남",
    "전북",
    "전남",
    "경북",
    "경남",
    "제주",
  ]

  const shippingOptions = ["무료배송", "당일배송", "익일배송", "직거래가능"]

  const sellerTypes = ["개인판매자", "전문판매자", "인증판매자", "파워셀러"]

  const specialFeatures = ["AI 가격 예측", "실시간 경매", "즉시구매 가능", "교환 가능", "A/S 가능"]

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      priceRange: [0, 5000000],
      categories: [],
      condition: [],
      location: "",
      rating: 0,
      shipping: [],
      seller: [],
      timeLeft: "",
      sortBy: "relevance",
      features: [],
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.condition.length > 0) count++
    if (filters.location) count++
    if (filters.rating > 0) count++
    if (filters.shipping.length > 0) count++
    if (filters.seller.length > 0) count++
    if (filters.timeLeft) count++
    if (filters.features.length > 0) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000000) count++
    return count
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            고급 검색
          </CardTitle>
          <div className="flex items-center space-x-2">
            {getActiveFilterCount() > 0 && <Badge variant="secondary">{getActiveFilterCount()}개 필터 적용</Badge>}
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              <Filter className="w-4 h-4 mr-1" />
              {isExpanded ? "접기" : "펼치기"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 검색바 */}
        <form onSubmit={handleSearch} className="flex space-x-2">
          <Input
            placeholder="상품명, 브랜드, 키워드 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="w-4 h-4" />
          </Button>
        </form>

        {/* 정렬 옵션 */}
        <div className="flex items-center space-x-4">
          <Label>정렬:</Label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">관련도순</SelectItem>
              <SelectItem value="price_low">낮은 가격순</SelectItem>
              <SelectItem value="price_high">높은 가격순</SelectItem>
              <SelectItem value="newest">최신순</SelectItem>
              <SelectItem value="ending_soon">마감임박순</SelectItem>
              <SelectItem value="popular">인기순</SelectItem>
              <SelectItem value="rating">평점순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isExpanded && (
          <div className="space-y-6 border-t pt-6">
            {/* 가격 범위 */}
            <div>
              <Label className="text-base font-medium mb-3 block">가격 범위</Label>
              <div className="px-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter("priceRange", value)}
                  max={5000000}
                  step={10000}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₩{filters.priceRange[0].toLocaleString()}</span>
                  <span>₩{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 카테고리 */}
            <div>
              <Label className="text-base font-medium mb-3 block">카테고리</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleArrayFilter("categories", category)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 상품 상태 */}
            <div>
              <Label className="text-base font-medium mb-3 block">상품 상태</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {conditions.map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={`condition-${condition}`}
                      checked={filters.condition.includes(condition)}
                      onCheckedChange={() => toggleArrayFilter("condition", condition)}
                    />
                    <Label htmlFor={`condition-${condition}`} className="text-sm">
                      {condition}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 지역 */}
            <div>
              <Label className="text-base font-medium mb-3 block">지역</Label>
              <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="지역 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 지역</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 평점 */}
            <div>
              <Label className="text-base font-medium mb-3 block">최소 평점</Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={filters.rating >= rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("rating", rating)}
                    className="flex items-center"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    {rating}점 이상
                  </Button>
                ))}
              </div>
            </div>

            {/* 배송 옵션 */}
            <div>
              <Label className="text-base font-medium mb-3 block">배송 옵션</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {shippingOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`shipping-${option}`}
                      checked={filters.shipping.includes(option)}
                      onCheckedChange={() => toggleArrayFilter("shipping", option)}
                    />
                    <Label htmlFor={`shipping-${option}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 판매자 유형 */}
            <div>
              <Label className="text-base font-medium mb-3 block">판매자 유형</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sellerTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`seller-${type}`}
                      checked={filters.seller.includes(type)}
                      onCheckedChange={() => toggleArrayFilter("seller", type)}
                    />
                    <Label htmlFor={`seller-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 특별 기능 */}
            <div>
              <Label className="text-base font-medium mb-3 block">특별 기능</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {specialFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={filters.features.includes(feature)}
                      onCheckedChange={() => toggleArrayFilter("features", feature)}
                    />
                    <Label htmlFor={`feature-${feature}`} className="text-sm">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 필터 초기화 */}
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={clearAllFilters}>
                <X className="w-4 h-4 mr-1" />
                모든 필터 초기화
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
