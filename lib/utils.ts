import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { User } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// User management functions
export function saveUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user))

    // Also save to users list
    const users = getUsers()
    const existingIndex = users.findIndex((u) => u.id === user.id)
    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }
    localStorage.setItem("users", JSON.stringify(users))
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("currentUser")
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

export function setCurrentUser(user: User | null): void {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("currentUser")
    }
  }
}

export function getUsers(): User[] {
  if (typeof window !== "undefined") {
    const usersStr = localStorage.getItem("users")
    return usersStr ? JSON.parse(usersStr) : []
  }
  return []
}

export function getUserById(id: string): User | null {
  const users = getUsers()
  return users.find((user) => user.id === id) || null
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount)
}

// Format date
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "방금 전"
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`

  return formatDate(date)
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
  }
  return phone
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}

// Generate random color
export function generateRandomColor(): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Sleep function
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
