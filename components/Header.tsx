"use client"

import type React from "react"
import { useState } from "react"
import { Search, Plus, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SafeLink from "@/components/SafeLink"
import { AuthButton } from "@/components/AuthButton"
import { ROUTES, createRoute, useAppNavigation } from "@/lib/navigation"
import { useAuth } from "@/contexts/AuthContext"

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { navigate } = useAppNavigation()
  const { isAuthenticated } = useAuth()

  const handleSellClick = () => {
    if (!isAuthenticated) {
      navigate(createRoute.loginWithRedirect(ROUTES.SELL))
      return
    }
    navigate(ROUTES.SELL)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* 로고 */}
        <SafeLink href={ROUTES.HOME} className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MarketAI
          </span>
        </SafeLink>

        {/* 검색바 */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="상품을 검색해보세요..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* 네비게이션 */}
        <nav className="flex items-center space-x-4">
          {/* 판매하기 버튼 */}
          <Button variant="outline" size="sm" className="hidden sm:flex" onClick={handleSellClick}>
            <Plus className="h-4 w-4 mr-2" />
            판매하기
          </Button>

          {/* 인증 버튼 */}
          <AuthButton />

          {/* 모바일 메뉴 버튼 */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-2">
            <SafeLink
              href={ROUTES.SELL}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              판매하기
            </SafeLink>
            {!isAuthenticated && (
              <>
                <SafeLink
                  href={ROUTES.LOGIN}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </SafeLink>
                <SafeLink
                  href={ROUTES.SIGNUP}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  회원가입
                </SafeLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export { Header }
export default Header
