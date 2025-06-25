"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gavel, Search } from "lucide-react"
import Link from "next/link"
import Hero from "@/components/Hero"
import HowItWorks from "@/components/HowItWorks"
import Footer from "@/components/Footer"

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제 상품 데이터 로드 시뮬레이션
    const loadProducts = async () => {
      try {
        // 실제로는 Firestore에서 데이터를 가져올 예정
        const userProducts = []
        setProducts(userProducts)
      } catch (error) {
        console.error("상품 로드 실패:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      <div className="container mx-auto px-4 py-8">
        {/* 현재 진행중인 경매 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Gavel className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold">현재 진행중인 경매</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                최신순
              </Button>
              <Button variant="outline" size="sm">
                마감임박순
              </Button>
              <Button variant="outline" size="sm">
                인기순
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* 실제 상품 데이터가 있을 때 표시 */}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Gavel className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">아직 등록된 경매가 없습니다</h3>
              <p className="text-gray-600 mb-6">첫 번째 판매자가 되어보세요!</p>
              <div className="flex justify-center gap-4">
                <Link href="/sell">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    상품 등록하기
                  </Button>
                </Link>
                <Link href="/search">
                  <Button variant="outline" size="lg">
                    <Search className="w-4 h-4 mr-2" />
                    상품 찾아보기
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* 빠른 액세스 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">빠른 액세스</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/live-auctions">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="font-semibold mb-2">실시간 경매</h3>
                  <p className="text-gray-600 text-sm">지금 진행 중인 경매를 확인하세요</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/ending-soon">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gavel className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold mb-2">마감임박</h3>
                  <p className="text-gray-600 text-sm">곧 종료되는 경매를 놓치지 마세요</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/search/advanced">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">고급 검색</h3>
                  <p className="text-gray-600 text-sm">원하는 조건으로 정확히 찾아보세요</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* 서비스 소개 */}
        <HowItWorks />
      </div>

      {/* 푸터 */}
      <Footer />
    </div>
  )
}
