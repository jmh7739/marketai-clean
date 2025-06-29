"use client"

import type React from "react"

import { useState } from "react"
import { Search, Menu, X, Bell, User, Heart, Gavel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import SafeLink from "@/components/SafeLink"
import { useAuth } from "@/contexts/AuthContext"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, logout } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center gap-8">
            <SafeLink href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Gavel className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MarketAI</span>
            </SafeLink>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:flex items-center gap-6">
              <SafeLink href="/live-auctions" className="text-gray-700 hover:text-blue-600 transition-colors">
                실시간 경매
              </SafeLink>
              <SafeLink href="/ending-soon" className="text-gray-700 hover:text-blue-600 transition-colors">
                마감임박
              </SafeLink>
              <SafeLink href="/sell" className="text-gray-700 hover:text-blue-600 transition-colors">
                판매하기
              </SafeLink>
              <SafeLink href="/auction-test" className="text-red-600 hover:text-red-700 transition-colors font-medium">
                🔥 경매테스트
              </SafeLink>
            </nav>
          </div>

          {/* 검색바 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="상품명, 브랜드명으로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </form>
          </div>

          {/* 우측 메뉴 */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* 알림 */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </Button>

                {/* 찜 목록 */}
                <SafeLink href="/watchlist">
                  <Button variant="ghost" size="sm" className="relative">
                    <Heart className="w-5 h-5" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                      5
                    </Badge>
                  </Button>
                </SafeLink>

                {/* 사용자 메뉴 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="hidden md:block text-sm font-medium">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <SafeLink href="/my-account" className="w-full">
                        내 계정
                      </SafeLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <SafeLink href="/my-account/selling" className="w-full">
                        판매 관리
                      </SafeLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <SafeLink href="/my-account/orders" className="w-full">
                        구매 내역
                      </SafeLink>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <SafeLink href="/auth/login">
                  <Button variant="ghost" size="sm">
                    로그인
                  </Button>
                </SafeLink>
                <SafeLink href="/auth/signup">
                  <Button size="sm">회원가입</Button>
                </SafeLink>
              </>
            )}

            {/* 모바일 메뉴 버튼 */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* 모바일 검색바 */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="상품명, 브랜드명으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <nav className="space-y-2">
              <SafeLink
                href="/live-auctions"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                실시간 경매
              </SafeLink>
              <SafeLink
                href="/ending-soon"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                마감임박
              </SafeLink>
              <SafeLink
                href="/sell"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                판매하기
              </SafeLink>
              <SafeLink
                href="/auction-test"
                className="block px-4 py-2 text-red-600 hover:bg-gray-50 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🔥 경매테스트
              </SafeLink>
              {user && (
                <>
                  <div className="border-t my-2"></div>
                  <SafeLink
                    href="/my-account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    내 계정
                  </SafeLink>
                  <SafeLink
                    href="/watchlist"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    찜 목록
                  </SafeLink>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 rounded-lg"
                  >
                    로그아웃
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
