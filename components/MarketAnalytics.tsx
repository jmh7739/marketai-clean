"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react"

interface CategoryTrend {
  category: string
  currentPrice: number
  previousPrice: number
  change: number
  volume: number
}

interface PopularItem {
  name: string
  category: string
  avgPrice: number
  bidCount: number
  viewCount: number
}

export default function MarketAnalytics() {
  const [timeRange, setTimeRange] = useState("7d")

  const categoryTrends: CategoryTrend[] = [
    {
      category: "전자제품",
      currentPrice: 850000,
      previousPrice: 820000,
      change: 3.7,
      volume: 1250,
    },
    {
      category: "패션/의류",
      currentPrice: 120000,
      previousPrice: 135000,
      change: -11.1,
      volume: 890,
    },
    {
      category: "가구/인테리어",
      currentPrice: 450000,
      previousPrice: 430000,
      change: 4.7,
      volume: 340,
    },
    {
      category: "스포츠/레저",
      currentPrice: 280000,
      previousPrice: 290000,
      change: -3.4,
      volume: 520,
    },
  ]

  const popularItems: PopularItem[] = [
    {
      name: "iPhone 15 Pro Max",
      category: "전자제품",
      avgPrice: 1200000,
      bidCount: 45,
      viewCount: 2340,
    },
    {
      name: "MacBook Air M2",
      category: "전자제품",
      avgPrice: 1350000,
      bidCount: 38,
      viewCount: 1890,
    },
    {
      name: "나이키 에어맥스",
      category: "패션/의류",
      avgPrice: 150000,
      bidCount: 32,
      viewCount: 1560,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">시장 분석</h2>
          <p className="text-gray-600">카테고리별 가격 트렌드 및 인기 상품 분석</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">1일</SelectItem>
            <SelectItem value="7d">7일</SelectItem>
            <SelectItem value="30d">30일</SelectItem>
            <SelectItem value="90d">90일</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 카테고리별 트렌드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>카테고리별 가격 트렌드</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryTrends.map((trend) => (
              <div key={trend.category} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{trend.category}</h3>
                  <p className="text-sm text-gray-600">거래량: {trend.volume.toLocaleString()}건</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">₩{trend.currentPrice.toLocaleString()}</div>
                  <div className={`flex items-center text-sm ${trend.change > 0 ? "text-green-600" : "text-red-600"}`}>
                    {trend.change > 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(trend.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 인기 상품 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="w-5 h-5" />
            <span>인기 상품 TOP 3</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularItems.map((item, index) => (
              <div key={item.name} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">₩{item.avgPrice.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">
                    입찰 {item.bidCount}회 · 조회 {item.viewCount.toLocaleString()}회
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
