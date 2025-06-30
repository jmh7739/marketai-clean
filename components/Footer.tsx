"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-xl text-white">MarketAI</span>
            </div>
            <p className="text-sm text-gray-400">AI 기반 스마트 경매 플랫폼으로 안전하고 투명한 거래를 제공합니다.</p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">빠른 링크</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/live-auctions" className="hover:text-white transition-colors">
                  라이브 경매
                </Link>
              </li>
              <li>
                <Link href="/ending-soon" className="hover:text-white transition-colors">
                  마감 임박
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-white transition-colors">
                  판매하기
                </Link>
              </li>
              <li>
                <Link href="/search/advanced" className="hover:text-white transition-colors">
                  고급 검색
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  이벤트
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">고객 서비스</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help/faq" className="hover:text-white transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/help/contact" className="hover:text-white transition-colors">
                  고객센터
                </Link>
              </li>
              <li>
                <Link href="/help/returns" className="hover:text-white transition-colors">
                  반품/교환
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-white transition-colors">
                  배송 조회
                </Link>
              </li>
              <li>
                <Link href="/dispute-center" className="hover:text-white transition-colors">
                  분쟁 해결
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">뉴스레터</h3>
            <p className="text-sm text-gray-400">최신 경매 정보와 특별 혜택을 받아보세요.</p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="이메일 주소"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                구독
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@marketai.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>1588-1234</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>서울시 강남구 테헤란로 123</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/terms" className="hover:text-white transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/notices" className="hover:text-white transition-colors">
              공지사항
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors">
              관리자
            </Link>
          </div>
          <div className="text-sm text-gray-400">© 2024 MarketAI. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
