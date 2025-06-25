export interface EscrowTransaction {
  id: string
  orderId: string
  buyerId: string
  sellerId: string
  productId: string
  productTitle: string
  amount: number
  status: "payment_pending" | "paid" | "shipped" | "delivered" | "confirmed" | "completed" | "disputed" | "refunded"
  paymentDate?: Date
  shippingDate?: Date
  deliveryDate?: Date
  confirmationDate?: Date
  autoConfirmDate?: Date // 7일 후 자동 확정 날짜
  disputeReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseConfirmation {
  transactionId: string
  buyerId: string
  confirmationType: "manual" | "auto"
  confirmationDate: Date
  rating?: number
  review?: string
}
