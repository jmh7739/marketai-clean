"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, X, Eye } from "lucide-react"
import type { ReportData } from "@/types/admin"

export default function ReportManagement() {
  const [reports, setReports] = useState<ReportData[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true)
      try {
        // 실제 환경에서는 API 호출
        // const response = await fetch('/api/admin/reports')
        // const data = await response.json()
        // setReports(data)

        // 현재는 빈 배열로 시작
        setReports([])
      } catch (error) {
        console.error("신고 데이터 로딩 실패:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadReports()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">대기중</Badge>
      case "resolved":
        return <Badge className="bg-green-500">해결됨</Badge>
      case "dismissed":
        return <Badge variant="outline">기각됨</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  const getTargetTypeBadge = (type: string) => {
    switch (type) {
      case "product":
        return <Badge variant="outline">상품</Badge>
      case "user":
        return <Badge variant="outline">사용자</Badge>
      case "chat":
        return <Badge variant="outline">채팅</Badge>
      default:
        return <Badge variant="outline">기타</Badge>
    }
  }

  const filteredReports = reports.filter((report) => {
    return statusFilter === "all" || report.status === statusFilter
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">신고 데이터 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">신고 관리</h1>
          <p className="text-gray-600">사용자 신고 처리</p>
        </div>

        {/* 필터 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="상태 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="pending">대기중</SelectItem>
                    <SelectItem value="resolved">해결됨</SelectItem>
                    <SelectItem value="dismissed">기각됨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-600">
                    대기중인 신고: {reports.filter((r) => r.status === "pending").length}건
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 신고 목록 */}
        {filteredReports.length > 0 ? (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <div>
                        <h3 className="font-semibold">신고 #{report.id}</h3>
                        <p className="text-sm text-gray-500">{report.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTargetTypeBadge(report.targetType)}
                      {getStatusBadge(report.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">신고자 정보</h4>
                      <p className="text-sm text-gray-600">이름: {report.reporterName}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">신고 대상</h4>
                      <p className="text-sm text-gray-600">
                        {report.targetType === "product" ? "상품" : "사용자"}: {report.targetName}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">신고 사유</h4>
                    <p className="text-sm text-gray-600 mb-2">{report.reason}</p>
                    <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">{report.description}</p>
                  </div>

                  {report.status === "pending" && (
                    <div className="flex space-x-3">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        승인
                      </Button>
                      <Button size="sm" variant="outline">
                        <X className="w-4 h-4 mr-1" />
                        기각
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        상세보기
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12">
              <div className="text-center text-gray-500">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">신고가 없습니다</h3>
                <p>신고가 접수되면 여기에 표시됩니다.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
