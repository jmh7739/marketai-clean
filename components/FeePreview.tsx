"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calculator, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FeeCalculator } from "@/lib/fee-calculator"

export default function FeePreview() {
  const [amount, setAmount] = useState<number>(0)
  const [feeInfo, setFeeInfo] = useState<any>(null)

  useEffect(() => {
    if (amount > 0) {
      try {
        const info = FeeCalculator.getFeePreview(amount)
        setFeeInfo(info)
      } catch (error) {
        setFeeInfo(null)
      }
    } else {
      setFeeInfo(null)
    }
  }, [amount])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0
    setAmount(value)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-5 h-5" />
          <span>수수료 계산기</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="amount">판매 금액</Label>
          <Input
            id="amount"
            type="text"
            value={amount > 0 ? amount.toLocaleString() : ""}
            onChange={handleAmountChange}
            placeholder="예: 150,000"
            className="text-right"
          />
        </div>

        {feeInfo && (
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">판매 금액</span>
                <span className="font-medium">₩{feeInfo.originalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">수수료 ({feeInfo.feeRate})</span>
                <span className="text-red-600 font-medium">-₩{feeInfo.fee.toLocaleString()}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between items-center">
                <span className="font-medium">실제 수령액</span>
                <span className="text-green-600 font-bold text-lg">₩{feeInfo.netAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* 수수료 구조 안내 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">수수료 구조</span>
          </div>
          <div className="space-y-2">
            {FeeCalculator.getFeeStructureDescription().map((desc, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{desc.split(":")[0]}</span>
                <Badge variant="secondary" className="text-xs">
                  {desc.split(":")[1].trim()}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">* 수수료는 낙찰 시점에 자동으로 차감됩니다</div>
      </CardContent>
    </Card>
  )
}
