import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import { AdminAuthProvider } from "@/contexts/AdminAuthContext"
import { ChatProvider } from "@/contexts/ChatContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MarketAI - AI 기반 온라인 경매 플랫폼",
  description: "AI 기술로 더 스마트하고 안전한 온라인 경매 플랫폼",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AdminAuthProvider>
              <ChatProvider>
                {children}
                <Toaster />
              </ChatProvider>
            </AdminAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
