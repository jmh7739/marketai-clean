"use client"
import { useRouter } from "next/navigation"
import { User, LogOut, Phone, Settings, Heart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"

export function AuthButton() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogin = () => {
    router.push("/auth/phone")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleMyAccount = () => {
    router.push("/my-account")
  }

  const handleWatchlist = () => {
    router.push("/watchlist")
  }

  const handleOrders = () => {
    router.push("/my-account/orders")
  }

  if (!isAuthenticated || !user) {
    return (
      <Button onClick={handleLogin} variant="outline" className="flex items-center space-x-2">
        <Phone className="w-4 h-4" />
        <span>로그인</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>{user.name || "사용자"}</span>
          {user.isVerified && <span className="text-green-500 text-xs">✓</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleMyAccount}>
          <Settings className="w-4 h-4 mr-2" />내 계정
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWatchlist}>
          <Heart className="w-4 h-4 mr-2" />
          찜한 상품
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOrders}>
          <Package className="w-4 h-4 mr-2" />
          주문 내역
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
