export interface User {
  id: string
  email: string
  name: string
  phone?: string
  phoneNumber?: string
  createdAt: string
  verified: boolean
  joinDate?: string
  rating?: number
  totalSales?: number
  totalPurchases?: number
  avatar?: string
  location?: string
}

export interface Auction {
  id: string
  title: string
  description: string
  startingPrice: number
  currentPrice: number
  buyNowPrice?: number
  images: string[]
  category: string
  condition: string
  sellerId: string
  sellerName: string
  startTime: string
  endTime: string
  status: "active" | "ended" | "cancelled"
  bidCount: number
  watchers: number
  location?: string
  shipping?: {
    free: boolean
    cost?: number
    methods: string[]
  }
}

export interface Bid {
  id: string
  auctionId: string
  bidderId: string
  bidderName: string
  amount: number
  timestamp: string
  isAutoBid?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  subcategories?: Category[]
}

export interface Transaction {
  id: string
  auctionId: string
  buyerId: string
  sellerId: string
  amount: number
  status: "pending" | "completed" | "cancelled"
  createdAt: string
  paymentMethod?: string
}
