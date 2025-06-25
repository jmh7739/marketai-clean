"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Product } from "@/types"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ShoppingCart, MessageCircle } from "lucide-react"
import { useShoppingCart } from "@/contexts/ShoppingCartContext"
import { useUser } from "@/contexts/UserContext"
import { useChat } from "@/contexts/ChatContext"

const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null)
  const { id } = useParams()
  const router = useRouter()
  const { addItemToCart } = useShoppingCart()
  const { user } = useUser()
  const { createRoom } = useChat()

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`)
      const data = await res.json()
      setProduct(data)
    }

    fetchProduct()
  }, [id])

  if (!product) {
    return <div>Loading...</div>
  }

  const handleAddToCart = () => {
    addItemToCart(product)
  }

  const handleStartChat = async () => {
    if (!user) {
      router.push("/auth/phone")
      return
    }

    try {
      const room = await createRoom(product.id, product.sellerId, product.title, product.images[0])
      router.push(`/chat/${room.id}`)
    } catch (error) {
      console.error("채팅방 생성 실패:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.images[0] || "/placeholder.svg"} alt={product.title} className="w-full h-auto rounded-lg" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-xl font-semibold mb-4">Price: {formatPrice(product.price)}</p>
          <div className="flex flex-col gap-2">
            <Button onClick={handleStartChat} className="w-full bg-green-600 hover:bg-green-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              판매자와 채팅하기
            </Button>
            <Button onClick={handleAddToCart} className="w-full bg-blue-600 hover:bg-blue-700">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
