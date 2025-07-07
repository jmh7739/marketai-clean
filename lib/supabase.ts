import { createClient } from "@supabase/supabase-js"

// 환경변수 안전하게 처리
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Supabase 클라이언트 생성 (환경변수가 없으면 더미 클라이언트)
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// 데이터베이스 타입 정의
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  join_date: string
  verified: boolean
  rating: number
  total_sales: number
  total_purchases: number
  preferences?: string[]
  created_at: string
  updated_at: string
}

export interface Auction {
  id: string
  title: string
  description: string
  current_bid: number
  starting_bid: number
  buy_now_price?: number
  end_date: string
  seller_id: string
  seller_name: string
  category: string
  condition: string
  images: string[]
  bid_count: number
  watchers: number
  location: string
  shipping_cost: number
  status: "active" | "ended" | "sold"
  is_live: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface Bid {
  id: string
  auction_id: string
  bidder_id: string
  bidder_name: string
  amount: number
  timestamp: string
  is_auto_bid: boolean
  created_at: string
}

// 사용자 관련 함수들
export async function getUsers() {
  if (!supabase) return []

  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data || []
}

export async function getCurrentUser() {
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching current user:", error)
    return null
  }

  return data
}

export async function saveUser(userData: Partial<User>) {
  if (!supabase) throw new Error("Supabase not initialized")

  const { data, error } = await supabase.from("users").upsert(userData).select().single()

  if (error) {
    console.error("Error saving user:", error)
    throw error
  }

  return data
}

// 추가 함수들 (import 오류 해결용)
export async function upsertUser(userData: Partial<User>) {
  return saveUser(userData)
}

export async function getUserByFirebaseUid(firebaseUid: string) {
  if (!supabase) return null

  const { data, error } = await supabase.from("users").select("*").eq("firebase_uid", firebaseUid).single()

  if (error) {
    console.error("Error fetching user by Firebase UID:", error)
    return null
  }

  return data
}

export async function testSupabaseConnection() {
  if (!supabase) {
    return { success: false, error: "Supabase not configured" }
  }

  try {
    const { data, error } = await supabase.from("users").select("count").limit(1)
    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export function validateSupabaseConfig() {
  return {
    isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
    url: supabaseUrl,
    hasKey: Boolean(supabaseAnonKey),
  }
}

// 경매 관련 함수들
export async function getAuctions() {
  if (!supabase) return []

  const { data, error } = await supabase.from("auctions").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching auctions:", error)
    return []
  }

  return data || []
}

export async function getActiveAuctions() {
  if (!supabase) return []

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("auctions")
    .select("*")
    .eq("status", "active")
    .gt("end_date", now)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching active auctions:", error)
    return []
  }

  return data || []
}

export async function getPopularAuctions(limit = 4) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from("auctions")
    .select("*")
    .eq("status", "active")
    .gt("end_date", new Date().toISOString())
    .order("views", { ascending: false })
    .order("bid_count", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching popular auctions:", error)
    return []
  }

  return data || []
}

export async function getRecommendedAuctions(user: User | null, limit = 4) {
  if (!supabase) return []

  if (!user || !user.preferences || user.preferences.length === 0) {
    // 로그인하지 않았거나 선호도가 없으면 랜덤 추천
    const { data, error } = await supabase
      .from("auctions")
      .select("*")
      .eq("status", "active")
      .gt("end_date", new Date().toISOString())
      .limit(limit)

    if (error) {
      console.error("Error fetching recommended auctions:", error)
      return []
    }

    return data || []
  }

  // 사용자 선호 카테고리 기반 추천
  const { data, error } = await supabase
    .from("auctions")
    .select("*")
    .eq("status", "active")
    .gt("end_date", new Date().toISOString())
    .in("category", user.preferences)
    .limit(limit)

  if (error) {
    console.error("Error fetching recommended auctions:", error)
    return []
  }

  return data || []
}

export async function saveAuction(auctionData: Partial<Auction>) {
  if (!supabase) throw new Error("Supabase not initialized")

  const { data, error } = await supabase.from("auctions").upsert(auctionData).select().single()

  if (error) {
    console.error("Error saving auction:", error)
    throw error
  }

  return data
}

// 입찰 관련 함수들
export async function getBids() {
  if (!supabase) return []

  const { data, error } = await supabase.from("bids").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bids:", error)
    return []
  }

  return data || []
}

export async function saveBid(bidData: Partial<Bid>) {
  if (!supabase) throw new Error("Supabase not initialized")

  const { data, error } = await supabase.from("bids").insert(bidData).select().single()

  if (error) {
    console.error("Error saving bid:", error)
    throw error
  }

  // 경매 정보 업데이트
  if (bidData.auction_id && bidData.amount) {
    await supabase
      .from("auctions")
      .update({
        current_bid: bidData.amount,
        bid_count: supabase.sql`bid_count + 1`,
      })
      .eq("id", bidData.auction_id)
  }

  return data
}

// 통계 관련 함수들
export async function getRealStats() {
  if (!supabase) {
    return {
      totalUsers: 0,
      activeAuctions: 0,
      totalBids: 0,
    }
  }

  try {
    // 총 사용자 수
    const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

    // 활성 경매 수
    const { count: activeAuctions } = await supabase
      .from("auctions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .gt("end_date", new Date().toISOString())

    // 총 입찰 수
    const { count: totalBids } = await supabase.from("bids").select("*", { count: "exact", head: true })

    return {
      totalUsers: totalUsers || 0,
      activeAuctions: activeAuctions || 0,
      totalBids: totalBids || 0,
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      totalUsers: 0,
      activeAuctions: 0,
      totalBids: 0,
    }
  }
}

// 인증 관련 함수들
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error("Supabase not initialized")

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Error signing in:", error)
    throw error
  }

  return data
}

export async function signUpWithEmail(email: string, password: string, userData: { name: string; phone?: string }) {
  if (!supabase) throw new Error("Supabase not initialized")

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: userData.name,
        phone: userData.phone,
      },
    },
  })

  if (error) {
    console.error("Error signing up:", error)
    throw error
  }

  // 사용자 프로필 생성
  if (data.user) {
    await saveUser({
      id: data.user.id,
      name: userData.name,
      email: data.user.email!,
      phone: userData.phone,
      join_date: new Date().toISOString(),
      verified: false,
      rating: 5.0,
      total_sales: 0,
      total_purchases: 0,
      preferences: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  return data
}

export async function signOut() {
  if (!supabase) throw new Error("Supabase not initialized")

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export async function resetPassword(email: string) {
  if (!supabase) throw new Error("Supabase not initialized")

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) {
    console.error("Error resetting password:", error)
    throw error
  }
}

export async function updatePassword(newPassword: string) {
  if (!supabase) throw new Error("Supabase not initialized")

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    console.error("Error updating password:", error)
    throw error
  }
}

// 실시간 인증 상태 감지
export function onAuthStateChange(callback: (user: any) => void) {
  if (!supabase) return () => {}

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      // 사용자 프로필 정보 가져오기
      const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()

      callback(profile)
    } else {
      callback(null)
    }
  })

  return () => subscription.unsubscribe()
}

// DB 인스턴스 export 추가 (다른 파일에서 사용할 수 있도록)
export { supabase as db }
