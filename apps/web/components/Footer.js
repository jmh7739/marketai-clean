export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MarketAI</h3>
            <p className="text-gray-300">안전하고 편리한 온라인 마켓플레이스</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">고객 서비스</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/help" className="hover:text-white">
                  도움말
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  문의하기
                </a>
              </li>
              <li>
                <a href="/returns" className="hover:text-white">
                  반품/교환
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">판매자</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/sell" className="hover:text-white">
                  판매 시작하기
                </a>
              </li>
              <li>
                <a href="/seller-center" className="hover:text-white">
                  판매자 센터
                </a>
              </li>
              <li>
                <a href="/fees" className="hover:text-white">
                  수수료 안내
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">회사 정보</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/about" className="hover:text-white">
                  회사 소개
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-white">
                  채용
                </a>
              </li>
              <li>
                <a href="/press" className="hover:text-white">
                  보도자료
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 MarketAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
