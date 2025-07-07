"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, RefreshCw, CreditCard, Calendar } from "lucide-react"
import type { PaymentHistory } from "@/types/payment"

export default function PaymentHistoryPage() {
  const [payments] = useState<PaymentHistory[]>([
    {
      id: "PAY_001",
      auctionId: "AUC_001",
      productTitle: "iPhone 15 Pro Max 256GB",
      amount: 1353000,
      method: "카드",
      status: "completed",
      createdAt: "2024-06-15T10:30:00Z",
      completedAt: "2024-06-15T10:32:15Z",
    },
    {
      id: "PAY_002",
      auctionId: "AUC_002",
      productTitle: "MacBook Air M2 13인치",
      amount: 1203000,
      method: "카카오페이",
      status: "completed",
      createdAt: "2024-06-10T14:20:00Z",
      completedAt: "2024-06-10T14:21:30Z",
    },
    {
      id: "PAY_003",
      auctionId: "AUC_003",
      productTitle: "AirPods Pro 3세대",
      amount: 353000,
      method: "계좌이체",
      status: "pending",
      createdAt: "2024-06-08T16:45:00Z",
    },
    {
      id: "PAY_004",
      auctionId: "AUC_004",
      productTitle: "Samsung Galaxy Watch 6",
      amount: 283000,
      method: "네이버페이",
      status: "failed",
      createdAt: "2024-06-05T11:15:00Z",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const getStatusBadge = (status: PaymentHistory["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">완료</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">처리중</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">실패</Badge>
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-800">환불</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    let matchesDate = true
    if (dateFilter !== "all") {
      const paymentDate = new Date(payment.createdAt)
      const now = new Date()

      switch (dateFilter) {
        case "week":
          matchesDate = now.getTime() - paymentDate.getTime() <= 7 * 24 * 60 * 60 * 1000
          break
        case "month":
          matchesDate = now.getTime() - paymentDate.getTime() <= 30 * 24 * 60 * 60 * 1000
          break
        case "3months":
          matchesDate = now.getTime() - paymentDate.getTime() <= 90 * 24 * 60 * 60 * 1000
          break
      }
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const totalAmount = filteredPayments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">결제 내역</h1>
        <p className="text-gray-600">결제 내역을 확인하고 관리하세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">총 결제금액</p>
                <p className="text-2xl font-bold">₩{totalAmount.toLocaleString()}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">완료된 결제</p>
                <p className="text-2xl font-bold">{payments.filter((p) => p.status === "completed").length}건</p>
              </div>
              <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">✓</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">이번 달 결제</p>
                <p className="text-2xl font-bold">
                  {
                    payments.filter((p) => {
                      const paymentDate = new Date(p.createdAt)
                      const now = new Date()
                      return (
                        paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
                      )
                    }).length
                  }
                  건
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="상품명 또는 결제번호 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="completed">완료</SelectItem>
                <SelectItem value="pending">처리중</SelectItem>
                <SelectItem value="failed">실패</SelectItem>
                <SelectItem value="refunded">환불</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="기간 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 기간</SelectItem>
                <SelectItem value="week">최근 1주일</SelectItem>
                <SelectItem value="month">최근 1개월</SelectItem>
                <SelectItem value="3months">최근 3개월</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              엑셀 다운로드
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 결제 내역 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>결제 내역 ({filteredPayments.length}건)</span>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">결제 내역이 없습니다</p>
              </div>
            ) : (
              filteredPayments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{payment.productTitle}</h3>
                        {getStatusBadge(payment.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">결제번호:</span> {payment.id}
                        </div>
                        <div>
                          <span className="font-medium">결제방법:</span> {payment.method}
                        </div>
                        <div>
                          <span className="font-medium">결제일시:</span> {formatDate(payment.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-lg font-bold mb-2">₩{payment.amount.toLocaleString()}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          상세
                        </Button>
                        {payment.status === "completed" && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            영수증
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
