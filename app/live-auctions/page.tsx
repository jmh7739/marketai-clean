"use client"

import { useState, useEffect } from "react"
import { Gavel, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LiveAuctionsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("ending-soon")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [liveAuctions, setLiveAuctions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제 실시간 경매 데이터 로드
    const loadLiveAuctions = async () => {
      setLoading(true)
      try {
        // 실제로는 Firestore에서 진행 중인 경매를 가져올 예정
        const auctions = []
        setLiveAuctions(auctions)
      } catch (error) {
        console.error("실시간 경매 로드 실패:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLiveAuctions()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <h1 className="text-3xl font-bold text-gray-900">실시간 경매</h1>
          </div>
          <p className="text-gray-600">지금 진행 중인 모든 경매를 확인하세요</p>
        </div>

        {/* 필터 및 정렬 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                <SelectItem value="electronics">전자제품</SelectItem>
                <SelectItem value="fashion">패션</SelectItem>
                <SelectItem value="beauty">뷰티</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending-soon">마감임박순</SelectItem>
                <SelectItem value="price-low">낮은가격순</SelectItem>
                <SelectItem value="price-high">높은가격순</SelectItem>
                <SelectItem value="popular">인기순</SelectItem>
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

        {/* 경매 목록 */}
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
        ) : liveAuctions.length > 0 ? (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {/* 실제 경매 데이터가 있을 때 표시 */}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Gavel className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">진행 중인 실시간 경매가 없습니다</h3>
            <p className="text-gray-600 mb-6">새로운 경매가 시작되면 알려드릴게요!</p>
            <div className="flex justify-center gap-4">
              <Button>상품 등록하기</Button>
              <Button variant="outline">알림 설정</Button>
            </div>
          </div>
        )}

        {/* 실시간 통계 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>실시간 경매 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{liveAuctions.length}</div>
                <div className="text-sm text-gray-600">진행 중인 경매</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">총 참여자</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">총 입찰 수</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">₩0</div>
                <div className="text-sm text-gray-600">총 거래액</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
