"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* 구매 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">구매</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/search" className="hover:text-blue-600">
                  등록
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-blue-600">
                  MarketAI 입찰 보장
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-blue-600">
                  입찰 및 구매 도움말
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-blue-600">
                  스토어
                </Link>
              </li>
            </ul>
          </div>

          {/* 판매 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">판매</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/sell" className="hover:text-blue-600">
                  판매 시작
                </Link>
              </li>
              <li>
                <Link href="/help/selling" className="hover:text-blue-600">
                  판매 방법 알아보기
                </Link>
              </li>
              <li>
                <Link href="/fees" className="hover:text-blue-600">
                  수수료
                </Link>
              </li>
            </ul>
          </div>

          {/* 도구 및 앱 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">도구 및 앱</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/mobile" className="hover:text-blue-600">
                  모바일 앱
                </Link>
              </li>
              <li>
                <Link href="/developers" className="hover:text-blue-600">
                  개발자
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-blue-600">
                  보안 센터
                </Link>
              </li>
            </ul>
          </div>

          {/* MarketAI 소개 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">MarketAI 소개</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-blue-600">
                  회사 정보
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-blue-600">
                  뉴스
                </Link>
              </li>
              <li>
                <Link href="/investors" className="hover:text-blue-600">
                  투자자
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-blue-600">
                  채용
                </Link>
              </li>
              <li>
                <Link href="/diversity" className="hover:text-blue-600">
                  다양성 및 포용성
                </Link>
              </li>
              <li>
                <Link href="/global" className="hover:text-blue-600">
                  글로벌 임팩트
                </Link>
              </li>
            </ul>
          </div>

          {/* 도움말 및 문의 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">도움말 및 문의</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/help" className="hover:text-blue-600">
                  판매자 정보 센터
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/resolution" className="hover:text-blue-600">
                  분쟁 해결
                </Link>
              </li>
            </ul>

            {/* 소셜 미디어 */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">커뮤니티</h4>
              <div className="flex space-x-3">
                <Link href="#" className="text-gray-400 hover:text-blue-600">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-600">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-600">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-600">
                  <Youtube className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600">
              <p>Copyright © 2024 MarketAI Inc. 모든 권리 보유.</p>
              <div className="flex space-x-4">
                <Link href="/privacy" className="hover:text-blue-600">
                  개인정보처리방침
                </Link>
                <Link href="/terms" className="hover:text-blue-600">
                  이용약관
                </Link>
                <Link href="/cookies" className="hover:text-blue-600">
                  쿠키 정책
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span className="text-sm text-gray-600">대한민국</span>
              <div className="w-6 h-4 bg-red-500 relative">
                <div className="absolute top-0 left-0 w-6 h-1 bg-red-500"></div>
                <div className="absolute top-1 left-0 w-6 h-1 bg-white"></div>
                <div className="absolute top-2 left-0 w-6 h-1 bg-blue-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
