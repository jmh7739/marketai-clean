"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Clock, CreditCard, AlertTriangle, CheckCircle, Upload } from "lucide-react"

interface AuctionInfo {
  id: string
  title: string
  finalPrice: number
  sellerName: string
  sellerAccount: string
  deadline: string
}

export default function PaymentReportForm() {
  const [auctionInfo] = useState<AuctionInfo>({
    id: "auction123",
    title: "iPhone 15 Pro Max 256GB - 자연 티타늄",
    finalPrice: 1200000,
    sellerName: "김판매",
    sellerAccount: "국민은행 123-456-789012",
    deadline: "2024-01-16 14:30:00",
  })

  const [reportMethod, setReportMethod] = useState<"manual" | "receipt">("manual")
  const [paymentData, setPaymentData] = useState({
    depositorName: "",
    depositDate: "",
    depositTime: "",
    memo: "",
  })
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 현재 시간으로 자동 입력
  const setCurrentTime = () => {
    const now = new Date()
    const date = now.toISOString().split("T")[0]
    const time = now.toTimeString().slice(0, 5)
    setPaymentData((prev) => ({ ...prev, depositDate: date, depositTime: time }))
  }

  // 입금 신고 제출
  const submitReport = async () => {
    if (reportMethod === "manual") {
      if (!paymentData.depositorName || !paymentData.depositDate || !paymentData.depositTime) {
        alert("모든 필수 정보를 입력해주세요")
        return
      }
    } else {
      if (!receiptFile) {
        alert("입금 영수증을 첨부해주세요")
        return
      }
    }

    setIsSubmitting(true)

    try {
      // 실제로는 서버에 입금 신고 데이터 전송
      const reportData = {
        auctionId: auctionInfo.id,
        method: reportMethod,
        ...(reportMethod === "manual" ? paymentData : { receiptFile }),
      }

      console.log("입금 신고 데이터:", reportData)

      // 모의 API 호출
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("입금 신고가 완료되었습니다. 판매자가 확인하면 거래가 진행됩니다.")

      // 성공 후 페이지 이동 또는 상태 업데이트
    } catch (error) {
      alert("입금 신고 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const timeRemaining = () => {
    const deadline = new Date(auctionInfo.deadline)
    const now = new Date()
    const diff = deadline.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}시간 ${minutes}분`
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">입금 신고</h2>
        <p className="text-gray-600">입금 완료 후 아래 정보를 입력해주세요</p>
      </div>

      {/* 경매 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            결제 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">상품명</label>
              <p className="font-semibold">{auctionInfo.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">결제 금액</label>
                <p className="text-2xl font-bold text-blue-600">₩{auctionInfo.finalPrice.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">결제 마감</label>
                <p className="font-semibold text-red-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {timeRemaining()} 남음
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">입금 계좌</label>
              <p className="font-semibold">{auctionInfo.sellerAccount}</p>
              <p className="text-sm text-gray-500">예금주: {auctionInfo.sellerName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 신고 방법 선택 */}
      <Card>
        <CardHeader>
          <CardTitle>신고 방법 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={reportMethod} onValueChange={(value: "manual" | "receipt") => setReportMethod(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manual" />
              <Label htmlFor="manual" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">직접 입력</p>
                    <p className="text-sm text-gray-600">입금자명, 입금시간을 직접 입력</p>
                  </div>
                  <Badge variant="outline">권장</Badge>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="receipt" id="receipt" />
              <Label htmlFor="receipt" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-medium">영수증 첨부</p>
                  <p className="text-sm text-gray-600">입금 영수증 또는 거래내역 스크린샷 첨부</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* 직접 입력 방식 */}
      {reportMethod === "manual" && (
        <Card>
          <CardHeader>
            <CardTitle>입금 정보 입력</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="depositorName">입금자명 *</Label>
                <Input
                  id="depositorName"
                  value={paymentData.depositorName}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, depositorName: e.target.value }))}
                  placeholder="실제 입금한 이름을 정확히 입력하세요"
                />
                <p className="text-xs text-gray-500 mt-1">은행 거래내역에 표시되는 입금자명을 정확히 입력해주세요</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="depositDate">입금 날짜 *</Label>
                  <Input
                    id="depositDate"
                    type="date"
                    value={paymentData.depositDate}
                    onChange={(e) => setPaymentData((prev) => ({ ...prev, depositDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="depositTime">입금 시간 *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="depositTime"
                      type="time"
                      value={paymentData.depositTime}
                      onChange={(e) => setPaymentData((prev) => ({ ...prev, depositTime: e.target.value }))}
                    />
                    <Button variant="outline" size="sm" onClick={setCurrentTime}>
                      현재
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="memo">추가 메모 (선택)</Label>
                <Textarea
                  id="memo"
                  value={paymentData.memo}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, memo: e.target.value }))}
                  placeholder="특이사항이 있다면 입력해주세요 (예: 다른 이름으로 입금, 분할 입금 등)"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 영수증 첨부 방식 */}
      {reportMethod === "receipt" && (
        <Card>
          <CardHeader>
            <CardTitle>영수증 첨부</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="receipt">입금 영수증 또는 거래내역</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="receipt"
                  />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById("receipt")?.click()}>
                    파일 선택
                  </Button>
                  {receiptFile && (
                    <p className="text-sm text-green-600 mt-2">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      {receiptFile.name}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG, PDF 파일만 업로드 가능 (최대 10MB)</p>
              </div>

              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>영수증에는 입금자명, 입금시간, 입금금액이 명확히 표시되어야 합니다.</AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 주의사항 */}
      <Alert>
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>
          <strong>주의사항:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>입금 정보가 정확하지 않으면 거래가 지연될 수 있습니다</li>
            <li>허위 신고 시 계정 제재를 받을 수 있습니다</li>
            <li>판매자가 24시간 내 확인하지 않으면 자동으로 관리자가 확인합니다</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* 제출 버튼 */}
      <Button onClick={submitReport} disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? "신고 중..." : "입금 신고하기"}
      </Button>
    </div>
  )
}
