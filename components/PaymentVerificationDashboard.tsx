"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Clock, AlertTriangle, CreditCard } from "lucide-react"

interface PendingVerification {
  id: string
  auctionTitle: string
  buyerName: string
  depositName: string
  expectedAmount: number
  depositDate: string
  depositTime: string
  memo?: string
  createdAt: string
}

export default function PaymentVerificationDashboard() {
  const [pendingVerifications, setPendingVerifications] = useState<PendingVerification[]>([
    {
      id: "1",
      auctionTitle: "iPhone 15 Pro Max 256GB",
      buyerName: "김구매",
      depositName: "김구매",
      expectedAmount: 1200000,
      depositDate: "2024-01-15",
      depositTime: "14:30",
      memo: "오후에 입금했습니다",
      createdAt: "2024-01-15T14:35:00Z",
    },
    {
      id: "2",
      auctionTitle: "MacBook Air M2",
      buyerName: "이구매",
      depositName: "이구매자",
      expectedAmount: 1350000,
      depositDate: "2024-01-15",
      depositTime: "16:20",
      createdAt: "2024-01-15T16:25:00Z",
    },
  ])

  const [selectedVerification, setSelectedVerification] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleConfirm = async (verificationId: string) => {
    try {
      // 실제로는 PaymentVerificationService.confirmDeposit 호출
      console.log("입금 확인:", verificationId)

      setPendingVerifications((prev) => prev.filter((v) => v.id !== verificationId))

      alert("입금이 확인되었습니다. 구매자에게 알림이 발송됩니다.")
    } catch (error) {
      alert("입금 확인 처리 중 오류가 발생했습니다.")
    }
  }

  const handleReject = async (verificationId: string) => {
    if (!rejectionReason.trim()) {
      alert("거부 사유를 입력해주세요.")
      return
    }

    try {
      // 실제로는 PaymentVerificationService.confirmDeposit(false) 호출
      console.log("입금 거부:", verificationId, rejectionReason)

      setPendingVerifications((prev) => prev.filter((v) => v.id !== verificationId))

      setSelectedVerification(null)
      setRejectionReason("")
      alert("입금이 거부되었습니다. 구매자에게 알림이 발송됩니다.")
    } catch (error) {
      alert("입금 거부 처리 중 오류가 발생했습니다.")
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const created = new Date(dateString)
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))

    if (diffMinutes < 60) return `${diffMinutes}분 전`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}시간 전`
    return `${Math.floor(diffMinutes / 1440)}일 전`
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">입금 확인 대기</h2>
          <p className="text-gray-600">구매자가 신고한 입금 내역을 확인해주세요</p>
        </div>
        <Badge variant="destructive" className="text-lg px-3 py-1">
          {pendingVerifications.length}건 대기
        </Badge>
      </div>

      {pendingVerifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">모든 입금이 확인되었습니다</h3>
            <p className="text-gray-600">확인 대기 중인 입금이 없습니다.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingVerifications.map((verification) => (
            <Card key={verification.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {verification.auctionTitle}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(verification.createdAt)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">구매자</label>
                      <p className="font-semibold">{verification.buyerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">입금자명</label>
                      <p className="font-semibold">{verification.depositName}</p>
                      {verification.buyerName !== verification.depositName && (
                        <p className="text-sm text-orange-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          구매자명과 입금자명이 다릅니다
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">입금 시간</label>
                      <p className="font-semibold">
                        {verification.depositDate} {verification.depositTime}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">입금 예정 금액</label>
                      <p className="text-2xl font-bold text-blue-600">
                        ₩{verification.expectedAmount.toLocaleString()}
                      </p>
                    </div>
                    {verification.memo && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">구매자 메모</label>
                        <p className="text-sm bg-gray-50 p-2 rounded">{verification.memo}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Alert className="mt-4">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    통장을 확인하여 위 정보와 일치하는 입금 내역이 있는지 확인해주세요. 입금이 확인되면 구매자에게
                    자동으로 알림이 발송됩니다.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3 mt-6">
                  <Button onClick={() => handleConfirm(verification.id)} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    입금 확인
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setSelectedVerification(verification.id)}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    입금 거부
                  </Button>
                </div>

                {selectedVerification === verification.id && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">거부 사유를 입력해주세요</label>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="예: 입금자명이 다릅니다, 금액이 일치하지 않습니다, 입금 시간이 다릅니다 등"
                      rows={3}
                    />
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedVerification(null)
                          setRejectionReason("")
                        }}
                      >
                        취소
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleReject(verification.id)}>
                        거부 확정
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
