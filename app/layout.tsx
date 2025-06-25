import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import { UserProvider } from "@/contexts/UserContext"
import { ShoppingCartProvider } from "@/contexts/ShoppingCartContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { ChatProvider } from "@/contexts/ChatContext"
import { AdminAuthProvider } from "@/contexts/AdminAuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MarketAI - 스마트 경매 플랫폼",
  description: "AI 기반 스마트 경매 플랫폼 MarketAI",
  generator: "MarketAI",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MarketAI" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <AdminAuthProvider>
            <UserProvider>
              <ShoppingCartProvider>
                <ChatProvider>
                  <div className="min-h-screen bg-gray-50">
                    {/* 헤더 - 전체 너비 */}
                    <Header />

                    {/* 메인 레이아웃 - 플렉스 컨테이너 */}
                    <div className="flex">
                      {/* 사이드바 - 고정 너비 */}
                      <div className="w-64 flex-shrink-0">
                        <Sidebar />
                      </div>

                      {/* 메인 콘텐츠 - 나머지 공간 차지 */}
                      <main className="flex-1 min-w-0">{children}</main>
                    </div>
                  </div>
                </ChatProvider>
              </ShoppingCartProvider>
            </UserProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
