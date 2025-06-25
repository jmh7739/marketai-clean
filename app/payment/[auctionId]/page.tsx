"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import MockPaymentSystem from "@/components/MockPaymentSystem"
import PaymentSuccess from "@/components/PaymentSuccess"
import PaymentFailure from "@/components/PaymentFailure"
import type { PaymentInfo, PaymentResult } from "@/types/payment"

export default function PaymentPage() {
  const params = useParams()
  const auctionId = params.auctionId as string

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)
  const [currentStep, setCurrentStep] = useState<"payment" | "success" | "failure">("payment")

  useEffect(() => {
    // 실제로는 API에서 경매 정보를 가져와야 함
    const mockPaymentInfo: PaymentInfo = {
      auctionId,
      productTitle: "iPhone 15 Pro Max 256GB - 자연 티타늄",
      productImage: "/placeholder.svg?height=200&width=200&text=iPhone",
      finalPrice: 1350000,
      shippingFee: 3000,
      totalAmount: 1353000,
      sellerId: "seller123",
      sellerName: "애플스토어",
      buyerId: "buyer456",
      buyerName: "김구매자",
    }

    setPaymentInfo(mockPaymentInfo)
  }, [auctionId])

  const handlePaymentComplete = (result: PaymentResult) => {
    setPaymentResult(result)
    setCurrentStep(result.success ? "success" : "failure")
  }

  const handleRetry = () => {
    setCurrentStep("payment")
    setPaymentResult(null)
  }

  const handleCancel = () => {
    window.history.back()
  }

  if (!paymentInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {currentStep === "payment" && (
          <MockPaymentSystem
            paymentInfo={paymentInfo}
            onPaymentComplete={handlePaymentComplete}
            onCancel={handleCancel}
          />
        )}

        {currentStep === "success" && paymentResult && (
          <PaymentSuccess paymentResult={paymentResult} paymentInfo={paymentInfo} />
        )}

        {currentStep === "failure" && paymentResult && (
          <PaymentFailure paymentResult={paymentResult} paymentInfo={paymentInfo} onRetry={handleRetry} />
        )}
      </div>
    </div>
  )
}
