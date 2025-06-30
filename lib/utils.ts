import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { User, Auction, Bid, Transaction } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ID 생성 함수
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// 날짜 포맷팅
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// 가격 포맷팅
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price)
}

// 시간 남은 시간 계산
export function getTimeRemaining(endTime: string): {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
} {
  const total = Date.parse(endTime) - Date.now()
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))

  return { total, days, hours, minutes, seconds }
}

// LocalStorage 관리
export function getFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : []
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error)
    return []
  }
}

export function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

// 사용자 관리
export function getUsers(): User[] {
  return getFromStorage<User>("marketai_users")
}

export function saveUser(user: User): void {
  const users = getUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)

  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  saveToStorage("marketai_users", users)
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const user = localStorage.getItem("marketai_current_user")
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return
  try {
    if (user) {
      localStorage.setItem("marketai_current_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("marketai_current_user")
    }
  } catch (error) {
    console.error("Error setting current user:", error)
  }
}

// 경매 관리
export function getAuctions(): Auction[] {
  return getFromStorage<Auction>("marketai_auctions")
}

export function saveAuction(auction: Auction): void {
  const auctions = getAuctions()
  const existingIndex = auctions.findIndex((a) => a.id === auction.id)

  if (existingIndex >= 0) {
    auctions[existingIndex] = auction
  } else {
    auctions.push(auction)
  }

  saveToStorage("marketai_auctions", auctions)
}

export function getAuctionById(id: string): Auction | null {
  const auctions = getAuctions()
  return auctions.find((a) => a.id === id) || null
}

// 입찰 관리
export function getBids(): Bid[] {
  return getFromStorage<Bid>("marketai_bids")
}

export function saveBid(bid: Bid): void {
  const bids = getBids()
  bids.push(bid)
  saveToStorage("marketai_bids", bids)

  // 경매의 현재 가격과 입찰 수 업데이트
  const auction = getAuctionById(bid.auctionId)
  if (auction) {
    auction.currentPrice = bid.amount
    auction.bidCount = bids.filter((b) => b.auctionId === bid.auctionId).length
    saveAuction(auction)
  }
}

export function getBidsByAuction(auctionId: string): Bid[] {
  const bids = getBids()
  return bids
    .filter((b) => b.auctionId === auctionId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// 거래 관리
export function getTransactions(): Transaction[] {
  return getFromStorage<Transaction>("marketai_transactions")
}

export function saveTransaction(transaction: Transaction): void {
  const transactions = getTransactions()
  const existingIndex = transactions.findIndex((t) => t.id === transaction.id)

  if (existingIndex >= 0) {
    transactions[existingIndex] = transaction
  } else {
    transactions.push(transaction)
  }

  saveToStorage("marketai_transactions", transactions)
}

// 통계 계산
export function getStats() {
  const auctions = getAuctions()
  const users = getUsers()
  const bids = getBids()
  const transactions = getTransactions()

  const activeAuctions = auctions.filter((a) => a.status === "active").length
  const totalUsers = users.length
  const totalBids = bids.length
  const totalTransactions = transactions.length

  return {
    activeAuctions,
    totalUsers,
    totalBids,
    totalTransactions,
  }
}

// 카테고리 데이터
export const categories = [
  {
    id: "electronics",
    name: "전자제품",
    slug: "electronics",
    subcategories: [
      { id: "smartphones", name: "스마트폰", slug: "smartphones", parentId: "electronics" },
      { id: "laptops", name: "노트북", slug: "laptops", parentId: "electronics" },
      { id: "tablets", name: "태블릿", slug: "tablets", parentId: "electronics" },
      { id: "cameras", name: "카메라", slug: "cameras", parentId: "electronics" },
    ],
  },
  {
    id: "fashion",
    name: "패션",
    slug: "fashion",
    subcategories: [
      { id: "clothing", name: "의류", slug: "clothing", parentId: "fashion" },
      { id: "shoes", name: "신발", slug: "shoes", parentId: "fashion" },
      { id: "bags", name: "가방", slug: "bags", parentId: "fashion" },
      { id: "accessories", name: "액세서리", slug: "accessories", parentId: "fashion" },
    ],
  },
  {
    id: "home",
    name: "홈&리빙",
    slug: "home",
    subcategories: [
      { id: "furniture", name: "가구", slug: "furniture", parentId: "home" },
      { id: "appliances", name: "가전제품", slug: "appliances", parentId: "home" },
      { id: "decor", name: "인테리어", slug: "decor", parentId: "home" },
      { id: "kitchen", name: "주방용품", slug: "kitchen", parentId: "home" },
    ],
  },
  {
    id: "sports",
    name: "스포츠",
    slug: "sports",
    subcategories: [
      { id: "fitness", name: "헬스", slug: "fitness", parentId: "sports" },
      { id: "outdoor", name: "아웃도어", slug: "outdoor", parentId: "sports" },
      { id: "team-sports", name: "구기종목", slug: "team-sports", parentId: "sports" },
      { id: "water-sports", name: "수상스포츠", slug: "water-sports", parentId: "sports" },
    ],
  },
  {
    id: "books",
    name: "도서",
    slug: "books",
    subcategories: [
      { id: "novels", name: "소설", slug: "novels", parentId: "books" },
      { id: "textbooks", name: "교재", slug: "textbooks", parentId: "books" },
      { id: "comics", name: "만화", slug: "comics", parentId: "books" },
      { id: "magazines", name: "잡지", slug: "magazines", parentId: "books" },
    ],
  },
  {
    id: "collectibles",
    name: "수집품",
    slug: "collectibles",
    subcategories: [
      { id: "art", name: "예술품", slug: "art", parentId: "collectibles" },
      { id: "antiques", name: "골동품", slug: "antiques", parentId: "collectibles" },
      { id: "coins", name: "동전", slug: "coins", parentId: "collectibles" },
      { id: "stamps", name: "우표", slug: "stamps", parentId: "collectibles" },
    ],
  },
]
