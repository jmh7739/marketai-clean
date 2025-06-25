"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface AdminAuthContextType {
  isAdminAuthenticated: boolean
  adminLogin: () => void
  adminLogout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  const adminLogin = () => setIsAdminAuthenticated(true)
  const adminLogout = () => setIsAdminAuthenticated(false)

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, adminLogin, adminLogout }}>
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
