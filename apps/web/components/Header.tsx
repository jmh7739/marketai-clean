"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, User, Menu, X, Plus } from "lucide-react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      {/* 상단 헤더 */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">안전한 거래를 위해 본인인증을 완료해주세요</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/help" className="text-gray-600 hover:text-blue-600">
                고객센터
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-blue-600">
                로그인
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-blue-600">
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 헤더 */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">MarketAI</span>
          </Link>

          {/* 검색바 */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="어떤 상품을 찾고 계신가요?"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* 우측 메뉴 */}
          <div className="flex items-center space-x-4">
            {/* 판매하기 버튼 */}
            <Link href="/sell">
              <button className="hidden md:flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>판매하기</span>
              </button>
            </Link>

            {/* 알림 */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* 프로필 */}
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <User className="w-6 h-6" />
            </button>

            {/* 모바일 메뉴 버튼 */}
            <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 모바일 검색바 */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="상품 검색..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 카테고리 네비게이션 */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center space-x-8 py-3 overflow-x-auto">
            <Link href="/category/electronics" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">
              전자제품
            </Link>
            <Link href="/category/fashion" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">
              패션
            </Link>
            <Link href="/category/beauty" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">
              뷰티
            </Link>
            <Link href="/category/sports" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">
              스포츠
            </Link>
            <Link href="/category/books" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">
              도서
            </Link>
            <Link href="/category/home" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">
              홈&리빙
            </Link>
            <Link href="/category/kids" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">
              유아동
            </Link>
            <Link href="/category/other" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">
              기타
            </Link>
          </nav>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-4">
            <Link href="/sell" className="flex items-center space-x-2 text-blue-600 font-medium">
              <Plus className="w-4 h-4" />
              <span>판매하기</span>
            </Link>
            <Link href="/my-auctions" className="block text-gray-600">
              내 경매
            </Link>
            <Link href="/watchlist" className="block text-gray-600">
              관심목록
            </Link>
            <Link href="/messages" className="block text-gray-600">
              메시지
            </Link>
            <Link href="/help" className="block text-gray-600">
              고객센터
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
