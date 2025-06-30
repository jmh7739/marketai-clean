import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const db = supabase

export default supabase

// 타입 정의
export interface User {
  id: string
  email?: string
  phone: string
  name: string
  nickname?: string
  profile_image?: string
  rating: number
  total_sales: number
  total_purchases: number
  is_verified: boolean
  is_banned: boolean
  created_at: string
  updated_at: string
}

export interface Auction {
  id: string
  seller_id: string
  category_id: string
  title: string
  description: string
  condition: "new" | "like_new" | "good" | "fair" | "poor"
  starting_price: number
  current_price: number
  buy_now_price?: number
  reserve_price?: number
  total_bids: number
  images: string[]
  location?: string
  shipping_cost: number
  shipping_method: string
  status: "draft" | "active" | "ended" | "cancelled" | "sold"
  start_time: string
  end_time: string
  auto_extend: boolean
  featured: boolean
  view_count: number
  watch_count: number
  created_at: string
  updated_at: string
  seller?: User
  category?: Category
  highest_bid?: Bid
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Bid {
  id: string
  auction_id: string
  bidder_id: string
  amount: number
  is_auto_bid: boolean
  max_bid_amount?: number
  is_winning: boolean
  created_at: string
  bidder?: User
}
