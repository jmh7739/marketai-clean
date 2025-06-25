"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Search, TrendingUp, Shield, Zap } from "lucide-react"
import SafeLink from "@/components/SafeLink"
import { useState } from "react"
import { useAppNavigation } from "@/lib/navigation"

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const { navigate } = useAppNavigation()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI가 만드는{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              스마트 경매
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            인공지능 기술로 더 정확한 가격 예측과 안전한 거래를 제공하는 차세대 경매 플랫폼입니다.
          </p>

          {/* 검색바 */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="원하는 상품을 검색해보세요..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-8">
                검색
              </Button>
            </div>
          </form>

          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <SafeLink href="/search">
              <Button size="lg" className="px-8 py-3 text-lg">
                경매 둘러보기
              </Button>
            </SafeLink>
            <SafeLink href="/sell">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                판매하기
              </Button>
            </SafeLink>
          </div>

          {/* 특징 카드들 */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI 가격 예측</h3>
              <p className="text-gray-600">
                머신러닝 알고리즘으로 정확한 시장 가격을 예측하여 합리적인 거래를 도와드립니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">안전한 거래</h3>
              <p className="text-gray-600">
                에스크로 시스템과 사기 방지 AI로 안전하고 신뢰할 수 있는 거래 환경을 제공합니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">실시간 경매</h3>
              <p className="text-gray-600">실시간 입찰 시스템으로 역동적이고 흥미진진한 경매 경험을 제공합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
