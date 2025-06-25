"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { AdminUser } from "@/types/admin-auth"

interface AdminAuthContextType {
  admin: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // 테스트용 관리자 계정
      if (email === "admin@marketai.com" && password === "admin123!") {
        const adminUser: AdminUser = {
          id: "admin-1",
          email: "admin@marketai.com",
          name: "관리자",
          role: "super_admin",
          permissions: [
            { resource: "users", actions: ["read", "write", "delete"] },
            { resource: "products", actions: ["read", "write", "delete", "approve"] },
            { resource: "auctions", actions: ["read", "write", "delete", "approve"] },
            { resource: "payments", actions: ["read", "write"] },
            { resource: "reports", actions: ["read"] },
            { resource: "settings", actions: ["read", "write"] },
          ],
          createdAt: new Date(),
          lastLogin: new Date(),
          isActive: true,
        }

        setAdmin(adminUser)
        localStorage.setItem("admin", JSON.stringify(adminUser))
        return { success: true, message: "로그인 성공" }
      }

      return { success: false, message: "잘못된 이메일 또는 비밀번호입니다." }
    } catch (error) {
      return { success: false, message: "로그인 중 오류가 발생했습니다." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem("admin")
  }

  const isAuthenticated = admin !== null

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
