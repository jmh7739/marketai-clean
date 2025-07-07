export interface RefundPolicy {
  id: string
  type: "auction_cancel" | "post_auction_cancel" | "dispute_refund"
  title: string
  description: string
  conditions: string[]
  refundRate: number // 0-100 (환불 비율)
  processingDays: number
  feeDeduction: number // 차감되는 수수료
}

export interface RefundRequest {
  id: string
  userId: string
  auctionId: string
  productTitle: string
  reason: string
  requestType: "seller_cancel" | "buyer_cancel" | "dispute"
  amount: number
  status: "pending" | "approved" | "rejected" | "completed"
  adminNotes?: string
  createdAt: Date
  processedAt?: Date
  processedBy?: string
}

export interface CancellationRule {
  phase: "before_bid" | "during_auction" | "after_auction" | "payment_pending"
  allowedBy: "seller" | "buyer" | "both" | "admin_only"
  penaltyRate: number
  description: string
}
