export interface User {
  id: string
  name: string
  email: string
  phone: string
  phoneNumber?: string
  avatar?: string
  createdAt: string
  isVerified?: boolean
  verified?: boolean
  role?: "user" | "admin"
  status?: "active" | "suspended"
  lastLoginAt?: string
  joinDate?: string
  rating?: number
  totalSales?: number
  totalPurchases?: number
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
  category: string
  subcategory?: string
  condition: "new" | "like-new" | "good" | "fair" | "poor"
  images: string[]
  startingPrice: number
  currentPrice: number
  buyNowPrice?: number
  reservePrice?: number
  startTime: string
  endTime: string
  sellerId: string
  sellerName: string
  status: "draft" | "active" | "ended" | "cancelled"
  bidCount: number
  watchers: number
  location?: string
  shippingOptions: ShippingOption[]
  paymentMethods: string[]
  returnPolicy?: string
  tags?: string[]
  featured?: boolean
  promoted?: boolean
  createdAt: string
  updatedAt: string
}

export interface Bid {
  id: string
  auctionId: string
  bidderId: string
  bidderName: string
  amount: number
  maxBid?: number
  timestamp: string
  isWinning: boolean
  isAutoBid?: boolean
  proxyBid?: boolean
}

export interface Transaction {
  id: string
  auctionId: string
  buyerId: string
  sellerId: string
  amount: number
  status: "pending" | "paid" | "shipped" | "delivered" | "completed" | "cancelled"
  paymentMethod: string
  shippingAddress: Address
  trackingNumber?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Address {
  name: string
  phone: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface ShippingOption {
  id: string
  name: string
  price: number
  estimatedDays: number
  description?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  parentId?: string
  subcategories?: Category[]
}

export interface Notification {
  id: string
  userId: string
  type: "bid" | "outbid" | "won" | "payment" | "shipping" | "system"
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: any
}

export interface WatchlistItem {
  id: string
  userId: string
  auctionId: string
  createdAt: string
}

export interface Review {
  id: string
  fromUserId: string
  toUserId: string
  auctionId: string
  rating: number
  comment: string
  type: "buyer" | "seller"
  createdAt: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  type: "text" | "image" | "system"
  read: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  participants: string[]
  auctionId?: string
  lastMessage?: Message
  updatedAt: string
  createdAt: string
}

export interface PaymentMethod {
  id: string
  userId: string
  type: "card" | "bank" | "paypal"
  name: string
  details: any
  isDefault: boolean
  createdAt: string
}

export interface AdminStats {
  totalUsers: number
  totalAuctions: number
  totalTransactions: number
  totalRevenue: number
  activeAuctions: number
  pendingPayments: number
  disputedTransactions: number
  newUsersToday: number
}

export interface SearchFilters {
  query?: string
  category?: string
  subcategory?: string
  minPrice?: number
  maxPrice?: number
  condition?: string[]
  location?: string
  endingSoon?: boolean
  buyNowOnly?: boolean
  sortBy?: "ending" | "price-low" | "price-high" | "newest" | "popular"
}

export interface AuctionFormData {
  title: string
  description: string
  category: string
  subcategory?: string
  condition: string
  images: File[]
  startingPrice: number
  buyNowPrice?: number
  reservePrice?: number
  duration: number
  location: string
  shippingOptions: ShippingOption[]
  returnPolicy: string
}
