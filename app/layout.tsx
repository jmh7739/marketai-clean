import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MarketAI - AI 기반 스마트 경매 플랫폼",
  description:
    "인공지능이 분석하는 실시간 가격 예측과 자동 입찰 시스템으로 더 똑똑하고 안전한 온라인 경매를 경험하세요",
  keywords: "경매, 온라인경매, AI, 인공지능, 스마트경매, 자동입찰",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
