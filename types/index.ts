export interface User {
  id: string
  name: string
  email: string
  phoneNumber: string
  phone: string
  createdAt: string
  verified: boolean
  joinDate: string
  rating: number
  totalSales: number
  totalPurchases: number
  avatar?: string
  bio?: string
  location?: string
  preferredCategories?: string[]
  notificationSettings?: {
    email: boolean
    sms: boolean
    push: boolean
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
  reservePrice?: number
  sellerId: string
  sellerName: string
  category: string
  condition: "new" | "like_new" | "good" | "fair" | "poor"
  startTime: string
  endTime: string
  status: "upcoming" | "active" | "ended" | "cancelled"
  bidCount: number
  watchCount: number
  location: string
  shippingOptions: ShippingOption[]
  paymentMethods: string[]
  returnPolicy: string
  createdAt: string
  updatedAt: string
  featured?: boolean
  tags?: string[]
}

export interface Bid {
  id: string
  auctionId: string
  bidderId: string
  bidderName: string
  amount: number
  timestamp: string
  isAutoBid?: boolean
  maxBid?: number
}

export interface ShippingOption {
  id: string
  name: string
  price: number
  estimatedDays: number
  trackingAvailable: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  children?: Category[]
  imageUrl?: string
  itemCount?: number
}

export interface SearchFilters {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string[]
  location?: string
  shippingOptions?: string[]
  sortBy?: "relevance" | "price_low" | "price_high" | "ending_soon" | "newest"
  itemsPerPage?: number
  page?: number
}

export interface Notification {
  id: string
  userId: string
  type: "bid_placed" | "auction_won" | "auction_lost" | "payment_received" | "item_shipped" | "message_received"
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
  metadata?: Record<string, any>
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  auctionId?: string
  content: string
  timestamp: string
  read: boolean
  type: "text" | "image" | "system"
}

export interface Transaction {
  id: string
  auctionId: string
  buyerId: string
  sellerId: string
  amount: number
  status: "pending" | "paid" | "shipped" | "delivered" | "completed" | "disputed" | "cancelled"
  paymentMethod: string
  shippingAddress: Address
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export interface Address {
  id?: string
  name: string
  phone: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault?: boolean
}

export interface PaymentMethod {
  id: string
  type: "card" | "bank_transfer" | "paypal" | "crypto"
  name: string
  details: Record<string, any>
  isDefault: boolean
  createdAt: string
}

export interface Review {
  id: string
  transactionId: string
  reviewerId: string
  revieweeId: string
  rating: number
  comment: string
  type: "buyer" | "seller"
  createdAt: string
}

export interface WatchlistItem {
  id: string
  userId: string
  auctionId: string
  createdAt: string
}

export interface AdminUser {
  id: string
  username: string
  email: string
  role: "admin" | "moderator" | "support"
  permissions: string[]
  createdAt: string
  lastLogin?: string
}

export interface SystemSettings {
  id: string
  key: string
  value: any
  description?: string
  updatedAt: string
  updatedBy: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}
