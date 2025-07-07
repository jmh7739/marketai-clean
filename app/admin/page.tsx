"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, DollarSign, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react"
import type { AdminStats, SalesData } from "@/types/admin"
import { LineChart, Line } from "recharts"

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalAuctions: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingDisputes: 0,
    completedTransactions: 0,
  })

  const [salesData, setSalesData] = useState<SalesData[]>([])

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalUsers: 1234,
      totalAuctions: 567,
      totalRevenue: 89012,
      activeUsers: 234,
      pendingDisputes: 12,
      completedTransactions: 456,
    })

    setSalesData([
      { date: "2024-01-01", revenue: 1200, transactions: 45, users: 23 },
      { date: "2024-01-02", revenue: 1500, transactions: 52, users: 28 },
      { date: "2024-01-03", revenue: 1800, transactions: 61, users: 35 },
      { date: "2024-01-04", revenue: 1400, transactions: 48, users: 26 },
      { date: "2024-01-05", revenue: 2100, transactions: 73, users: 42 },
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-2">마켓AI 플랫폼 관리 및 모니터링</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">활성 사용자: {stats.activeUsers}명</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 경매</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAuctions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">완료된 거래: {stats.completedTransactions}건</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 수익</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">이번 달 수익</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">활성 사용자</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">지난 24시간 기준</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">대기 중인 분쟁</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.pendingDisputes}</div>
              <p className="text-xs text-muted-foreground">처리 필요</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">완료된 거래</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTransactions}</div>
              <p className="text-xs text-muted-foreground">이번 달 기준</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button className="h-12">사용자 관리</Button>
          <Button variant="outline" className="h-12 bg-transparent">
            경매 관리
          </Button>
          <Button variant="outline" className="h-12 bg-transparent">
            분쟁 처리
          </Button>
          <Button variant="outline" className="h-12 bg-transparent">
            리포트 생성
          </Button>
        </div>

        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>매출 추이</CardTitle>
            <CardDescription>최근 5일간의 매출 및 거래 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <LineChart width={800} height={300} data={salesData}>
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
