"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="text-xl font-bold mb-4">MarketAI</h3>
            <p className="text-gray-400 mb-4">AI 기반 스마트 경매 플랫폼으로 더 나은 거래 경험을 제공합니다.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">서비스</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/live-auctions" className="text-gray-400 hover:text-white">
                  실시간 경매
                </Link>
              </li>
              <li>
                <Link href="/ending-soon" className="text-gray-400 hover:text-white">
                  마감임박 경매
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-gray-400 hover:text-white">
                  판매하기
                </Link>
              </li>
              <li>
                <Link href="/my-account" className="text-gray-400 hover:text-white">
                  내 계정
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help/faq" className="text-gray-400 hover:text-white">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/help/contact" className="text-gray-400 hover:text-white">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/help/returns" className="text-gray-400 hover:text-white">
                  반품/환불
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="text-gray-400 hover:text-white">
                  배송조회
                </Link>
              </li>
            </ul>
          </div>

          {/* 정책 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">정책</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/notices" className="text-gray-400 hover:text-white">
                  공지사항
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white">
                  이벤트
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 MarketAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
