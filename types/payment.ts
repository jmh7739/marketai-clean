export interface PaymentMethod {
  id: string
  type: "card" | "bank" | "kakao" | "naver" | "payco"
  name: string
  icon: string
  isAvailable: boolean
}

export interface PaymentInfo {
  auctionId: string
  productTitle: string
  productImage: string
  finalPrice: number
  shippingFee: number
  totalAmount: number
  sellerId: string
  sellerName: string
  buyerId: string
  buyerName: string
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  transactionId?: string
  message: string
  error?: string
}

export interface PaymentHistory {
  id: string
  auctionId: string
  productTitle: string
  amount: number
  method: string
  status: "pending" | "completed" | "failed" | "refunded"
  createdAt: string
  completedAt?: string
}
