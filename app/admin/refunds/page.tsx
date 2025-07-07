"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, X, Eye, DollarSign } from "lucide-react"
import { RefundSystem } from "@/lib/refund-system"
import type { RefundRequest } from "@/types/refund"

export default function RefundManagement() {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRefundRequests()
  }, [statusFilter])

  const loadRefundRequests = async () => {
    setIsLoading(true)
    try {
      // 실제 환경에서는 API 호출
      // const response = await fetch(`/api/admin/refunds?status=${statusFilter}`)
      // const data = await response.json()
      // setRefundRequests(data)

      // 현재는 빈 배열로 시작
      setRefundRequests([])
    } catch (error) {
      console.error("환불 요청 로딩 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProcessRefund = async (decision: "approved" | "rejected") => {
    if (!selectedRequest || !adminNotes.trim()) {
      alert("처리 사유를 입력해주세요")
      return
    }

    setIsProcessing(true)
    try {
      const result = await RefundSystem.processRefundRequest(
        selectedRequest.id,
        decision,
        adminNotes,
        "admin_user_id", // 실제로는 현재 관리자 ID
      )

      if (result.success) {
        alert(`환불 요청이 ${decision === "approved" ? "승인" : "거부"}되었습니다`)
        setSelectedRequest(null)
        setAdminNotes("")
        loadRefundRequests()
      } else {
        alert("처리 중 오류가 발생했습니다")
      }
    } catch (error) {
      console.error("환불 처리 실패:", error)
      alert("처리 중 오류가 발생했습니다")
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">대기중</Badge>
      case "approved":
        return <Badge className="bg-green-500">승인됨</Badge>
      case "rejected":
        return <Badge variant="destructive">거부됨</Badge>
      case "completed":
        return <Badge className="bg-blue-500">완료됨</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case "seller_cancel":
        return <Badge variant="outline">판매자 취소</Badge>
      case "buyer_cancel":
        return <Badge variant="outline">구매자 취소</Badge>
      case "dispute":
        return <Badge className="bg-red-500">분쟁</Badge>
      default:
        return <Badge variant="outline">기타</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">환불 요청 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">환불 관리</h1>
          <p className="text-gray-600">환불 요청 처리 및 관리</p>
        </div>

        {/* 필터 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                  <SelectItem value="approved">승인됨</SelectItem>
                  <SelectItem value="rejected">거부됨</SelectItem>
                  <SelectItem value="completed">완료됨</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">
                    대기중인 환불: {refundRequests.filter((r) => r.status === "pending").length}건
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 환불 요청 목록 */}
        {refundRequests.length > 0 ? (
          <div className="space-y-4">
            {refundRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold mb-1">환불 요청 #{request.id}</h3>
                      <p className="text-sm text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRequestTypeBadge(request.requestType)}
                      {getStatusBadge(request.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-1">상품명</h4>
                      <p className="text-sm text-gray-600">{request.productTitle}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">환불 금액</h4>
                      <p className="text-sm font-bold text-green-600">₩{request.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">요청 사유</h4>
                      <p className="text-sm text-gray-600">{request.reason}</p>
                    </div>
                  </div>

                  {request.adminNotes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-1">관리자 메모</h4>
                      <p className="text-sm text-gray-600">{request.adminNotes}</p>
                    </div>
                  )}

                  {request.status === "pending" && (
                    <div className="flex space-x-3">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        처리하기
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
                <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">환불 요청이 없습니다</h3>
                <p>환불 요청이 접수되면 여기에 표시됩니다.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 환불 처리 모달 */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>환불 요청 처리</DialogTitle>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">상품명</h4>
                    <p className="text-sm text-gray-600">{selectedRequest.productTitle}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">환불 금액</h4>
                    <p className="text-sm font-bold text-green-600">₩{selectedRequest.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">요청 사유</h4>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded">{selectedRequest.reason}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    처리 사유 <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="승인/거부 사유를 입력해주세요"
                    rows={4}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={() => handleProcessRefund("approved")}
                    disabled={isProcessing || !adminNotes.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    승인
                  </Button>
                  <Button
                    onClick={() => handleProcessRefund("rejected")}
                    disabled={isProcessing || !adminNotes.trim()}
                    variant="destructive"
                  >
                    <X className="w-4 h-4 mr-1" />
                    거부
                  </Button>
                  <Button onClick={() => setSelectedRequest(null)} variant="outline" disabled={isProcessing}>
                    취소
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
