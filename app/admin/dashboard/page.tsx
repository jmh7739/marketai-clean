"use client"

import { useState, useEffect } from "react"
import { Users, Package, DollarSign, AlertTriangle, Eye, MessageSquare, ShoppingCart, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface DashboardStats {
  totalUsers: number
  activeAuctions: number
  totalRevenue: number
  monthlyGrowth: number
  pendingReports: number
  pendingRefunds: number
  todayVisitors: number
  todayMessages: number
  todayOrders: number
  totalTransactions: number
}

interface Activity {
  id: number
  type: "user_signup" | "auction_end" | "report" | "payment" | "refund" | "dispute"
  message: string
  timestamp: string
  priority: "low" | "medium" | "high"
  userId?: string
  auctionId?: string
}

interface SalesData {
  date: string
  sales: number
  revenue: number
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("today")
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeAuctions: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    pendingReports: 0,
    pendingRefunds: 0,
    todayVisitors: 0,
    todayMessages: 0,
    todayOrders: 0,
    totalTransactions: 0,
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const categoryData = [
    { name: "전자제품", value: 35, color: "#3B82F6" },
    { name: "패션", value: 25, color: "#EF4444" },
    { name: "홈&리빙", value: 20, color: "#10B981" },
    { name: "스포츠", value: 12, color: "#F59E0B" },
    { name: "기타", value: 8, color: "#8B5CF6" },
  ]

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 30000) // 30초마다 업데이트
    return () => clearInterval(interval)
  }, [timeRange])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // 실제 환경에서는 API 호출
      // const [statsRes, activitiesRes, salesRes] = await Promise.all([
      //   fetch(`/api/admin/stats?range=${timeRange}`),
      //   fetch('/api/admin/activities'),
      //   fetch(`/api/admin/sales?range=${timeRange}`)
      // ])

      // Mock 데이터로 시작 (실제로는 데이터베이스에서 가져옴)
      setStats({
        totalUsers: 1247,
        activeAuctions: 89,
        totalRevenue: 45670000,
        monthlyGrowth: 12.5,
        pendingReports: 3,
        pendingRefunds: 2,
        todayVisitors: 342,
        todayMessages: 156,
        todayOrders: 23,
        totalTransactions: 1834,
      })

      setActivities([
        {
          id: 1,
          type: "user_signup",
          message: "새로운 사용자 가입: 김철수님",
          timestamp: "5분 전",
          priority: "low",
        },
        {
          id: 2,
          type: "auction_end",
          message: "iPhone 15 Pro 경매 종료: ₩1,200,000 낙찰",
          timestamp: "12분 전",
          priority: "medium",
        },
        {
          id: 3,
          type: "report",
          message: "신고 접수: 부적절한 상품 설명",
          timestamp: "23분 전",
          priority: "high",
        },
        {
          id: 4,
          type: "refund",
          message: "환불 요청: MacBook Air 거래 취소",
          timestamp: "34분 전",
          priority: "high",
        },
        {
          id: 5,
          type: "payment",
          message: "결제 완료: Galaxy S24 Ultra",
          timestamp: "45분 전",
          priority: "medium",
        },
      ])

      setSalesData([
        { date: "2024-01", sales: 245, revenue: 3200000 },
        { date: "2024-02", sales: 289, revenue: 3800000 },
        { date: "2024-03", sales: 334, revenue: 4200000 },
        { date: "2024-04", sales: 378, revenue: 4800000 },
        { date: "2024-05", sales: 423, revenue: 5400000 },
        { date: "2024-06", sales: 467, revenue: 6100000 },
      ])

      setLastUpdated(new Date())
    } catch (error) {
      console.error("대시보드 데이터 로딩 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_signup":
        return <Users className="w-4 h-4 text-green-600" />
      case "auction_end":
        return <Package className="w-4 h-4 text-blue-600" />
      case "report":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "payment":
        return <DollarSign className="w-4 h-4 text-green-600" />
      case "refund":
        return <RefreshCw className="w-4 h-4 text-orange-600" />
      case "dispute":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Eye className="w-4 h-4 text-gray-600" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">긴급</Badge>
      case "medium":
        return <Badge variant="default">보통</Badge>
      default:
        return <Badge variant="secondary">낮음</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">대시보드 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600 mt-2">
                MarketAI 플랫폼 현황 • 마지막 업데이트: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">오늘</SelectItem>
                  <SelectItem value="week">이번 주</SelectItem>
                  <SelectItem value="month">이번 달</SelectItem>
                  <SelectItem value="year">올해</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={loadDashboardData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                새로고침
              </Button>
            </div>
          </div>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.monthlyGrowth > 0 ? `+${stats.monthlyGrowth}%` : `${stats.monthlyGrowth}%`} 전월 대비
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">진행중 경매</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAuctions}</div>
              <p className="text-xs text-muted-foreground">현재 진행중</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 매출</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩{(stats.totalRevenue / 10000).toFixed(0)}만</div>
              <p className="text-xs text-muted-foreground">누적 매출</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">처리 대기</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.pendingReports + stats.pendingRefunds}</div>
              <p className="text-xs text-muted-foreground">
                신고 {stats.pendingReports}건 • 환불 {stats.pendingRefunds}건
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 오늘의 활동 & 차트 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>오늘의 활동</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Eye className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-2xl font-bold">{stats.todayVisitors}</span>
                  </div>
                  <p className="text-sm text-gray-600">방문자</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-2xl font-bold">{stats.todayMessages}</span>
                  </div>
                  <p className="text-sm text-gray-600">메시지</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <ShoppingCart className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-2xl font-bold">{stats.todayOrders}</span>
                  </div>
                  <p className="text-sm text-gray-600">주문</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>카테고리별 판매 비율</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, "비율"]} />
                </PieChart>
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

        {/* 매출 추이 */}
        <Card className="mb-8">
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

        {/* 최근 활동 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>최근 활동</CardTitle>
              <Button variant="outline" size="sm">
                전체 보기
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                  <div>{getPriorityBadge(activity.priority)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
