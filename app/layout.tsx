import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MarketAI - AI 기반 경매 플랫폼",
  description: "AI 기술을 활용한 스마트 경매 플랫폼에서 안전하고 편리한 거래를 경험하세요.",
  keywords: ["경매", "AI", "온라인 쇼핑", "중고거래", "MarketAI"],
  authors: [{ name: "MarketAI Team" }],
  openGraph: {
    title: "MarketAI - AI 기반 경매 플랫폼",
    description: "AI 기술을 활용한 스마트 경매 플랫폼",
    type: "website",
    locale: "ko_KR",
  },
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
