"use client"

import { useState, useEffect } from "react"
import { CheckCircle, X, Eye, DollarSign } from "lucide-react"
import { RefundSystem } from "@/lib/refund-system"
import type { RefundRequest } from "@/types/refund"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

export default function RefundManagement() {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null)
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    loadRefundRequests()
  }, [])

  const loadRefundRequests = async () => {
    try {
      const requests = await RefundSystem.getRefundRequests()
      setRefundRequests(requests)
    } catch (error) {
      console.error("Failed to load refund requests:", error)
      toast({
        title: "오류",
        description: "환불 요청을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (refundId: string, status: RefundRequest["status"]) => {
    try {
      await RefundSystem.updateRefundStatus(refundId, status, adminNotes)
      await loadRefundRequests()
      setSelectedRefund(null)
      setAdminNotes("")
      toast({
        title: "성공",
        description: `환불 요청이 ${status === "approved" ? "승인" : "거절"}되었습니다.`,
      })
    } catch (error) {
      console.error("Failed to update refund status:", error)
      toast({
        title: "오류",
        description: "환불 상태 업데이트에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: RefundRequest["status"]) => {
    const variants = {
      pending: "default",
      approved: "default",
      rejected: "destructive",
      processed: "default",
    } as const

    const labels = {
      pending: "대기중",
      approved: "승인됨",
      rejected: "거절됨",
      processed: "처리완료",
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">환불 요청을 불러오는 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">환불 관리</h1>
        <p className="text-muted-foreground">고객 환불 요청을 관리하고 처리합니다.</p>
      </div>

      <div className="grid gap-6">
        {refundRequests.map((refund) => (
          <Card key={refund.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{refund.productName}</CardTitle>
                  <CardDescription>
                    주문 ID: {refund.orderId} | 고객: {refund.customerName}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(refund.status)}
                  <span className="font-semibold text-lg">₩{refund.amount.toLocaleString()}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">환불 사유</h4>
                  <p className="text-sm text-muted-foreground">{refund.reason}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    요청일: {new Date(refund.requestDate).toLocaleDateString("ko-KR")}
                  </div>

                  {refund.status === "pending" && (
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedRefund(refund)}>
                            <Eye className="w-4 h-4 mr-2" />
                            상세보기
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>환불 요청 상세</DialogTitle>
                            <DialogDescription>환불 요청을 검토하고 승인 또는 거절하세요.</DialogDescription>
                          </DialogHeader>

                          {selectedRefund && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <strong>고객명:</strong> {selectedRefund.customerName}
                                </div>
                                <div>
                                  <strong>이메일:</strong> {selectedRefund.customerEmail}
                                </div>
                                <div>
                                  <strong>상품명:</strong> {selectedRefund.productName}
                                </div>
                                <div>
                                  <strong>환불금액:</strong> ₩{selectedRefund.amount.toLocaleString()}
                                </div>
                                <div className="col-span-2">
                                  <strong>환불사유:</strong> {selectedRefund.reason}
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2">관리자 메모</label>
                                <Textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="환불 처리에 대한 메모를 입력하세요..."
                                  rows={3}
                                />
                              </div>

                              <div className="flex gap-2 pt-4">
                                <Button
                                  onClick={() => handleStatusUpdate(selectedRefund.id, "approved")}
                                  className="flex-1"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  승인
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleStatusUpdate(selectedRefund.id, "rejected")}
                                  className="flex-1"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  거절
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>

                {refund.adminNotes && (
                  <div className="bg-muted p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-1">관리자 메모</h4>
                    <p className="text-sm">{refund.adminNotes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {refundRequests.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">환불 요청이 없습니다</h3>
              <p className="text-muted-foreground">현재 처리할 환불 요청이 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
