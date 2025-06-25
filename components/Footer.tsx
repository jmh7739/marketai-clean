import SafeLink from "@/components/SafeLink"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* 로고 및 소개 */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <span className="text-sm font-bold text-white">M</span>
              </div>
              <span className="text-xl font-bold">MarketAI</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">AI 기술로 더 스마트하고 안전한 경매 플랫폼을 만들어갑니다.</p>
            <div className="flex space-x-4">
              <SafeLink href="#" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </SafeLink>
              <SafeLink href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </SafeLink>
              <SafeLink href="#" className="text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </SafeLink>
              <SafeLink href="#" className="text-gray-400 hover:text-white">
                <Youtube className="w-5 h-5" />
              </SafeLink>
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <h3 className="font-semibold mb-4">서비스</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <SafeLink href="/search" className="text-gray-400 hover:text-white">
                  경매 검색
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/sell" className="text-gray-400 hover:text-white">
                  판매하기
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/live-auctions" className="text-gray-400 hover:text-white">
                  실시간 경매
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/ending-soon" className="text-gray-400 hover:text-white">
                  마감임박
                </SafeLink>
              </li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h3 className="font-semibold mb-4">고객지원</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <SafeLink href="/help/faq" className="text-gray-400 hover:text-white">
                  자주묻는질문
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/help/contact" className="text-gray-400 hover:text-white">
                  고객센터
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/help/returns" className="text-gray-400 hover:text-white">
                  반품/교환
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/tracking" className="text-gray-400 hover:text-white">
                  배송조회
                </SafeLink>
              </li>
            </ul>
          </div>

          {/* 정책 */}
          <div>
            <h3 className="font-semibold mb-4">정책</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <SafeLink href="/terms" className="text-gray-400 hover:text-white">
                  이용약관
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/privacy" className="text-gray-400 hover:text-white">
                  개인정보처리방침
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/notices" className="text-gray-400 hover:text-white">
                  공지사항
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/events" className="text-gray-400 hover:text-white">
                  이벤트
                </SafeLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 MarketAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
