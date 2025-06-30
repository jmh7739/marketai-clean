"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, ShoppingCart, User, Menu, Heart, MessageCircle, Settings, LogOut } from "lucide-react"
import { getCurrentUser, setCurrentUser } from "@/lib/utils"
import type { User as UserType } from "@/types"

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Mock data for cart and notifications
    setCartCount(3)
    setNotificationCount(5)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setUser(null)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-bold text-xl">MarketAI</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="상품, 브랜드, 카테고리 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 h-10"
            />
            <Button type="submit" size="sm" className="absolute right-1 top-1 h-8 w-8 p-0" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">{notificationCount}</Badge>
            )}
          </Button>

          {/* Watchlist */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/watchlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>

          {/* Messages */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/messages">
              <MessageCircle className="h-5 w-5" />
            </Link>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="sm" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">{cartCount}</Badge>
              )}
            </Link>
          </Button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/my-account">
                    <User className="mr-2 h-4 w-4" />
                    <span>내 계정</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-account/orders">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>주문 내역</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-account/selling">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>판매 관리</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">회원가입</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </nav>
      </div>

      {/* Categories Bar */}
      <div className="border-t">
        <div className="container">
          <nav className="flex items-center space-x-6 py-2 text-sm">
            <Link href="/category/electronics" className="hover:text-primary">
              전자제품
            </Link>
            <Link href="/category/fashion" className="hover:text-primary">
              패션
            </Link>
            <Link href="/category/home" className="hover:text-primary">
              홈&가든
            </Link>
            <Link href="/category/sports" className="hover:text-primary">
              스포츠
            </Link>
            <Link href="/category/books" className="hover:text-primary">
              도서
            </Link>
            <Link href="/category/toys" className="hover:text-primary">
              장난감
            </Link>
            <Link href="/category/automotive" className="hover:text-primary">
              자동차
            </Link>
            <Link href="/live-auctions" className="text-red-600 font-medium hover:text-red-700">
              라이브 경매
            </Link>
            <Link href="/ending-soon" className="text-orange-600 font-medium hover:text-orange-700">
              마감 임박
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
