"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Menu, X, Bell, Heart, User, Gavel } from "lucide-react"
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
import { useAuth } from "@/contexts/AuthContext"
import SafeLink from "@/components/SafeLink"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <SafeLink href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Gavel className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MarketAI</span>
            </SafeLink>
          </div>

          {/* 검색바 */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="상품을 검색해보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button type="submit" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* 네비게이션 */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" asChild>
              <SafeLink href="/sell">판매하기</SafeLink>
            </Button>

            {isAuthenticated ? (
              <>
                {/* 알림 */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </Button>

                {/* 찜한 상품 */}
                <Button variant="ghost" size="sm" asChild>
                  <SafeLink href="/watchlist">
                    <Heart className="w-5 h-5" />
                  </SafeLink>
                </Button>

                {/* 사용자 메뉴 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span className="hidden lg:block">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <SafeLink href="/my-account">내 계정</SafeLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <SafeLink href="/my-account/orders">주문 내역</SafeLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <SafeLink href="/my-account/selling">판매 내역</SafeLink>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>로그아웃</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <SafeLink href="/auth/login">로그인</SafeLink>
                </Button>
                <Button asChild>
                  <SafeLink href="/auth/signup">회원가입</SafeLink>
                </Button>
              </div>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <SafeLink href="/sell">판매하기</SafeLink>
              </Button>

              {isAuthenticated ? (
                <>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <SafeLink href="/my-account">내 계정</SafeLink>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <SafeLink href="/watchlist">찜한 상품</SafeLink>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <SafeLink href="/auth/login">로그인</SafeLink>
                  </Button>
                  <Button className="w-full" asChild>
                    <SafeLink href="/auth/signup">회원가입</SafeLink>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
