"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Grid, List, Filter, Search, Heart, Clock, MapPin } from "lucide-react"
import { formatCurrency, formatRelativeTime } from "@/lib/utils"
import type { Auction, SearchFilters } from "@/types"

// Mock auction data
const mockAuctions: Auction[] = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB 자연 티타늄",
    description: "새 제품, 미개봉 상태입니다.",
    images: ["/placeholder.svg?height=300&width=300"],
    startingPrice: 800000,
    currentPrice: 1200000,
    buyNowPrice: 1500000,
    sellerId: "seller1",
    sellerName: "테크스토어",
    category: "electronics",
    condition: "new",
    startTime: "2024-01-01T00:00:00Z",
    endTime: "2024-01-08T23:59:59Z",
    status: "active",
    bidCount: 15,
    watchCount: 42,
    location: "서울시 강남구",
    shippingOptions: [],
    paymentMethods: ["card", "bank_transfer"],
    returnPolicy: "7일 무료 반품",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    featured: true,
    tags: ["스마트폰", "애플", "최신모델"],
  },
  {
    id: "2",
    title: "MacBook Pro 16인치 M3 Pro",
    description: "사용감 거의 없는 상태입니다.",
    images: ["/placeholder.svg?height=300&width=300"],
    startingPrice: 2000000,
    currentPrice: 2800000,
    sellerId: "seller2",
    sellerName: "맥북전문점",
    category: "electronics",
    condition: "like_new",
    startTime: "2024-01-02T00:00:00Z",
    endTime: "2024-01-09T23:59:59Z",
    status: "active",
    bidCount: 8,
    watchCount: 28,
    location: "서울시 서초구",
    shippingOptions: [],
    paymentMethods: ["card"],
    returnPolicy: "3일 무료 반품",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
    tags: ["노트북", "애플", "고성능"],
  },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const [auctions, setAuctions] = useState<Auction[]>(mockAuctions)
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>(mockAuctions)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams?.get("q") || "",
    category: "all", // Updated default value
    minPrice: 0,
    maxPrice: 10000000,
    condition: [],
    location: "",
    sortBy: "relevance",
    itemsPerPage: 20,
    page: 1,
  })

  const [priceRange, setPriceRange] = useState([0, 10000000])

  useEffect(() => {
    // Apply filters
    let filtered = auctions

    if (filters.query) {
      filtered = filtered.filter(
        (auction) =>
          auction.title.toLowerCase().includes(filters.query!.toLowerCase()) ||
          auction.description.toLowerCase().includes(filters.query!.toLowerCase()),
      )
    }

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((auction) => auction.category === filters.category)
    }

    if (filters.condition && filters.condition.length > 0) {
      filtered = filtered.filter((auction) => filters.condition!.includes(auction.condition))
    }

    if (filters.location) {
      filtered = filtered.filter((auction) => auction.location.toLowerCase().includes(filters.location!.toLowerCase()))
    }

    // Price filter
    filtered = filtered.filter(
      (auction) => auction.currentPrice >= priceRange[0] && auction.currentPrice <= priceRange[1],
    )

    // Sort
    switch (filters.sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.currentPrice - b.currentPrice)
        break
      case "price_high":
        filtered.sort((a, b) => b.currentPrice - a.currentPrice)
        break
      case "ending_soon":
        filtered.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        // relevance - keep original order
        break
    }

    setFilteredAuctions(filtered)
  }, [auctions, filters, priceRange])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      condition: checked
        ? [...(prev.condition || []), condition]
        : (prev.condition || []).filter((c) => c !== condition),
    }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{filters.query ? `"${filters.query}" 검색 결과` : "전체 상품"}</h1>
              <p className="text-gray-600 mt-1">총 {filteredAuctions.length}개의 상품을 찾았습니다</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">검색 필터</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div>
                    <Label>키워드</Label>
                    <Input
                      placeholder="상품명, 브랜드 등"
                      value={filters.query || ""}
                      onChange={(e) => handleFilterChange("query", e.target.value)}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label>카테고리</Label>
                    <Select
                      value={filters.category || "all"}
                      onValueChange={(value) => handleFilterChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="electronics">전자제품</SelectItem>
                        <SelectItem value="fashion">패션</SelectItem>
                        <SelectItem value="home">홈&가든</SelectItem>
                        <SelectItem value="sports">스포츠</SelectItem>
                        <SelectItem value="books">도서</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label>가격 범위</Label>
                    <div className="px-2 py-4">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={10000000}
                        step={100000}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatCurrency(priceRange[0])}</span>
                      <span>{formatCurrency(priceRange[1])}</span>
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <Label>상품 상태</Label>
                    <div className="space-y-2 mt-2">
                      {[
                        { value: "new", label: "새 상품" },
                        { value: "like_new", label: "거의 새 것" },
                        { value: "good", label: "좋음" },
                        { value: "fair", label: "보통" },
                        { value: "poor", label: "나쁨" },
                      ].map((condition) => (
                        <div key={condition.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={condition.value}
                            checked={(filters.condition || []).includes(condition.value)}
                            onCheckedChange={(checked) => handleConditionChange(condition.value, checked as boolean)}
                          />
                          <Label htmlFor={condition.value} className="text-sm">
                            {condition.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <Label>지역</Label>
                    <Input
                      placeholder="서울, 부산, 대구 등"
                      value={filters.location || ""}
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">{filteredAuctions.length}개 상품</div>
              <Select
                value={filters.sortBy || "relevance"}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">관련도순</SelectItem>
                  <SelectItem value="price_low">낮은 가격순</SelectItem>
                  <SelectItem value="price_high">높은 가격순</SelectItem>
                  <SelectItem value="ending_soon">마감 임박순</SelectItem>
                  <SelectItem value="newest">최신순</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Auction Grid/List */}
            {filteredAuctions.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-600">다른 키워드로 검색해보세요.</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredAuctions.map((auction) => (
                  <Card key={auction.id} className={viewMode === "list" ? "flex" : ""}>
                    <div className={viewMode === "list" ? "w-48 flex-shrink-0" : ""}>
                      <img
                        src={auction.images[0] || "/placeholder.svg"}
                        alt={auction.title}
                        className={`w-full object-cover ${viewMode === "list" ? "h-32" : "h-48"}`}
                      />
                    </div>

                    <div className="flex-1">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold line-clamp-2">{auction.title}</h3>
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {auction.location}
                        </div>
                      </CardHeader>

                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">현재가</span>
                            <span className="font-bold text-lg text-blue-600">
                              {formatCurrency(auction.currentPrice)}
                            </span>
                          </div>

                          {auction.buyNowPrice && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">즉시구매가</span>
                              <span className="text-sm text-gray-900">{formatCurrency(auction.buyNowPrice)}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>입찰 {auction.bidCount}회</span>
                            <span>관심 {auction.watchCount}개</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span className="text-sm text-gray-600">{formatRelativeTime(auction.endTime)} 마감</span>
                          </div>

                          <div className="flex gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {auction.condition === "new"
                                ? "새 상품"
                                : auction.condition === "like_new"
                                  ? "거의 새 것"
                                  : auction.condition === "good"
                                    ? "좋음"
                                    : auction.condition === "fair"
                                      ? "보통"
                                      : "나쁨"}
                            </Badge>
                            {auction.featured && (
                              <Badge variant="default" className="text-xs">
                                추천
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-2">
                        <div className="flex gap-2 w-full">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            입찰하기
                          </Button>
                          {auction.buyNowPrice && (
                            <Button size="sm" className="flex-1">
                              즉시구매
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
