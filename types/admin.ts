export interface AdminStats {
  totalUsers: number
  activeAuctions: number
  totalRevenue: number
  pendingDisputes: number
  monthlyGrowth: number
  successfulTransactions: number
}

export interface SalesData {
  month: string
  sales: number
  revenue: number
}

export interface ReportData {
  id: string
  title: string
  type: "sales" | "users" | "disputes" | "revenue"
  dateRange: string
  status: "completed" | "pending" | "failed"
  createdAt: string
  data: any
}

export interface UserData {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
  status: "active" | "suspended" | "banned"
  totalPurchases: number
  totalSales: number
  avatar?: string
  verified: boolean
  rating: number
}

export interface AuctionData {
  id: string
  title: string
  currentBid: number
  endTime: string
  status: "active" | "ended" | "cancelled"
  sellerId: string
  sellerName: string
  category: string
  bidCount: number
}
