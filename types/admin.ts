export interface AdminStats {
  totalUsers: number
  totalProducts: number
  totalSales: number
  totalRevenue: number
  monthlyGrowth: {
    users: number
    sales: number
    revenue: number
  }
}

export interface SalesData {
  date: string
  sales: number
  revenue: number
}

export interface UserData {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
  totalPurchases: number
  totalSales: number
  status: "active" | "suspended" | "banned"
  lastActive: string
}

export interface ReportData {
  id: string
  reporterId: string
  reporterName: string
  targetId: string
  targetName: string
  targetType: "user" | "product" | "chat"
  reason: string
  description: string
  status: "pending" | "resolved" | "dismissed"
  createdAt: string
}

export interface ReviewData {
  id: string
  productId: string
  productTitle: string
  userId: string
  userName: string
  rating: number
  comment: string
  images?: string[]
  createdAt: string
  isVerified: boolean
}
