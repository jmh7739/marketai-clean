export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  categoryId: string
  sellerId: string
  createdAt: Date
  updatedAt: Date
}

export interface Auction {
  id: string
  productId: string
  startPrice: number
  currentPrice: number
  endTime: Date
  status: 'active' | 'ended' | 'cancelled'
}