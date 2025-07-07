"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Gavel, TrendingUp, Shield } from "lucide-react"
import SafeLink from "@/components/SafeLink"

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI가 만드는 <br />
            <span className="text-blue-600">스마트한 경매</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            인공지능 기술로 더 안전하고 투명한 온라인 경매를 경험하세요. 실시간 가격 분석과 사기 방지 시스템으로 신뢰할
            수 있는 거래를 보장합니다.
          </p>

          {/* 검색바 */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input type="search" placeholder="원하는 상품을 검색해보세요..." className="pl-10 py-3 text-lg" />
              </div>
              <Button size="lg" className="px-8">
                검색
              </Button>
            </div>
          </div>

          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="px-8 py-3" asChild>
              <SafeLink href="/live-auctions">
                <Gavel className="w-5 h-5 mr-2" />
                실시간 경매 참여
              </SafeLink>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent" asChild>
              <SafeLink href="/sell">판매하기</SafeLink>
            </Button>
          </div>

          {/* 특징 */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI 가격 분석</h3>
              <p className="text-gray-600">실시간 시장 데이터를 분석하여 적정 가격을 제안합니다</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">사기 방지 시스템</h3>
              <p className="text-gray-600">AI 기반 사기 탐지로 안전한 거래 환경을 제공합니다</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gavel className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">실시간 경매</h3>
              <p className="text-gray-600">실시간으로 진행되는 투명하고 공정한 경매 시스템</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
