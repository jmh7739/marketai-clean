"use client"
import { useState, useEffect } from "react"
import { Copy, CheckCircle, AlertCircle, Clock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PaymentInfo {
  auctionId: string
  productTitle: string
  finalPrice: number
  sellerId: string
  sellerName: string
  buyerId: string
  buyerName: string
}

export default function BankTransferPayment({ paymentInfo }: { paymentInfo: PaymentInfo }) {
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed" | "confirmed">("pending")
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60) // 24시간
  const [depositName, setDepositName] = useState("")
  const [depositDate, setDepositDate] = useState("")
  const [depositTime, setDepositTime] = useState("")
  const [memo, setMemo] = useState("")
  const [copied, setCopied] = useState(false)

  // 실제 사용할 계좌 정보 (개인 계좌)
  const bankAccount = {
    bank: "국민은행",
    accountNumber: "123456-78-901234", // 실제 계좌번호로 변경 필요
    accountHolder: "홍길동", // 실제 예금주명으로 변경 필요
    amount: paymentInfo.finalPrice,
  }

  // 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}시간 ${minutes}분 ${secs}초`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDepositConfirm = () => {
    if (!depositName || !depositDate || !depositTime) {
      alert("모든 정보를 입력해주세요")
      return
    }
    setPaymentStatus("completed")
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* 결제 상태 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              계좌이체 결제
            </CardTitle>
            <Badge
              variant={
                paymentStatus === "pending" ? "destructive" : paymentStatus === "completed" ? "default" : "secondary"
              }
            >
              {paymentStatus === "pending" ? "입금 대기" : paymentStatus === "completed" ? "입금 완료" : "결제 확인"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">상품명</Label>
              <p className="font-medium">{paymentInfo.productTitle}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">낙찰가</Label>
              <p className="font-bold text-lg text-blue-600">₩{paymentInfo.finalPrice.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">판매자</Label>
              <p className="font-medium">{paymentInfo.sellerName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">입금 기한</Label>
              <p className="font-medium text-red-600">{formatTime(timeLeft)} 남음</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 계좌 정보 */}
      {paymentStatus === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle>입금 계좌 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">은행명</Label>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-lg">{bankAccount.bank}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">예금주</Label>
                    <p className="font-bold text-lg">{bankAccount.accountHolder}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm text-gray-600">계좌번호</Label>
                    <div className="flex items-center justify-between bg-white p-3 rounded border">
                      <p className="font-mono text-lg font-bold">{bankAccount.accountNumber}</p>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(bankAccount.accountNumber)}>
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "복사됨" : "복사"}
                      </Button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm text-gray-600">입금 금액</Label>
                    <div className="flex items-center justify-between bg-white p-3 rounded border">
                      <p className="font-bold text-xl text-blue-600">₩{bankAccount.amount.toLocaleString()}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(bankAccount.amount.toString())}
                      >
                        <Copy className="w-4 h-4" />
                        복사
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-2">입금 시 주의사항</p>
                    <ul className="space-y-1 text-sm">
                      <li>• 정확한 금액을 입금해주세요 (수수료 별도 부담)</li>
                      <li>• 입금자명은 구매자 실명으로 해주세요</li>
                      <li>• 24시간 내 입금하지 않으면 거래가 취소됩니다</li>
                      <li>• 입금 후 아래 양식을 작성해주세요</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 입금 확인 양식 */}
      {paymentStatus === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle>입금 확인</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="depositName">입금자명 *</Label>
                  <Input
                    id="depositName"
                    value={depositName}
                    onChange={(e) => setDepositName(e.target.value)}
                    placeholder="실제 입금한 이름을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="depositDate">입금일자 *</Label>
                  <Input
                    id="depositDate"
                    type="date"
                    value={depositDate}
                    onChange={(e) => setDepositDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="depositTime">입금시간 *</Label>
                <Input
                  id="depositTime"
                  type="time"
                  value={depositTime}
                  onChange={(e) => setDepositTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="memo">메모 (선택)</Label>
                <Textarea
                  id="memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="추가 메모가 있으시면 입력해주세요"
                  rows={3}
                />
              </div>
              <Button onClick={handleDepositConfirm} className="w-full">
                입금 완료 신고
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 입금 완료 상태 */}
      {paymentStatus === "completed" && (
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">입금 완료 신고가 접수되었습니다</h3>
            <p className="text-gray-600 mb-4">
              판매자가 입금을 확인하면 상품이 발송됩니다.
              <br />
              보통 1-2시간 내에 확인됩니다.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              입금 확인 대기 중...
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
