"use client"

import { useState } from "react"
import { Heart, Clock, Eye, Trash2, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import SafeLink from "@/components/SafeLink"

// 더미 찜 목록 데이터
const watchlistItems = [
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
    addedDate: "2024-01-15",
    category: "전자제품",
    isActive: true,
  },
  {
    id: 2,
    title: "MacBook Air M2 13인치 실버",
    currentPrice: 1350000,
    originalPrice: 1890000,
    timeLeft: "1일 8시간",
    bidCount: 42,
    viewCount: 203,
    image: "/placeholder.svg?height=200&width=200&text=MacBook",
    condition: "좋음",
    seller: "AppleShop",
    location: "서울 서초구",
    addedDate: "2024-01-14",
    category: "전자제품",
    isActive: true,
  },
  {
    id: 3,
    title: "나이키 에어맥스 270 블랙",
    currentPrice: 89000,
    originalPrice: 150000,
    timeLeft: "종료됨",
    bidCount: 25,
    viewCount: 156,
    image: "/placeholder.svg?height=200&width=200&text=Nike",
    condition: "좋음",
    seller: "ShoesWorld",
    location: "서울 홍대",
    addedDate: "2024-01-13",
    category: "패션/의류",
    isActive: false,
  },
]

export default function WatchlistPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-4">찜 목록을 확인하려면 로그인해주세요.</p>
            <SafeLink href="/auth/login?redirect=/watchlist">
              <Button className="w-full">로그인하기</Button>
            </SafeLink>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleRemoveItem = (itemId: number) => {
    // 찜 목록에서 제거 로직
    console.log("Remove item:", itemId)
  }

  const handleRemoveSelected = () => {
    // 선택된 항목들 제거
    console.log("Remove selected items:", selectedItems)
    setSelectedItems([])
  }

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const filteredItems = watchlistItems.filter((item) => {
    if (filterBy === "active") return item.isActive
    if (filterBy === "ended") return !item.isActive
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">찜 목록</h1>
          <p className="text-gray-600">관심있는 상품들을 모아보세요 ({filteredItems.length}개)</p>
        </div>

        {/* 컨트롤 바 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="active">진행중</SelectItem>
                <SelectItem value="ended">종료됨</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">최근 추가순</SelectItem>
                <SelectItem value="ending-soon">마감임박순</SelectItem>
                <SelectItem value="price-low">낮은가격순</SelectItem>
                <SelectItem value="price-high">높은가격순</SelectItem>
              </SelectContent>
            </Select>

            {selectedItems.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleRemoveSelected}>
                <Trash2 className="w-4 h-4 mr-2" />
                선택 삭제 ({selectedItems.length})
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 찜 목록 */}
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">찜한 상품이 없습니다</h3>
              <p className="text-gray-600 mb-4">관심있는 상품을 찜해보세요!</p>
              <SafeLink href="/">
                <Button>상품 둘러보기</Button>
              </SafeLink>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className={viewMode === "grid" ? "p-0" : "p-4"}>
                  {viewMode === "grid" ? (
                    <div>
                      {/* 그리드 뷰 */}
                      <div className="relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 left-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                            className="w-4 h-4"
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="p-2 bg-white/90 hover:bg-white"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              item.isActive ? "bg-blue-600 text-white" : "bg-gray-500 text-white"
                            }`}
                          >
                            {item.condition}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <SafeLink href={`/product/${item.id}`}>
                          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">
                            {item.title}
                          </h3>
                        </SafeLink>
                        <div className="mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-blue-600">
                              ₩{item.currentPrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₩{item.originalPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-red-600 font-medium">
                            {Math.round((1 - item.currentPrice / item.originalPrice) * 100)}% 할인
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className={item.isActive ? "" : "text-red-500"}>
                              {item.timeLeft} {item.isActive ? "남음" : ""}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span>입찰 {item.bidCount}회</span>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              <span>{item.viewCount}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span>{item.seller}</span> • <span>{item.location}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">찜한 날짜: {item.addedDate}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      {/* 리스트 뷰 */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="w-4 h-4 mr-3"
                        />
                      </div>
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute top-1 left-1">
                          <span
                            className={`text-xs px-1 py-0.5 rounded ${
                              item.isActive ? "bg-blue-600 text-white" : "bg-gray-500 text-white"
                            }`}
                          >
                            {item.condition}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <SafeLink href={`/product/${item.id}`}>
                          <h3 className="font-semibold text-gray-800 mb-2 hover:text-blue-600">{item.title}</h3>
                        </SafeLink>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xl font-bold text-blue-600">₩{item.currentPrice.toLocaleString()}</span>
                          <span className="text-sm text-gray-500 line-through">
                            ₩{item.originalPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-red-600 font-medium">
                            {Math.round((1 - item.currentPrice / item.originalPrice) * 100)}% 할인
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className={item.isActive ? "" : "text-red-500"}>
                                {item.timeLeft} {item.isActive ? "남음" : ""}
                              </span>
                            </div>
                            <span>입찰 {item.bidCount}회</span>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              <span>{item.viewCount}</span>
                            </div>
                          </div>
                          <div>
                            <span>{item.seller}</span> • <span>{item.location}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">찜한 날짜: {item.addedDate}</div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
