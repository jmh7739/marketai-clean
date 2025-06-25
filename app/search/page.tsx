"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Eye, Heart, Search } from "lucide-react"
import SafeLink from "@/components/SafeLink"

// 더미 검색 결과 데이터
const searchResults = [
  {
    id: "1",
    title: "아이폰 14 Pro 256GB 딥퍼플",
    currentBid: 850000,
    buyNowPrice: 1200000,
    bidCount: 23,
    timeLeft: "2시간 15분",
    image: "/placeholder.svg?height=200&width=300",
    category: "전자기기",
    condition: "중고 - 상",
    isHot: true,
  },
  {
    id: "2",
    title: "맥북 에어 M2 13인치 실버",
    currentBid: 1100000,
    buyNowPrice: 1500000,
    bidCount: 18,
    timeLeft: "1일 5시간",
    image: "/placeholder.svg?height=200&width=300",
    category: "컴퓨터",
    condition: "중고 - 최상",
    isHot: false,
  },
  // 더 많은 더미 데이터...
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [category, setCategory] = useState("all")
  const [results, setResults] = useState(searchResults)

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제로는 API 호출
    console.log("검색:", searchQuery)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 검색 헤더 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <form onSubmit={handleSearch} className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="상품을 검색해보세요..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">검색</Button>
            </form>

            <div className="flex gap-4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="electronics">전자기기</SelectItem>
                  <SelectItem value="computers">컴퓨터</SelectItem>
                  <SelectItem value="fashion">패션</SelectItem>
                  <SelectItem value="home">생활용품</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">관련도순</SelectItem>
                  <SelectItem value="price_low">낮은 가격순</SelectItem>
                  <SelectItem value="price_high">높은 가격순</SelectItem>
                  <SelectItem value="ending_soon">마감임박순</SelectItem>
                  <SelectItem value="newest">최신순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 검색 결과 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {searchQuery ? `"${searchQuery}"` : "전체"} 검색 결과 ({results.length}개)
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
                  {item.isHot && <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">🔥 HOT</Badge>}
                  <Button variant="ghost" size="sm" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs ml-1">
                      {item.condition}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{item.title}</h3>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">현재가</span>
                      <span className="font-bold text-blue-600">{item.currentBid.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">즉시구매</span>
                      <span className="text-sm text-gray-700">{item.buyNowPrice.toLocaleString()}원</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {item.bidCount}회 입찰
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.timeLeft}
                    </div>
                  </div>

                  <SafeLink href={`/product/${item.id}`}>
                    <Button className="w-full" size="sm">
                      입찰하기
                    </Button>
                  </SafeLink>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 더 보기 버튼 */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              더 많은 결과 보기
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
