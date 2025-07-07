export interface RefundRequest {
  id: string
  orderId: string
  userId: string
  amount: number
  reason: string
  status: "pending" | "approved" | "rejected" | "processed"
  requestDate: Date
  processedDate?: Date
  adminNotes?: string
  refundMethod: "original_payment" | "store_credit" | "bank_transfer"
  customerEmail: string
  customerName: string
  productName: string
  attachments?: string[]
}

export interface RefundStats {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  totalRefundAmount: number
  averageProcessingTime: number
}

export type RefundStatus = "pending" | "approved" | "rejected" | "processed"
export type RefundMethod = "original_payment" | "store_credit" | "bank_transfer"
