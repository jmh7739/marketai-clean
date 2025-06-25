"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Package, DollarSign, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react"
import type { AdminStats, SalesData } from "@/types/admin"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 15420,
    totalProducts: 8934,
    totalSales: 2847,
    totalRevenue: 45670000,
    monthlyGrowth: {
      users: 12.5,
      sales: 8.3,
      revenue: 15.7,
    },
  })

  const [salesData] = useState<SalesData[]>([
    { date: "2024-01", sales: 245, revenue: 3200000 },
    { date: "2024-02", sales: 289, revenue: 3800000 },
    { date: "2024-03", sales: 334, revenue: 4200000 },
    { date: "2024-04", sales: 378, revenue: 4800000 },
    { date: "2024-05", sales: 423, revenue: 5400000 },
    { date: "2024-06", sales: 467, revenue: 6100000 },
  ])

  const categoryData = [
    { name: "전자제품", value: 35, color: "#3B82F6" },
    { name: "패션", value: 25, color: "#EF4444" },
    { name: "홈&리빙", value: 20, color: "#10B981" },
    { name: "스포츠", value: 12, color: "#F59E0B" },
    { name: "기타", value: 8, color: "#8B5CF6" },
  ]

  const recentActivities = [
    { type: "user", message: "새로운 사용자 가입: 김철수님", time: "5분 전" },
    { type: "sale", message: "iPhone 15 Pro 경매 낙찰: ₩1,200,000", time: "12분 전" },
    { type: "report", message: "신고 접수: 부적절한 상품 설명", time: "23분 전" },
    { type: "user", message: "새로운 사용자 가입: 이영희님", time: "34분 전" },
    { type: "sale", message: "MacBook Air 경매 낙찰: ₩950,000", time: "45분 전" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
          <p className="text-gray-600">MarketAI 플랫폼 운영 현황을 한눈에 확인하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">총 사용자</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+{stats.monthlyGrowth.users}%</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">등록 상품</p>
                  <p className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+{stats.monthlyGrowth.sales}%</span>
                  </div>
                </div>
                <Package className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">총 거래</p>
                  <p className="text-2xl font-bold">{stats.totalSales.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+{stats.monthlyGrowth.sales}%</span>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">총 매출</p>
                  <p className="text-2xl font-bold">₩{(stats.totalRevenue / 10000).toFixed(0)}만</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+{stats.monthlyGrowth.revenue}%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 매출 추이 차트 */}
          <Card>
            <CardHeader>
              <CardTitle>월별 매출 추이</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`₩${(value / 10000).toFixed(0)}만`, "매출"]} />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 카테고리별 판매 비율 */}
          <Card>
            <CardHeader>
              <CardTitle>카테고리별 판매 비율</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, "비율"]} />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 최근 활동 */}
          <Card>
            <CardHeader>
              <CardTitle>최근 활동</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "user"
                          ? "bg-blue-500"
                          : activity.type === "sale"
                            ? "bg-green-500"
                            : "bg-red-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 빠른 액션 */}
          <Card>
            <CardHeader>
              <CardTitle>빠른 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center">
                  <Users className="w-6 h-6 mb-2" />
                  <span>사용자 관리</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Package className="w-6 h-6 mb-2" />
                  <span>상품 관리</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <AlertTriangle className="w-6 h-6 mb-2" />
                  <span>신고 처리</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <span>통계 분석</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
