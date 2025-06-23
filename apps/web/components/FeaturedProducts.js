export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: "1,200,000원",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
    },
    {
      id: 2,
      name: "삼성 갤럭시 S24",
      price: "1,100,000원",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
    },
    {
      id: 3,
      name: "MacBook Air M3",
      price: "1,500,000원",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.9,
    },
    {
      id: 4,
      name: "AirPods Pro",
      price: "300,000원",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.6,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
            <p className="text-xl font-bold text-blue-600 mb-2">{product.price}</p>
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
