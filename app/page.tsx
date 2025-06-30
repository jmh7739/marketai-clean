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
          return new Date(transaction.completedAt).toDateString() === today
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

  useEffect(() => {
    // 페이지 로드 시 localStorage 이벤트 리스너 추가
    const handleStorageChange = () => {
      // 데이터 변경 시 컴포넌트들이 자동으로 업데이트되도록 함
      window.dispatchEvent(new Event("storage"))
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

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

          {/* 실시간 경매 현황 */}
          <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  실시간 경매 현황
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    LIVE
                  </span>
                </h2>
                <p className="text-gray-600 mt-1">실제 데이터 기반 경매 현황</p>
              </div>
            </div>

            {/* 실제 데이터 기반 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">진행중인 경매</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.activeAuctions}</p>
                  </div>
                  <div className="text-blue-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">↗ 실시간 업데이트</p>
              </div>

              <div className="bg-white rounded-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">전체 회원수</p>
                    <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
                  </div>
                  <div className="text-green-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">📝 실제 회원수</p>
              </div>

              <div className="bg-white rounded-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">오늘 거래 완료</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.todayDeals}</p>
                  </div>
                  <div className="text-orange-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-yellow-600 mt-2">🎯 실제 거래</p>
              </div>
            </div>
          </section>

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
