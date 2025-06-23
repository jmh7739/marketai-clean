export default function CategoryNav() {
  const categories = ["전자제품", "패션", "홈&가든", "스포츠", "자동차", "도서", "완구", "뷰티"]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 py-3 overflow-x-auto">
          {categories.map((category) => (
            <a
              key={category}
              href={`/category/${category}`}
              className="text-gray-700 hover:text-blue-600 whitespace-nowrap"
            >
              {category}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
