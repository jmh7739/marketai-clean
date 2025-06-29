import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

// 데이터베이스 함수들
export class SupabaseService {
  // 사용자 관련
  static async createUser(userData: Omit<User, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("users").insert(userData).select().single()

    return { data, error }
  }

  static async getUserByPhone(phone: string) {
    const { data, error } = await supabase.from("users").select("*").eq("phone", phone).single()

    return { data, error }
  }

  static async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

    return { data, error }
  }

  // 경매 관련
  static async getActiveAuctions(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from("auctions")
      .select(`
        *,
        seller:users(id, name, nickname, rating),
        category:categories(name, slug),
        highest_bid:bids(amount, bidder:users(name, nickname))
      `)
      .eq("status", "active")
      .gt("end_time", new Date().toISOString())
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    return { data, error }
  }

  static async getAuctionById(id: string) {
    const { data, error } = await supabase
      .from("auctions")
      .select(`
        *,
        seller:users(id, name, nickname, rating, profile_image),
        category:categories(name, slug),
        bids(
          id, amount, created_at, is_winning,
          bidder:users(name, nickname)
        )
      `)
      .eq("id", id)
      .single()

    return { data, error }
  }

  static async createAuction(auctionData: Omit<Auction, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("auctions").insert(auctionData).select().single()

    return { data, error }
  }

  static async updateAuction(id: string, updates: Partial<Auction>) {
    const { data, error } = await supabase.from("auctions").update(updates).eq("id", id).select().single()

    return { data, error }
  }

  // 입찰 관련
  static async createBid(bidData: Omit<Bid, "id" | "created_at">) {
    const { data, error } = await supabase.from("bids").insert(bidData).select().single()

    if (!error && data) {
      // 경매의 현재 가격과 입찰 수 업데이트
      await supabase
        .from("auctions")
        .update({
          current_price: bidData.amount,
          total_bids: supabase.sql`total_bids + 1`,
        })
        .eq("id", bidData.auction_id)
    }

    return { data, error }
  }

  static async getBidsByAuction(auctionId: string) {
    const { data, error } = await supabase
      .from("bids")
      .select(`
        *,
        bidder:users(name, nickname, rating)
      `)
      .eq("auction_id", auctionId)
      .order("amount", { ascending: false })

    return { data, error }
  }

  // 카테고리 관련
  static async getCategories() {
    const { data, error } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order")

    return { data, error }
  }

  // 관심목록 관련
  static async addToWatchlist(userId: string, auctionId: string) {
    const { data, error } = await supabase
      .from("watchlist")
      .insert({ user_id: userId, auction_id: auctionId })
      .select()
      .single()

    return { data, error }
  }

  static async removeFromWatchlist(userId: string, auctionId: string) {
    const { error } = await supabase.from("watchlist").delete().eq("user_id", userId).eq("auction_id", auctionId)

    return { error }
  }

  static async getUserWatchlist(userId: string) {
    const { data, error } = await supabase
      .from("watchlist")
      .select(`
        *,
        auction:auctions(
          *,
          seller:users(name, nickname),
          category:categories(name)
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    return { data, error }
  }

  // 실시간 구독
  static subscribeToAuctions(callback: (payload: any) => void) {
    return supabase
      .channel("auctions")
      .on("postgres_changes", { event: "*", schema: "public", table: "auctions" }, callback)
      .subscribe()
  }

  static subscribeToAuctionBids(auctionId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`auction-${auctionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
          filter: `auction_id=eq.${auctionId}`,
        },
        callback,
      )
      .subscribe()
  }
}
