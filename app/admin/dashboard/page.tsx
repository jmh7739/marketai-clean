"use client"

import { useState, useEffect } from "react"
import { Users, Package, DollarSign, TrendingUp, AlertTriangle, Eye, MessageSquare, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 실제 데이터 구조 (API에서 가져올 데이터)
interface DashboardData {
  totalUsers: number
  activeAuctions: number
  totalRevenue: number
  monthlyGrowth: number
  pendingReports: number
  todayVisitors: number
  todayMessages: number
  todayOrders: number
}

interface Activity {
  id: number
  type: string
  message: string
  timestamp: string
  priority: "low" | "medium" | "high"
}

interface CategoryData {
  name: string
  count: number
  percentage: number
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("today")
  const [stats, setStats] = useState<DashboardData>({
    totalUsers: 0,
    activeAuctions: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    pendingReports: 0,
    todayVisitors: 0,
    todayMessages: 0,
    todayOrders: 0,
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 실제 데이터 로딩
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      try {
        // 실제 환경에서는 API 호출
        // const response = await fetch('/api/admin/dashboard')
        // const data = await response.json()

        // 현재는 빈 데이터로 시작
        setStats({
          totalUsers: 0,
          activeAuctions: 0,
          totalRevenue: 0,
          monthlyGrowth: 0,
          pendingReports: 0,
          todayVisitors: 0,
          todayMessages: 0,
          todayOrders: 0,
        })
        setActivities([])
        setCategories([])
      } catch (error) {
        console.error("대시보드 데이터 로딩 실패:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [timeRange])

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
      case "auction_start":
        return <TrendingUp className="w-4 h-4 text-purple-600" />
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
              <p className="text-gray-600 mt-2">MarketAI 플랫폼 현황</p>
            </div>
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
              <div className="text-2xl font-bold">₩{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">누적 매출</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">신고 대기</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.pendingReports}</div>
              <p className="text-xs text-muted-foreground">처리 필요</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 오늘의 활동 */}
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

          {/* 카테고리 현황 */}
          <Card>
            <CardHeader>
              <CardTitle>카테고리 현황</CardTitle>
            </CardHeader>
            <CardContent>
              {categories.length > 0 ? (
                <div className="space-y-4">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{category.count}개</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>등록된 상품이 없습니다</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
            {activities.length > 0 ? (
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>최근 활동이 없습니다</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
