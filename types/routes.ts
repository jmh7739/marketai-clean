import type React from "react"
// Next.js App Router 라우트 타입 정의
export type AppRoutes =
  | "/"
  | "/sell"
  | "/search"
  | "/watchlist"
  | "/chat"
  | "/my-account"
  | "/category/electronics"
  | "/category/fashion"
  | "/category/home"
  | "/category/sports"
  | "/category/beauty"
  | "/category/kids"
  | "/category/books"
  | "/category/local"
  | "/deals"
  | "/popular"
  | "/events"
  | "/free-shipping"
  | "/ending-soon"
  | "/live-auctions"
  | "/admin"
  | "/auth/phone"
  | "/auth/verify"
  | "/payment/[auctionId]"
  | "/product/[id]"
  | "/category/[slug]"
  | "/category/[slug]/[subcategory]"

// Link 컴포넌트용 타입
export interface SafeLinkProps {
  href: AppRoutes | string
  children: React.ReactNode
  className?: string
  [key: string]: any
}
