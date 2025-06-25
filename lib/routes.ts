// 앱의 모든 라우트를 문자열로 정의
export const ROUTES = {
  HOME: "/",
  SELL: "/sell",
  SEARCH: "/search",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  PHONE: "/auth/phone",
  PROFILE: "/my-account",
  ORDERS: "/my-account/orders",
  SELLING: "/my-account/selling",
  CHAT: "/chat",
  WATCHLIST: "/watchlist",
  ADMIN: "/admin",
  FAQ: "/help/faq",
  CONTACT: "/help/contact",
  TERMS: "/terms",
  PRIVACY: "/privacy",
} as const

// 동적 라우트 생성 함수들
export const createRoute = {
  product: (id: string): string => `/product/${id}`,
  category: (slug: string): string => `/category/${slug}`,
  subcategory: (slug: string, sub: string): string => `/category/${slug}/${sub}`,
  chatRoom: (roomId: string): string => `/chat/${roomId}`,
  payment: (auctionId: string): string => `/payment/${auctionId}`,
  loginWithRedirect: (redirect: string): string => `/auth/login?redirect=${encodeURIComponent(redirect)}`,
}

// 타입 정의
export type StaticRoute = (typeof ROUTES)[keyof typeof ROUTES]
export type DynamicRoute = ReturnType<(typeof createRoute)[keyof typeof createRoute]>
export type AppRoute = StaticRoute | DynamicRoute | string
