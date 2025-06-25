"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Grid, List, Search, Heart, Eye, Clock, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import SafeLink from "@/components/SafeLink"

// 부카테고리별 더미 데이터
const subcategoryData = {
  smartphones: {
    name: "스마트폰",
    parentCategory: "전자제품",
    products: [
      {
        id: 1,
        title: "iPhone 15 Pro Max 256GB 자연 티타늄",
        currentPrice: 1200000,
        originalPrice: 1690000,
        timeLeft: "4시간 30분",
        bidCount: 28,
        viewCount: 342,
        image: "/placeholder.svg?height=200&width=200&text=iPhone",
        condition: "거의 새 것",
        seller: "TechStore",
        location: "서울 강남구",
        isNew: false,
        isEndingSoon: true,
        discountRate: 29,
      },
      {
        id: 2,
        title: "Samsung Galaxy S24 Ultra 512GB",
        currentPrice: 1100000,
        originalPrice: 1570000,
        timeLeft: "3일 12시간",
        bidCount: 23,
        viewCount: 156,
        image: "/placeholder.svg?height=200&width=200&text=Galaxy",
        condition: "새 상품",
        seller: "MobileWorld",
        location: "부산 해운대구",
        isNew: true,
        isEndingSoon: false,
        discountRate: 30,
      },
    ],
  },
  laptops: {
    name: "노트북",
    parentCategory: "전자제품",
    products: [
      {
        id: 3,
        title: "MacBook Air M2 13인치 8GB 256GB",
        currentPrice: 1350000,
        originalPrice: 1890000,
        timeLeft: "1일 8시간",
        bidCount: 42,
        viewCount: 203,
        image: "/placeholder.svg?height=200&width=200&text=MacBook",
        condition: "좋음",
        seller: "AppleShop",
        location: "서울 서초구",
        isNew: false,
        isEndingSoon: false,
        discountRate: 29,
      },
    ],
  },
}

export default function SubcategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const subcategorySlug = params.subcategory as string
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("ending-soon")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedDiscount, setSelectedDiscount] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const subcategory = subcategoryData[subcategorySlug as keyof typeof subcategoryData]

  if (!subcategory) {
    return <div>부카테고리를 찾을 수 없습니다.</div>
  }

  const conditions = ["새 상품", "거의 새 것", "좋음", "보통", "나쁨"]
  const auctionStatus = ["진행중", "마감임박", "새로등록"]
  const discountRates = ["10% 이상", "30% 이상", "50% 이상"]

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setSelectedConditions([...selectedConditions, condition])
    } else {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition))
    }
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatus([...selectedStatus, status])
    } else {
      setSelectedStatus(selectedStatus.filter((s) => s !== status))
    }
  }

  const handleDiscountChange = (discount: string, checked: boolean) => {
    if (checked) {
      setSelectedDiscount([...selectedDiscount, discount])
    } else {
      setSelectedDiscount(selectedDiscount.filter((d) => d !== discount))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 브레드크럼 */}
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <SafeLink href="/" className="hover:text-blue-600">
              홈
            </SafeLink>
            <span>/</span>
            <SafeLink href={`/category/${slug}`} className="hover:text-blue-600">
              {subcategory.parentCategory}
            </SafeLink>
            <span>/</span>
            <span className="text-gray-900 font-medium">{subcategory.name}</span>
          </nav>
        </div>

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{subcategory.name}</h1>
          <p className="text-gray-600">{subcategory.products.length}개의 상품이 있습니다</p>
        </div>

        <div className="flex gap-8">
          {/* 사이드바 필터 */}
          <div className={`w-64 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
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

            {/* 경매 상태 */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">경매 상태</h3>
                <div className="space-y-2">
                  {auctionStatus.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={status}
                        checked={selectedStatus.includes(status)}
                        onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                      />
                      <label htmlFor={status} className="text-sm cursor-pointer">
                        {status}
                      </label>
                    </div>
                  ))}
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

            {/* 할인율 */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">할인율</h3>
                <div className="space-y-2">
                  {discountRates.map((discount) => (
                    <div key={discount} className="flex items-center space-x-2">
                      <Checkbox
                        id={discount}
                        checked={selectedDiscount.includes(discount)}
                        onCheckedChange={(checked) => handleDiscountChange(discount, checked as boolean)}
                      />
                      <label htmlFor={discount} className="text-sm cursor-pointer">
                        {discount}
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
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  필터
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ending-soon">마감임박순</SelectItem>
                    <SelectItem value="newest">새로등록순</SelectItem>
                    <SelectItem value="price-low">낮은가격순</SelectItem>
                    <SelectItem value="price-high">높은가격순</SelectItem>
                    <SelectItem value="popular">인기순 (조회수)</SelectItem>
                    <SelectItem value="bid-count">입찰많은순</SelectItem>
                    <SelectItem value="discount">할인율높은순</SelectItem>
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
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {subcategory.products.map((product) => (
                <SafeLink key={product.id} href={`/product/${product.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className={viewMode === "grid" ? "p-0" : "p-4"}>
                      {viewMode === "grid" ? (
                        <div>
                          {/* 그리드 뷰 */}
                          <div className="relative">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                              <Heart className="w-4 h-4 text-gray-600" />
                            </button>
                            <div className="absolute bottom-2 left-2 flex space-x-1">
                              <Badge variant="secondary">{product.condition}</Badge>
                              {product.isNew && <Badge className="bg-green-500">NEW</Badge>}
                              {product.isEndingSoon && <Badge className="bg-red-500">마감임박</Badge>}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.title}</h3>
                            <div className="mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-blue-600">
                                  ₩{product.currentPrice.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  ₩{product.originalPrice.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-sm text-red-600 font-medium">{product.discountRate}% 할인</div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{product.timeLeft} 남음</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span>입찰 {product.bidCount}회</span>
                                <div className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  <span>{product.viewCount}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span>{product.seller}</span> • <span>{product.location}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex space-x-4">
                          {/* 리스트 뷰 */}
                          <div className="relative w-32 h-32 flex-shrink-0">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute top-1 left-1 flex flex-col space-y-1">
                              <Badge variant="secondary" className="text-xs">
                                {product.condition}
                              </Badge>
                              {product.isNew && <Badge className="bg-green-500 text-xs">NEW</Badge>}
                              {product.isEndingSoon && <Badge className="bg-red-500 text-xs">마감임박</Badge>}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-2">{product.title}</h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-xl font-bold text-blue-600">
                                ₩{product.currentPrice.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ₩{product.originalPrice.toLocaleString()}
                              </span>
                              <span className="text-sm text-red-600 font-medium">{product.discountRate}% 할인</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span>{product.timeLeft} 남음</span>
                                </div>
                                <span>입찰 {product.bidCount}회</span>
                                <div className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  <span>{product.viewCount}</span>
                                </div>
                              </div>
                              <div>
                                <span>{product.seller}</span> • <span>{product.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-center">
                            <button className="p-2 text-gray-600 hover:text-red-500">
                              <Heart className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </SafeLink>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                <Button variant="outline" disabled>
                  이전
                </Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">다음</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
