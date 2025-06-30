"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, TrendingUp, Users, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { getStats } from "@/lib/utils"
import SafeLink from "@/components/SafeLink"

export default function Hero() {
  const [stats, setStats] = useState({
    activeAuctions: 0,
    totalUsers: 0,
    totalBids: 0,
    totalTransactions: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const updateStats = () => {
      const currentStats = getStats()
      setStats(currentStats)
    }

    updateStats()
    const interval = setInterval(updateStats, 30000) // 30초마다 업데이트

    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI가 만드는
            <br />
            <span className="text-blue-600">스마트 경매</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            인공지능이 분석하는 실시간 가격 예측과 자동 입찰 시스템으로
            <br />더 똑똑하고 안전한 온라인 경매를 경험하세요
          </p>

          {/* 검색바 */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="원하는 상품을 검색해보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-32 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:ring-0"
              />
              <Button
                type="submit"
                size="lg"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-8"
              >
                <Search className="w-5 h-5 mr-2" />
                검색
              </Button>
            </div>
          </form>

          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="px-8 py-3 text-lg" asChild>
              <SafeLink href="/live-auctions">
                <TrendingUp className="w-5 h-5 mr-2" />
                실시간 경매 보기
              </SafeLink>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg bg-transparent" asChild>
              <SafeLink href="/sell">
                <Zap className="w-5 h-5 mr-2" />
                판매 시작하기
              </SafeLink>
            </Button>
          </div>
        </div>

        {/* 실시간 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.activeAuctions}</div>
              <div className="text-sm text-gray-600">진행중인 경매</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalUsers}</div>
              <div className="text-sm text-gray-600">전체 회원수</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalBids}</div>
              <div className="text-sm text-gray-600">총 입찰 수</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalTransactions}</div>
              <div className="text-sm text-gray-600">완료된 거래</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
