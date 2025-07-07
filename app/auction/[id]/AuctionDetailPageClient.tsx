"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Share2, Clock, Users, TrendingUp, Shield, MapPin, Truck, AlertCircle } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { formatPrice, formatTimeLeft } from "@/lib/utils"

interface Auction {
  id: string
  title: string
  description: string
  currentPrice: number
  startingPrice: number
  buyNowPrice?: number
  endTime: Date
  images: string[]
  seller: {
    id: string
    name: string
    rating: number
    totalSales: number
    avatar?: string
  }
  category: string
  condition: string
  location: string
  shipping: {
    free: boolean
    cost?: number
    methods: string[]
  }
  bids: Array<{
    id: string
    amount: number
    bidder: string
    timestamp: Date
  }>
  watchers: number
  views: number
  status: "active" | "ended" | "sold"
}

interface AuctionDetailPageClientProps {
  auctionId: string
}

export default function AuctionDetailPageClient({ auctionId }: AuctionDetailPageClientProps) {
  const router = useRouter()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [bidAmount, setBidAmount] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWatching, setIsWatching] = useState(false)

  useEffect(() => {
    // 실제로는 API에서 경매 데이터를 가져와야 합니다
    const fetchAuction = async () => {
      setIsLoading(true)

      // 시뮬레이션된 경매 데이터
      const mockAuction: Auction = {
        id: auctionId,
        title: "iPhone 15 Pro Max 256GB 자연 티타늄 - 새상품",
        description: `
          • 모델: iPhone 15 Pro Max 256GB
          • 색상: 자연 티타늄
          • 상태: 새상품 (미개봉)
          • 구성품: 본체, 충전케이블, 설명서 (어댑터 별매)
          • 구매일: 2024년 1월
          • A/S: 애플코리아 정식 A/S 가능
          
          최신 iPhone 15 Pro Max 새상품입니다.
          선물받았으나 사용하지 않아 경매로 내놓습니다.
          박스 개봉하지 않은 완전 새상품이며, 
          애플코리아 정식 A/S 받으실 수 있습니다.
        `,
        currentPrice: 1250000,
        startingPrice: 800000,
        buyNowPrice: 1500000,
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2일 후
        images: [
          "/placeholder.svg?height=400&width=400&text=iPhone+15+Pro+Max",
          "/placeholder.svg?height=400&width=400&text=Box+Front",
          "/placeholder.svg?height=400&width=400&text=Box+Back",
          "/placeholder.svg?height=400&width=400&text=Accessories",
        ],
        seller: {
          id: "seller123",
          name: "애플매니아",
          rating: 4.9,
          totalSales: 156,
          avatar: "/placeholder.svg?height=40&width=40&text=Seller",
        },
        category: "전자제품 > 스마트폰",
        condition: "새상품",
        location: "서울 강남구",
        shipping: {
          free: true,
          methods: ["택배", "직거래"],
        },
        bids: [
          {
            id: "bid1",
            amount: 1250000,
            bidder: "buyer***",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
          },
          {
            id: "bid2",
            amount: 1200000,
            bidder: "apple***",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          {
            id: "bid3",
            amount: 1150000,
            bidder: "phone***",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          },
        ],
        watchers: 45,
        views: 1234,
        status: "active",
      }

      setTimeout(() => {
        setAuction(mockAuction)
        setBidAmount((mockAuction.currentPrice + 10000).toString())
        setIsLoading(false)
      }, 1000)
    }

    fetchAuction()
  }, [auctionId])

  const handleBid = () => {
    if (!auction || !bidAmount) return

    const amount = Number.parseInt(bidAmount.replace(/,/g, ""))
    if (amount <= auction.currentPrice) {
      alert("현재 입찰가보다 높은 금액을 입력해주세요.")
      return
    }

    // 입찰 로직 구현
    console.log("입찰:", amount)
    alert(`${formatPrice(amount)}로 입찰하였습니다.`)
  }

  const handleBuyNow = () => {
    if (!auction?.buyNowPrice) return

    if (confirm(`${formatPrice(auction.buyNowPrice)}에 즉시 구매하시겠습니까?`)) {
      router.push(`/payment/${auction.id}`)
    }
  }

  const toggleWatch = () => {
    setIsWatching(!isWatching)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">경매 정보를 불러오는 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">경매를 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-4">요청하신 경매가 존재하지 않거나 삭제되었습니다.</p>
            <Button onClick={() => router.push("/")}>홈으로 돌아가기</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 이미지 및 상품 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 이미지 갤러리 */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={auction.images[selectedImageIndex] || "/placeholder.svg"}
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex space-x-2 overflow-x-auto">
                    {auction.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index ? "border-blue-500" : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`상품 이미지 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 상품 설명 */}
            <Card>
              <CardHeader>
                <CardTitle>상품 설명</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-gray-700">{auction.description}</div>
              </CardContent>
            </Card>

            {/* 입찰 내역 */}
            <Card>
              <CardHeader>
                <CardTitle>입찰 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auction.bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{bid.bidder.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{bid.bidder}</p>
                          <p className="text-sm text-gray-600">{bid.timestamp.toLocaleString("ko-KR")}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-blue-600">{formatPrice(bid.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 입찰 정보 */}
          <div className="space-y-6">
            {/* 경매 정보 카드 */}
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={auction.status === "active" ? "default" : "secondary"}>
                    {auction.status === "active" ? "진행중" : "종료"}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={toggleWatch}>
                      <Heart className={`w-4 h-4 ${isWatching ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl">{auction.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 현재 가격 */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">현재 입찰가</p>
                  <p className="text-3xl font-bold text-blue-600">{formatPrice(auction.currentPrice)}</p>
                  <p className="text-sm text-gray-600">시작가: {formatPrice(auction.startingPrice)}</p>
                </div>

                {/* 남은 시간 */}
                <div className="flex items-center space-x-2 text-red-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{formatTimeLeft(auction.endTime)}</span>
                </div>

                {/* 입찰 정보 */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span>{auction.bids.length}회 입찰</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{auction.watchers}명 관심</span>
                  </div>
                </div>

                <Separator />

                {/* 입찰하기 */}
                {auction.status === "active" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">입찰 금액</label>
                      <Input
                        type="text"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="입찰 금액을 입력하세요"
                        className="text-lg"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        최소 입찰가: {formatPrice(auction.currentPrice + 10000)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Button onClick={handleBid} className="w-full" size="lg">
                        입찰하기
                      </Button>
                      {auction.buyNowPrice && (
                        <Button onClick={handleBuyNow} variant="outline" className="w-full bg-transparent" size="lg">
                          {formatPrice(auction.buyNowPrice)} 즉시구매
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* 판매자 정보 */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">판매자 정보</h3>
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar>
                      <AvatarImage src={auction.seller.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{auction.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{auction.seller.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>⭐ {auction.seller.rating}</span>
                        <span>•</span>
                        <span>판매 {auction.seller.totalSales}회</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 상품 정보 */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">카테고리</span>
                    <span className="font-medium">{auction.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">상품 상태</span>
                    <span className="font-medium">{auction.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">위치</span>
                    <span className="font-medium flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {auction.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">배송</span>
                    <span className="font-medium flex items-center">
                      <Truck className="w-3 h-3 mr-1" />
                      {auction.shipping.free ? "무료배송" : `${auction.shipping.cost}원`}
                    </span>
                  </div>
                </div>

                {/* 안전거래 안내 */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-700 mb-2">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium text-sm">안전거래 보장</span>
                  </div>
                  <p className="text-xs text-green-600">
                    AI 사기 방지 시스템과 에스크로 서비스로 안전한 거래를 보장합니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
