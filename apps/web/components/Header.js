import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MarketAI
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/sell" className="text-gray-700 hover:text-blue-600">
              판매하기
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600">
              카테고리
            </Link>
            <Link href="/deals" className="text-gray-700 hover:text-blue-600">
              특가
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-blue-600">
              로그인
            </Link>
            <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
