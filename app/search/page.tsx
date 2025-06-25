"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("relevance")
  const [showFilters, setShowFilters] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSearchQuery(query)
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchTerm: string) => {
    setLoading(true)
    try {
      // 실제 검색 API 호출
      // const results = await searchAPI(searchTerm)
      // setSearchResults(results)
      setSearchResults([]) // 현재는 빈 배열
    } catch (error) {
      console.error("검색 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 검색 헤더 */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="상품명, 브랜드, 키워드로 검색하세요"
                className="pl-12 pr-4 py-3 text-lg"
              />
              <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                검색
              </Button>
            </div>
          </form>

          {query && (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">'{query}' 검색 결과</h1>
                <p className="text-gray-600 mt-1">총 {searchResults.length}개의 상품을 찾았습니다</p>
              </div>

              {/* 추천 검색어 */}
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-600">추천:</span>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                  iPhone
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                  MacBook
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                  Galaxy
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* 필터 및 정렬 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>필터</span>
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">관련도순</SelectItem>
                <SelectItem value="ending-soon">마감임박순</SelectItem>
                <SelectItem value="price-low">낮은가격순</SelectItem>
                <SelectItem value="price-high">높은가격순</SelectItem>
                <SelectItem value="popular">인기순</SelectItem>
                <SelectItem value="newest">최신순</SelectItem>
              </SelectContent>
            </Select>
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

        {/* 필터 패널 */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">카테고리</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="electronics">전자제품</SelectItem>
                      <SelectItem value="fashion">패션</SelectItem>
                      <SelectItem value="beauty">뷰티</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">가격 범위</h3>
                  <div className="flex space-x-2">
                    <Input placeholder="최소" />
                    <Input placeholder="최대" />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">상품 상태</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="new">새 상품</SelectItem>
                      <SelectItem value="like-new">거의 새 것</SelectItem>
                      <SelectItem value="good">좋음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">배송</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="free">무료배송</SelectItem>
                      <SelectItem value="pickup">직접픽업</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 검색 결과 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        ) : searchResults.length > 0 ? (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {/* 실제 검색 결과가 있을 때 표시 */}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">'{query}'에 대한 검색 결과가 없습니다</h3>
            <p className="text-gray-600 mb-4">다른 키워드로 검색해보세요</p>
            <div className="flex justify-center space-x-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                iPhone
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                MacBook
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                Galaxy
              </Badge>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">검색어를 입력해주세요</h3>
            <p className="text-gray-600">원하는 상품을 찾아보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
