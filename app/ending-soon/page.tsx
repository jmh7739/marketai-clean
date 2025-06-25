"use client"

import { useState, useEffect } from "react"
import { Clock, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EndingSoonPage() {
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")
  const [endingSoonItems, setEndingSoonItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제 마감임박 상품 로드
    const loadEndingSoonItems = async () => {
      setLoading(true)
      try {
        // 실제로는 Firestore에서 마감임박 상품을 가져올 예정
        const items = []
        setEndingSoonItems(items)
      } catch (error) {
        console.error("마감임박 상품 로드 실패:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEndingSoonItems()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">마감임박 경매</h1>
          </div>
          <p className="text-gray-600">곧 종료되는 경매들을 놓치지 마세요!</p>
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-red-600 font-medium">30분 이내 마감</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-orange-600 font-medium">1시간 이내 마감</span>
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              <SelectItem value="electronics">전자제품</SelectItem>
              <SelectItem value="fashion">패션/의류</SelectItem>
              <SelectItem value="beauty">뷰티/화장품</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 시간</SelectItem>
              <SelectItem value="1hour">1시간 이내</SelectItem>
              <SelectItem value="6hours">6시간 이내</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            {endingSoonItems.length}개 상품
          </div>
        </div>

        {/* 상품 목록 */}
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
        ) : endingSoonItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* 실제 마감임박 상품이 있을 때 표시 */}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">마감임박 상품이 없습니다</h3>
              <p className="text-gray-600 mb-4">현재 마감이 임박한 경매가 없습니다</p>
              <Button>전체 경매 보기</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
