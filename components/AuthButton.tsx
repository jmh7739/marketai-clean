"use client"
import { useRouter } from "next/navigation"
import { User, LogOut, Phone } from "lucide-react"
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

  if (!isAuthenticated || !user) {
    return (
      <Button onClick={handleLogin} variant="outline">
        <Phone className="w-4 h-4 mr-2" />
        로그인
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleMyAccount}>
          <User className="w-4 h-4 mr-2" />내 계정
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
