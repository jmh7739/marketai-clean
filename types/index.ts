export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  createdAt: string // Date 대신 string으로 변경
  isVerified: boolean // isVerified 속성 추가
  role?: "user" | "admin"
  status?: "active" | "suspended" | "banned"
  lastLoginAt?: string
  preferences?: {
    notifications: boolean
    marketing: boolean
    language: string
  }
}

export interface Auction {
  id: string
  title: string
  description: string
  images: string[]
  startingPrice: number
  currentPrice: number
  buyNowPrice?: number
  endTime: string
  sellerId: string
  seller: {
    name: string
    rating: number
    isVerified: boolean
  }
  category: string
  condition: "new" | "like-new" | "good" | "fair" | "poor"
  location: string
  shippingOptions: {
    free: boolean
    cost?: number
    methods: string[]
  }
  status: "active" | "ended" | "cancelled"
  bidCount: number
  watchers: number
  createdAt: string
  updatedAt: string
}

export interface Bid {
  id: string
  auctionId: string
  bidderId: string
  bidder: {
    name: string
    isVerified: boolean
  }
  amount: number
  timestamp: string
  isAutoBid: boolean
  maxBid?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description?: string
  parentId?: string
  children?: Category[]
  itemCount: number
}

export interface Notification {
  id: string
  userId: string
  type: "bid" | "outbid" | "won" | "lost" | "payment" | "shipping" | "system"
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: string
}

export interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  senderName: string
  message: string
  timestamp: string
  type: "text" | "image" | "system"
  read: boolean
}

export interface ChatRoom {
  id: string
  participants: string[]
  auctionId?: string
  lastMessage?: ChatMessage
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  auctionId: string
  buyerId: string
  sellerId: string
  amount: number
  method: "card" | "bank" | "kakao" | "naver"
  status: "pending" | "completed" | "failed" | "refunded"
  createdAt: string
  completedAt?: string
}

export interface Review {
  id: string
  auctionId: string
  reviewerId: string
  revieweeId: string
  rating: number
  comment: string
  type: "buyer" | "seller"
  createdAt: string
}

export interface Violation {
  id: string
  userId: string
  type: "seller_fraud" | "buyer_fraud" | "fake_bid" | "non_payment" | "fake_product"
  description: string
  auctionId?: string
  reporterId?: string
  status: "pending" | "confirmed" | "dismissed"
  createdAt: string
  resolvedAt?: string
}

export interface AdminStats {
  totalUsers: number
  activeAuctions: number
  totalTransactions: number
  revenue: number
  pendingReports: number
  systemHealth: "good" | "warning" | "critical"
}
