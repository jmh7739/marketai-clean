import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { User, Auction, Bid, Transaction } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Data management functions
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("marketai_users")
  return users ? JSON.parse(users) : []
}

export function saveUser(user: User): void {
  if (typeof window === "undefined") return
  const users = getUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)

  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem("marketai_users", JSON.stringify(users))
}

export function getAuctions(): Auction[] {
  if (typeof window === "undefined") return []
  const auctions = localStorage.getItem("marketai_auctions")
  return auctions ? JSON.parse(auctions) : []
}

export function saveAuction(auction: Auction): void {
  if (typeof window === "undefined") return
  const auctions = getAuctions()
  const existingIndex = auctions.findIndex((a) => a.id === auction.id)

  if (existingIndex >= 0) {
    auctions[existingIndex] = auction
  } else {
    auctions.push(auction)
  }

  localStorage.setItem("marketai_auctions", JSON.stringify(auctions))
}

export function getBids(): Bid[] {
  if (typeof window === "undefined") return []
  const bids = localStorage.getItem("marketai_bids")
  return bids ? JSON.parse(bids) : []
}

export function saveBid(bid: Bid): void {
  if (typeof window === "undefined") return
  const bids = getBids()
  bids.push(bid)
  localStorage.setItem("marketai_bids", JSON.stringify(bids))
}

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return []
  const transactions = localStorage.getItem("marketai_transactions")
  return transactions ? JSON.parse(transactions) : []
}

export function saveTransaction(transaction: Transaction): void {
  if (typeof window === "undefined") return
  const transactions = getTransactions()
  transactions.push(transaction)
  localStorage.setItem("marketai_transactions", JSON.stringify(transactions))
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const currentUser = localStorage.getItem("marketai_current_user")
  return currentUser ? JSON.parse(currentUser) : null
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem("marketai_current_user", JSON.stringify(user))
  } else {
    localStorage.removeItem("marketai_current_user")
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function getTimeRemaining(endTime: string): string {
  const now = new Date().getTime()
  const end = new Date(endTime).getTime()
  const diff = end - now

  if (diff <= 0) return "경매 종료"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}일 ${hours}시간`
  if (hours > 0) return `${hours}시간 ${minutes}분`
  return `${minutes}분`
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}
