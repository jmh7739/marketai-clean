// 기본 타입 정의
export interface User {
  id: string
  name: string
  email?: string
  phone?: string
  profileImage?: string
  isVerified: boolean
  createdAt: Date
}

export interface Product {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  condition: string
  images: string[]
  price: number
  startPrice: number
  buyNowPrice?: number
  currentBid: number
  bidCount: number
  sellerId: string
  seller: User
  endTime: Date
  status: "active" | "ended" | "sold"
  shippingCost: number
  freeShipping: boolean
  pickupAvailable: boolean
  createdAt: Date
}

export interface Bid {
  id: string
  productId: string
  userId: string
  user: User
  amount: number
  timestamp: Date
  isWinning: boolean
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedOptions?: Record<string, string>
}

export interface ShippingInfo {
  freeShipping: boolean
  shippingCost: number
  conditionalFreeShipping: boolean
  freeShippingThreshold: number
  deliveryCompany: string
  deliveryTime: string
  pickupAvailable: boolean
  pickupLocation?: string
  pickupNote?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  subcategories: Subcategory[]
  productCount: number
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  categoryId: string
  productCount: number
}
