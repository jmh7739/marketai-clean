import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 실제 데이터 타입 정의
export interface User {
  id: string
  name: string
  email: string
  phone: string
  password: string // 비밀번호 필드 추가
  avatar?: string
  joinDate: string
  verified: boolean
  rating: number
  totalSales: number
  totalPurchases: number
  preferences?: string[]
}

export interface Auction {
  id: string
  title: string
  description: string
  currentBid: number
  startingBid: number
  buyNowPrice?: number
  endDate: string
  sellerId: string
  sellerName: string
  category: string
  condition: string
  images: string[]
  bidCount: number
  watchers: number
  location: string
  shippingCost: number
  status: "active" | "ended" | "sold"
  isLive: boolean
  views: number
  createdAt: string
}

export interface Bid {
  id: string
  auctionId: string
  bidderId: string
  bidderName: string
  amount: number
  timestamp: string
  isAutoBid: boolean
}

// 로컬스토리지 키
const STORAGE_KEYS = {
  USERS: "marketai_users",
  AUCTIONS: "marketai_auctions",
  BIDS: "marketai_bids",
  CURRENT_USER: "marketai_current_user",
}

// 실제 사용자 데이터 관리
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    }
  } catch (error) {
    console.error("Failed to set current user:", error)
  }
}

export function saveUser(user: User): void {
  if (typeof window === "undefined") return
  try {
    const users = getUsers()
    const existingIndex = users.findIndex((u) => u.id === user.id)
    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  } catch (error) {
    console.error("Failed to save user:", error)
  }
}

// 실제 경매 데이터 관리
export function getAuctions(): Auction[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AUCTIONS)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getActiveAuctions(): Auction[] {
  const auctions = getAuctions()
  const now = new Date().toISOString()
  return auctions.filter((auction) => auction.status === "active" && auction.endDate > now)
}

// getPopularAuctions 함수 수정 - 항상 빈 배열 반환
export function getPopularAuctions(limit = 4): Auction[] {
  return []
}

// getRecommendedAuctions 함수 수정 - 항상 빈 배열 반환
export function getRecommendedAuctions(user: User | null, limit = 4): Auction[] {
  return []
}

export function saveAuction(auction: Auction): void {
  if (typeof window === "undefined") return
  try {
    const auctions = getAuctions()
    const existingIndex = auctions.findIndex((a) => a.id === auction.id)
    if (existingIndex >= 0) {
      auctions[existingIndex] = auction
    } else {
      auctions.push(auction)
    }
    localStorage.setItem(STORAGE_KEYS.AUCTIONS, JSON.stringify(auctions))
  } catch (error) {
    console.error("Failed to save auction:", error)
  }
}

// 실제 입찰 데이터 관리
export function getBids(): Bid[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BIDS)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveBid(bid: Bid): void {
  if (typeof window === "undefined") return
  try {
    const bids = getBids()
    bids.push(bid)
    localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(bids))

    // 경매 정보도 업데이트
    const auctions = getAuctions()
    const auctionIndex = auctions.findIndex((a) => a.id === bid.auctionId)
    if (auctionIndex >= 0) {
      auctions[auctionIndex].currentBid = bid.amount
      auctions[auctionIndex].bidCount += 1
      localStorage.setItem(STORAGE_KEYS.AUCTIONS, JSON.stringify(auctions))
    }
  } catch (error) {
    console.error("Failed to save bid:", error)
  }
}

// getRealStats 함수 수정 - 항상 0 반환
export function getRealStats() {
  return {
    totalUsers: 0,
    activeAuctions: 0,
    totalBids: 0,
    successRate: 0,
  }
}

// ID 생성 함수
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// 모든 데이터 완전 삭제 함수
export function clearAllData(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem(STORAGE_KEYS.USERS)
  localStorage.removeItem(STORAGE_KEYS.AUCTIONS)
  localStorage.removeItem(STORAGE_KEYS.BIDS)
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)

  // 페이지 새로고침
  window.location.reload()
}

/* -------------------------------------------------------------------------- */
/*                              Formatting Helpers                            */
/* -------------------------------------------------------------------------- */

/**
 * 금액을 ‘₩12,345’ 형태로 변환
 */
export function formatPrice(value?: number | null) {
  if (value === undefined || value === null) return "₩0"
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * formatCurrency 별칭 (formatPrice와 동일)
 */
export const formatCurrency = formatPrice

/**
 * 상대적 시간을 "2일 전", "3시간 전" 형식으로 반환
 */
export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days > 0) return `${days}일 전`
  if (hours > 0) return `${hours}시간 전`
  if (minutes > 0) return `${minutes}분 전`
  return "방금 전"
}

/**
 * 종료 시각(endDate)까지 남은 시간을 “2일 3 시간 4 분” 형식으로 반환
 */
export function formatTimeLeft(endDate: string) {
  const end = new Date(endDate).getTime()
  const diff = end - Date.now()

  if (diff <= 0) return "종료"

  const minutes = Math.floor(diff / 1000 / 60) % 60
  const hours = Math.floor(diff / 1000 / 60 / 60) % 24
  const days = Math.floor(diff / 1000 / 60 / 60 / 24)

  const parts: string[] = []
  if (days) parts.push(`${days}일`)
  if (hours) parts.push(`${hours}시간`)
  parts.push(`${minutes}분`)

  return parts.join(" ")
}

/**
 * 현재 사용자 완전 삭제
 */
export function clearCurrentUser(): void {
  if (typeof window === "undefined") return
  setCurrentUser(null)
}
