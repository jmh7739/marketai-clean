import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MarketAI</h3>
            <p className="text-gray-400">AI 기반 스마트 마켓플레이스</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-gray-400">
              <li>경매</li>
              <li>즉시구매</li>
              <li>AI 추천</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2 text-gray-400">
              <li>FAQ</li>
              <li>문의하기</li>
              <li>이용약관</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">연락처</h4>
            <p className="text-gray-400">support@marketai.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 MarketAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer