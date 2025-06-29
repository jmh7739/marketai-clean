"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, AlertCircle, CheckCircle, Clock, DollarSign } from "lucide-react"
import { RefundSystem } from "@/lib/refund-system"

interface RefundPolicyModalProps {
  trigger?: React.ReactNode
  auctionPhase?: "before_bid" | "during_auction" | "after_auction" | "payment_pending"
  userRole?: "seller" | "buyer"
}

export function RefundPolicyModal({
  trigger,
  auctionPhase = "before_bid",
  userRole = "buyer",
}: RefundPolicyModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const policies = RefundSystem.REFUND_POLICIES
  const cancellationRules = RefundSystem.CANCELLATION_RULES

  const currentRule = cancellationRules.find((rule) => rule.phase === auctionPhase)
  const canCancel = RefundSystem.canCancel(auctionPhase, userRole)

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case "auction_cancel":
        return <RefreshCw className="w-5 h-5 text-orange-500" />
      case "post_auction_cancel":
        return <Clock className="w-5 h-5 text-blue-500" />
      case "dispute_refund":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <DollarSign className="w-5 h-5 text-green-500" />
    }
  }

  const getRefundRateBadge = (rate: number) => {
    if (rate === 100) {
      return <Badge className="bg-green-500">100% 환불</Badge>
    } else if (rate >= 90) {
      return <Badge className="bg-blue-500">{rate}% 환불</Badge>
    } else {
      return <Badge className="bg-orange-500">{rate}% 환불</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            환불 정책 보기
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            환불 및 취소 정책
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 현재 상황에 대한 안내 */}
          <Card
            className={`border-2 ${canCancel.allowed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {canCancel.allowed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                현재 상황: {currentRule?.description}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">취소 가능 여부:</span>
                  <Badge variant={canCancel.allowed ? "default" : "destructive"}>
                    {canCancel.allowed ? "가능" : "불가능"}
                  </Badge>
                </div>
                {canCancel.penalty > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">패널티:</span>
                    <Badge variant="secondary">{canCancel.penalty}% 차감</Badge>
                  </div>
                )}
                {canCancel.reason && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">{canCancel.reason}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 환불 정책 목록 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">환불 정책 상세</h3>
            <div className="grid gap-4">
              {policies.map((policy) => (
                <Card key={policy.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPolicyIcon(policy.type)}
                        {policy.title}
                      </div>
                      {getRefundRateBadge(policy.refundRate)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{policy.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-lg text-green-600">{policy.refundRate}%</div>
                        <div className="text-sm text-gray-600">환불 비율</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-lg text-blue-600">{policy.processingDays}일</div>
                        <div className="text-sm text-gray-600">처리 기간</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-lg text-orange-600">{policy.feeDeduction}%</div>
                        <div className="text-sm text-gray-600">수수료 차감</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">적용 조건:</h4>
                      <ul className="space-y-1">
                        {policy.conditions.map((condition, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* 환불 절차 안내 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">환불 신청 절차</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium">환불 신청</h4>
                  <p className="text-sm text-gray-600">마이페이지에서 해당 거래의 환불 신청 버튼을 클릭합니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium">사유 작성</h4>
                  <p className="text-sm text-gray-600">환불 사유를 상세히 작성하고 필요시 증빙 자료를 첨부합니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium">관리자 검토</h4>
                  <p className="text-sm text-gray-600">관리자가 신청 내용을 검토하고 승인/거부를 결정합니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-blue-600">4</span>
                </div>
                <div>
                  <h4 className="font-medium">환불 처리</h4>
                  <p className="text-sm text-gray-600">승인된 경우 정책에 따라 환불이 처리됩니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                주의사항
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-yellow-800">
              <p>• 환불 정책은 거래 상황과 시점에 따라 다르게 적용됩니다.</p>
              <p>• 허위 신고나 악의적인 환불 요청 시 계정 제재를 받을 수 있습니다.</p>
              <p>• 환불 처리 기간은 영업일 기준이며, 주말 및 공휴일은 제외됩니다.</p>
              <p>• 분쟁 해결을 위한 증빙 자료는 반드시 보관해주세요.</p>
              <p>• 환불 관련 문의는 고객센터(1588-1234)로 연락주세요.</p>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)}>확인</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
