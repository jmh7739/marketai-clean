"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const TrendingKeywords = () => {
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제 인기 검색어 데이터 로드
    const loadTrendingKeywords = async () => {
      try {
        // 실제로는 검색 통계 API에서 데이터를 가져올 예정
        const trendingData = []
        setKeywords(trendingData)
      } catch (error) {
        console.error("인기 검색어 로드 실패:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTrendingKeywords()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          실시간 인기 검색어
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-4 bg-gray-200 rounded"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : keywords.length > 0 ? (
          <div className="space-y-3">
            {keywords.map((item, index) => (
              <Link key={item.keyword} href={`/search?q=${encodeURIComponent(item.keyword)}`}>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold text-sm ${index < 3 ? "text-red-500" : "text-gray-600"}`}>
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium">{item.keyword}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {item.searchCount?.toLocaleString() || 0}
                    </Badge>
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">인기 검색어가 없습니다</h3>
            <p className="text-gray-600 text-sm">사용자들이 검색을 시작하면 여기에 표시됩니다</p>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">매 10분마다 업데이트 • 최근 1시간 기준</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default TrendingKeywords
