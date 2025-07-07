"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Users, TrendingUp, Shield, Zap, Search, Heart, Bell, User, Gavel, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/Sidebar"
import { getCurrentUser as getLocalUser, setCurrentUser } from "@/lib/utils"
import {
  getRealStats,
  getPopularAuctions,
  getRecommendedAuctions,
  getCurrentUser as getFirebaseUser,
  signOut,
  onAuthStateChange,
  type Auction,
  type User as UserType,
} from "@/lib/firebase"

export default function HomePage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAuctions: 0,
    totalBids: 0,
  })
  const [popularAuctions, setPopularAuctions] = useState<Auction[]>([])
  const [recommendedAuctions, setRecommendedAuctions] = useState<Auction[]>([])
  const [currentUser, setCurrentUserState] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      loadData()

      // Firebase 인증 상태 감지 (실패해도 계속 진행)
      const unsubscribe = onAuthStateChange((user) => {
        if (user) {
          setCurrentUserState(user)
        } else {
          // Firebase 사용자가 없으면 로컬 사용자 확인
          const localUser = getLocalUser()
          setCurrentUserState(localUser)
        }
      })

      return () => unsubscribe()
    }
  }, [])

  const loadData = async () => {
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // 현재 사용자 확인 (로컬 우선, Firebase 백업)
      let user = getLocalUser()
      if (!user) {
        try {
          user = await getFirebaseUser()
        } catch (error) {
          console.warn("Firebase user fetch failed, using local user")
        }
      }
      setCurrentUserState(user)

      // 통계 가져오기 (Firebase 실패 시 로컬 데이터 사용)
      try {
        const realStats = await getRealStats()
        setStats(realStats)
      } catch (error) {
        console.warn("Firebase stats failed, using local stats")
        setStats({ totalUsers: 0, activeAuctions: 0, totalBids: 0 })
      }

      // 인기 경매 가져오기 (Firebase 실패 시 빈 배열)
      try {
        const popular = await getPopularAuctions(4)
        setPopularAuctions(popular)
      } catch (error) {
        console.warn("Firebase popular auctions failed")
        setPopularAuctions([])
      }

      // 추천 경매 가져오기 (Firebase 실패 시 빈 배열)
      try {
        const recommended = await getRecommendedAuctions(user, 4)
        setRecommendedAuctions(recommended)
      } catch (error) {
        console.warn("Firebase recommended auctions failed")
        setRecommendedAuctions([])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Firebase 로그아웃 시도
      try {
        await signOut()
      } catch (error) {
        console.warn("Firebase signout failed")
      }

      // 로컬 사용자 제거
      setCurrentUser(null)
      setCurrentUserState(null)
      await loadData()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">MarketAI를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">MarketAI</span>
              </div>

              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input type="search" placeholder="상품명, 브랜드, 카테고리 검색..." className="pl-10 pr-4" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="default" size="sm">
                  <Zap className="h-4 w-4 mr-1" />
                  판매하기
                </Button>
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Heart className="h-5 w-5" />
                </Button>
                {currentUser ? (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <User className="h-5 w-5" />
                      <span className="ml-1 hidden sm:inline">{currentUser.name}</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      로그아웃
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/login">
                      <Button variant="outline" size="sm">
                        <LogIn className="h-4 w-4 mr-1" />
                        로그인
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="default" size="sm">
                        <UserPlus className="h-4 w-4 mr-1" />
                        회원가입
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              스마트한 경매, <span className="text-yellow-300">MarketAI</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              AI 기반 가격 예측과 안전한 거래 시스템으로 더 스마트하고 투명한 경매를 경험하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                <Zap className="mr-2 h-5 w-5" />
                실시간 경매 참여
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Shield className="mr-2 h-5 w-5" />
                안전하게 판매하기
              </Button>
            </div>
          </div>
        </section>

        {/* Real Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.totalUsers > 0 ? `${stats.totalUsers.toLocaleString()}명` : "준비중"}
                  </div>
                  <div className="text-gray-600">총 회원수</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.activeAuctions > 0 ? `${stats.activeAuctions.toLocaleString()}개` : "준비중"}
                  </div>
                  <div className="text-gray-600">진행중인 경매</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.totalBids > 0 ? `${stats.totalBids.toLocaleString()}회` : "준비중"}
                  </div>
                  <div className="text-gray-600">총 입찰 수</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Auctions */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🔥 인기 경매</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">지금 가장 많은 관심을 받고 있는 경매들을 확인해보세요</p>
            </div>

            <div className="text-center py-16">
              <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-sm">
                <Gavel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">곧 시작됩니다!</h3>
                <p className="text-gray-600 mb-6">
                  MarketAI의 첫 번째 경매가 곧 시작됩니다. 첫 번째 판매자가 되어보세요!
                </p>
                <Button className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  경매 등록하기
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Auctions */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">✨ 맞춤 추천 경매</h2>
              {currentUser ? (
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {currentUser.name}님을 위한 맞춤 추천 경매가 준비되고 있습니다
                </p>
              ) : (
                <p className="text-gray-600 max-w-2xl mx-auto">
                  로그인하시면 개인 맞춤 추천 경매를 확인하실 수 있습니다
                </p>
              )}
            </div>

            {!currentUser ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-sm">
                  <LogIn className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">로그인이 필요합니다</h3>
                  <p className="text-gray-600 mb-6">개인 맞춤 추천 경매를 보려면 로그인해주세요</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link href="/login" className="flex-1">
                      <Button className="w-full">
                        <LogIn className="h-4 w-4 mr-2" />
                        로그인하기
                      </Button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        <UserPlus className="h-4 w-4 mr-2" />
                        회원가입
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-sm">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">맞춤 추천 준비중</h3>
                  <p className="text-gray-600 mb-6">{currentUser.name}님을 위한 맞춤 추천 경매가 곧 준비됩니다!</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    관심 카테고리 설정하기
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">이용 방법</h2>
              <p className="text-gray-600">간단한 3단계로 경매에 참여하세요</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">전화번호 인증</h3>
                <p className="text-gray-600">
                  전화번호로 간편하게 회원가입하고 SMS 인증을 통해 안전한 거래를 준비하세요
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">상품 검색</h3>
                <p className="text-gray-600">
                  AI 추천 시스템으로 원하는 상품을 쉽게 찾고 실시간 가격 동향을 확인하세요
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">입찰 & 거래</h3>
                <p className="text-gray-600">
                  실시간 입찰에 참여하고 안전한 에스크로 시스템으로 걱정 없는 거래를 완료하세요
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">지금 시작하세요!</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">MarketAI와 함께 더 스마트하고 안전한 경매를 경험해보세요</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!currentUser ? (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      <UserPlus className="mr-2 h-5 w-5" />
                      무료 회원가입
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                    >
                      <LogIn className="mr-2 h-5 w-5" />
                      로그인하기
                    </Button>
                  </Link>
                </>
              ) : (
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Zap className="mr-2 h-5 w-5" />
                  경매 시작하기
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <Gavel className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-xl text-white">MarketAI</span>
                </div>
                <p className="text-sm">AI 기반 스마트 경매 플랫폼으로 안전하고 투명한 거래를 제공합니다.</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-white">서비스</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/search" className="hover:text-white transition-colors">
                      경매 찾기
                    </Link>
                  </li>
                  <li>
                    <Link href="/live" className="hover:text-white transition-colors">
                      실시간 경매
                    </Link>
                  </li>
                  <li>
                    <Link href="/sell" className="hover:text-white transition-colors">
                      판매하기
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-white">고객지원</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/faq" className="hover:text-white transition-colors">
                      자주 묻는 질문
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors">
                      고객센터
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" className="hover:text-white transition-colors">
                      도움말
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-white">뉴스레터</h3>
                <p className="text-sm">최신 경매 정보를 받아보세요</p>
                <div className="flex space-x-2">
                  <Input type="email" placeholder="이메일 주소" className="bg-gray-800 border-gray-700 text-white" />
                  <Button variant="default" size="sm">
                    구독
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
              <p>&copy; 2024 MarketAI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
