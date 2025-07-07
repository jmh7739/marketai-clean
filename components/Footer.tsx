"use client"

import SafeLink from "@/components/SafeLink"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold">MarketAI</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              AI 기술로 더 안전하고 투명한 온라인 경매를 경험하세요. 실시간 가격 분석과 사기 방지 시스템으로 신뢰할 수
              있는 거래를 보장합니다.
            </p>
            <div className="flex space-x-4">
              <SafeLink href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </SafeLink>
              <SafeLink href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </SafeLink>
            </div>
          </div>

          {/* 고객 서비스 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">고객 서비스</h3>
            <ul className="space-y-2">
              <li>
                <SafeLink href="/help/faq" className="text-gray-300 hover:text-white">
                  자주 묻는 질문
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/help/contact" className="text-gray-300 hover:text-white">
                  고객센터
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/help/returns" className="text-gray-300 hover:text-white">
                  반품/교환
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/tracking" className="text-gray-300 hover:text-white">
                  배송조회
                </SafeLink>
              </li>
            </ul>
          </div>

          {/* 회사 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">회사</h3>
            <ul className="space-y-2">
              <li>
                <SafeLink href="/terms" className="text-gray-300 hover:text-white">
                  이용약관
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/privacy" className="text-gray-300 hover:text-white">
                  개인정보처리방침
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/notices" className="text-gray-300 hover:text-white">
                  공지사항
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/events" className="text-gray-300 hover:text-white">
                  이벤트
                </SafeLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 MarketAI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <SafeLink href="/terms" className="text-gray-400 hover:text-white text-sm">
                이용약관
              </SafeLink>
              <SafeLink href="/privacy" className="text-gray-400 hover:text-white text-sm">
                개인정보처리방침
              </SafeLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Named export

// Default export
export default Footer
