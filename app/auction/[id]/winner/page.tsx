"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import AuctionWinnerFlow from "@/components/AuctionWinnerFlow"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useAuth } from "@/contexts/AuthContext"

interface WinnerData {
  auctionId: string
  winnerId: string
  finalPrice: number
  productTitle: string
  productImage: string
  sellerName: string
  sellerId: string
}

export default function AuctionWinnerPage() {
  const params = useParams()
  const auctionId = params.id as string
  const { user } = useAuth()
  const [winnerData, setWinnerData] = useState<WinnerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWinnerData = async () => {
      try {
        // 실제로는 API에서 낙찰 정보를 가져와야 함
        // 여기서는 모의 데이터 사용
        const mockData: WinnerData = {
          auctionId,
          winnerId: user?.id || "temp-user",
          finalPrice: 1250000,
          productTitle: "iPhone 15 Pro Max 256GB 자연 티타늄",
          productImage: "/placeholder.svg?height=300&width=300&text=iPhone",
          sellerName: "TechStore",
          sellerId: "seller-123",
        }

        setWinnerData(mockData)
      } catch (err) {
        setError("낙찰 정보를 불러오는데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }

    if (auctionId) {
      fetchWinnerData()
    }
  }, [auctionId, user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !winnerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600">{error || "낙찰 정보를 찾을 수 없습니다."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuctionWinnerFlow {...winnerData} />
    </div>
  )
}
