export interface AdminStats {
  totalUsers: number
  totalAuctions: number
  totalRevenue: number
  activeUsers: number
  pendingDisputes: number
  completedTransactions: number
}

export interface SalesData {
  date: string
  revenue: number
  transactions: number
  users: number
}

export interface ReportData {
  id: string
  title: string
  type: "sales" | "users" | "auctions" | "disputes"
  dateRange: {
    start: string
    end: string
  }
  data: any[]
  createdAt: string
  createdBy: string
  status: "generating" | "completed" | "failed"
}

export interface UserData {
  id: string
  email: string
  name: string
  createdAt: string
  lastLogin: string
  status: "active" | "suspended" | "pending"
}

export interface AuctionData {
  id: string
  title: string
  seller: string
  currentBid: number
  endDate: string
  status: "active" | "completed" | "cancelled"
  bidCount: number
}
