"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface AdminAuthContextType {
  isAdminAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  adminLogin: () => void
  adminLogout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // 실제 로그인 로직 (API 호출 등)
      if (email === "admin@marketai.co.kr" && password === "admin123!@#") {
        setIsAdminAuthenticated(true)
        return { success: true, message: "로그인 성공" }
      } else {
        return { success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." }
      }
    } catch (error) {
      return { success: false, message: "로그인 중 오류가 발생했습니다." }
    }
  }

  const adminLogin = () => setIsAdminAuthenticated(true)
  const adminLogout = () => setIsAdminAuthenticated(false)

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        login,
        adminLogin,
        adminLogout,
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
