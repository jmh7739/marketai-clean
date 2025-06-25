export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  createdAt?: Date
}

export interface Product {
  id: string
  title: string
  description: string
  images: string[]
  startingPrice: number
  currentPrice: number
  endTime: Date
  sellerId: string
  category: string
  condition: string
  location: string
  views: number
  bids: number
  isActive: boolean
  createdAt: Date
}

export interface Bid {
  id: string
  productId: string
  userId: string
  amount: number
  timestamp: Date
  isWinning: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  subcategories?: Category[]
}
