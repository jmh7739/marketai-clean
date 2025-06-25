"use client"

import { useRouter } from "next/navigation"

// 라우트 상수 정의
export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  PHONE_AUTH: "/auth/phone",
  SELL: "/sell",
  SEARCH: "/search",
  MY_ACCOUNT: "/my-account",
  ADMIN: "/admin",
  HELP: "/help",
  CONTACT: "/help/contact",
  TERMS: "/terms",
  PRIVACY: "/privacy",
} as const

// 라우트 생성 헬퍼
export const createRoute = {
  loginWithRedirect: (redirectTo: string) => `${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectTo)}`,
  signupWithRedirect: (redirectTo: string) => `${ROUTES.SIGNUP}?redirect=${encodeURIComponent(redirectTo)}`,
  product: (id: string) => `/product/${id}`,
  category: (slug: string) => `/category/${slug}`,
  subcategory: (categorySlug: string, subcategorySlug: string) => `/category/${categorySlug}/${subcategorySlug}`,
  search: (query: string) => `${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`,
}

// 네비게이션 훅
export function useAppNavigation() {
  const router = useRouter()

  const navigate = (path: string) => {
    router.push(path)
  }

  const goBack = () => {
    router.back()
  }

  const replace = (path: string) => {
    router.replace(path)
  }

  return {
    navigate,
    goBack,
    replace,
  }
}
