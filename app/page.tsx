"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import Hero from "@/components/Hero"
import FeaturedAuctions from "@/components/FeaturedAuctions"
import HowItWorks from "@/components/HowItWorks"
import Footer from "@/components/Footer"
import { getAuctions, getUsers, getTransactions } from "@/lib/utils"

export default function HomePage() {
  const [stats, setStats] = useState({
    activeAuctions: 0,
    totalUsers: 0,
    todayDeals: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const updateStats = () => {
      const auctions = getAuctions()
      const users = getUsers()
      const transactions = getTransactions()

      const now = new Date()
      const today = now.toDateString()

      // 진행중인 경매 (종료시간이 현재보다 미래)
      const activeAuctions = auctions.filter((auction: any) => {
        try {
          return new Date(auction.endTime) > now && auction.status === "active"
        } catch {
          return false
        }
      })

      // 오늘 완료된 거래
      const todayDeals = transactions.filter((transaction: any) => {
        try {
          return new Date(transaction.completedAt || transaction.createdAt).toDateString() === today
        } catch {
          return false
        }
      })

      setStats({
        activeAuctions: activeAuctions.length,
        totalUsers: users.length,
        todayDeals: todayDeals.length,
      })
    }

    updateStats()

    // 30초마다 업데이트
    const interval = setInterval(updateStats, 30000)

    // 로컬스토리지 변경 감지
    const handleStorageChange = () => updateStats()
    window.addEventListener("storage", handleStorageChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [mounted])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* 사이드바 */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* 메인 콘텐츠 */}
        <main className="flex-1">
          {/* 히어로 섹션 */}
          <Hero />

          {/* 추천 경매 */}
          <FeaturedAuctions />

          {/* How It Works */}
          <HowItWorks />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
