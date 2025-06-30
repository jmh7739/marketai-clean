"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin" | "super_admin"
}

interface AdminAuthContextType {
  user: AdminUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

interface AdminAuthProviderProps {
  children: ReactNode
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 로컬 스토리지에서 관리자 세션 확인
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("admin_user")
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error("Failed to parse saved admin user:", error)
          localStorage.removeItem("admin_user")
        }
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)

    try {
      // 실제 구현에서는 서버 API 호출
      // 여기서는 데모용 하드코딩
      if (email === "admin@marketai.com" && password === "admin123") {
        const adminUser: AdminUser = {
          id: "admin_1",
          email: "admin@marketai.com",
          name: "관리자",
          role: "admin",
        }

        setUser(adminUser)
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_user", JSON.stringify(adminUser))
        }
        return true
      }

      return false
    } catch (error) {
      console.error("Admin login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_user")
    }
  }

  const value: AdminAuthContextType = {
    user,
    login,
    logout,
    loading,
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
