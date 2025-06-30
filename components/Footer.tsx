"use client"

import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SafeLink from "@/components/SafeLink"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-xl font-bold">MarketAI</span>
            </div>
            <p className="text-gray-400 mb-4">AI 기술로 더 스마트하고 안전한 온라인 경매 플랫폼을 제공합니다.</p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="p-2">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">서비스</h3>
            <ul className="space-y-2">
              <li>
                <SafeLink href="/live-auctions" className="text-gray-400 hover:text-white transition-colors">
                  실시간 경매
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/ending-soon" className="text-gray-400 hover:text-white transition-colors">
                  마감임박 경매
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/sell" className="text-gray-400 hover:text-white transition-colors">
                  판매하기
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/local-trade" className="text-gray-400 hover:text-white transition-colors">
                  직거래
                </SafeLink>
              </li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">고객지원</h3>
            <ul className="space-y-2">
              <li>
                <SafeLink href="/help/faq" className="text-gray-400 hover:text-white transition-colors">
                  자주 묻는 질문
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/help/contact" className="text-gray-400 hover:text-white transition-colors">
                  문의하기
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/help/returns" className="text-gray-400 hover:text-white transition-colors">
                  반품/교환
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/tracking" className="text-gray-400 hover:text-white transition-colors">
                  배송조회
                </SafeLink>
              </li>
            </ul>
          </div>

          {/* 뉴스레터 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">뉴스레터</h3>
            <p className="text-gray-400 mb-4">최신 경매 정보와 특가 소식을 받아보세요</p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="이메일 주소"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button>구독</Button>
            </div>
          </div>
        </div>

        {/* 연락처 정보 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>support@marketai.co.kr</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>1588-1234</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>서울시 강남구 테헤란로 123</span>
            </div>
          </div>
        </div>

        {/* 하단 링크 */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">© 2024 MarketAI. All rights reserved.</div>
          <div className="flex space-x-6 text-sm">
            <SafeLink href="/terms" className="text-gray-400 hover:text-white transition-colors">
              이용약관
            </SafeLink>
            <SafeLink href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              개인정보처리방침
            </SafeLink>
            <SafeLink href="/notices" className="text-gray-400 hover:text-white transition-colors">
              공지사항
            </SafeLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
