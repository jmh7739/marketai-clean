export interface RefundRequest {
  id: string
  userId: string
  auctionId: string
  amount: number
  reason: string
  status: "pending" | "approved" | "rejected" | "processed"
  createdAt: string
  updatedAt: string
  adminNotes?: string
  processedBy?: string
  processedAt?: string
}

export interface RefundStats {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  totalRefundAmount: number
}
