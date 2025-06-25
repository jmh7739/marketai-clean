"use client"

import { useRouter } from "next/navigation"

// 단순한 라우트 상수들
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
} as const

// 동적 라우트 생성 함수들
export const createRoute = {
  product: (id: string) => `/product/${id}`,
  category: (slug: string) => `/category/${slug}`,
  chatRoom: (roomId: string) => `/chat/${roomId}`,
  loginWithRedirect: (redirect: string) => `/auth/login?redirect=${encodeURIComponent(redirect)}`,
}

// 간단한 네비게이션 훅
export function useAppNavigation() {
  const router = useRouter()

  return {
    navigate: (path: string) => {
      router.push(path as any) // 타입 에러 우회
    },
    navigateBack: () => router.back(),
    navigateReplace: (path: string) => {
      router.replace(path as any) // 타입 에러 우회
    },
    refresh: () => router.refresh(),
  }
}
