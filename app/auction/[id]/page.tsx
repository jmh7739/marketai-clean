"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Clock, Users, Gavel, Heart, Share2 } from "lucide-react"

interface AuctionPageProps {
  params: Promise<{ id: string }>
}

interface Auction {
  id: string
  title: string
  description: string
  currentBid: number
  startingBid: number
  bidCount: number
  timeLeft: string
  endTime: string
  seller: {
    name: string
    avatar: string
    rating: number
  }
  images: string[]
  category: string
  condition: string
  bids: Array<{
    id: string
    bidder: string
    amount: number
    timestamp: string
  }>
}

export default function AuctionPage({ params }: AuctionPageProps) {
  const router = useRouter()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [bidAmount, setBidAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    async function loadAuction() {
      const { id } = await params

      // Mock data - replace with actual API call
      const mockAuction: Auction = {
        id,
        title: "빈티지 카메라 - Canon AE-1",
        description: "1970년대 제작된 빈티지 필름 카메라입니다. 작동 상태 양호하며, 렌즈와 함께 판매합니다.",
        currentBid: 150000,
        startingBid: 50000,
        bidCount: 12,
        timeLeft: "2일 14시간",
        endTime: "2024-01-20T18:00:00Z",
        seller: {
          name: "빈티지샵",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.8,
        },
        images: [
          "/placeholder.svg?height=400&width=400",
          "/placeholder.svg?height=400&width=400",
          "/placeholder.svg?height=400&width=400",
        ],
        category: "카메라",
        condition: "중고 - 양호",
        bids: [
          { id: "1", bidder: "user123", amount: 150000, timestamp: "2024-01-18T10:30:00Z" },
          { id: "2", bidder: "collector99", amount: 140000, timestamp: "2024-01-18T09:15:00Z" },
          { id: "3", bidder: "vintage_lover", amount: 130000, timestamp: "2024-01-18T08:45:00Z" },
        ],
      }

      setAuction(mockAuction)
      setLoading(false)
    }

    loadAuction()
  }, [params])

  const handleBid = () => {
    if (!bidAmount || !auction) return

    const amount = Number.parseInt(bidAmount)
    if (amount <= auction.currentBid) {
      alert("현재 입찰가보다 높은 금액을 입력해주세요.")
      return
    }

    // Mock bid submission
    const newBid = {
      id: Date.now().toString(),
      bidder: "current_user",
      amount,
      timestamp: new Date().toISOString(),
    }

    setAuction({
      ...auction,
      currentBid: amount,
      bidCount: auction.bidCount + 1,
      bids: [newBid, ...auction.bids],
    })

    setBidAmount("")
    alert("입찰이 완료되었습니다!")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">경매를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">요청하신 경매가 존재하지 않습니다.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        돌아가기
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 이미지 섹션 */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img
              src={auction.images[currentImageIndex] || "/placeholder.svg"}
              alt={auction.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {auction.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                  currentImageIndex === index ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${auction.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 경매 정보 섹션 */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">{auction.category}</Badge>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">{auction.title}</h1>
            <p className="text-gray-600">{auction.description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                현재 입찰 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">현재 최고가</span>
                  <span className="text-2xl font-bold text-blue-600">₩{auction.currentBid.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">시작가</span>
                  <span className="text-sm">₩{auction.startingBid.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    입찰 수
                  </span>
                  <span className="text-sm">{auction.bidCount}회</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    남은 시간
                  </span>
                  <span className="text-sm font-medium text-red-600">{auction.timeLeft}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>입찰하기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bid-amount">입찰 금액</Label>
                  <Input
                    id="bid-amount"
                    type="number"
                    placeholder={`${auction.currentBid + 10000} 이상`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={auction.currentBid + 1}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    최소 입찰 금액: ₩{(auction.currentBid + 10000).toLocaleString()}
                  </p>
                </div>

                <Button
                  onClick={handleBid}
                  className="w-full"
                  size="lg"
                  disabled={!bidAmount || Number.parseInt(bidAmount) <= auction.currentBid}
                >
                  <Gavel className="mr-2 h-4 w-4" />
                  입찰하기
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>판매자 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={auction.seller.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{auction.seller.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{auction.seller.name}</p>
                  <p className="text-sm text-gray-500">평점: {auction.seller.rating}/5.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 입찰 내역 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>입찰 내역</CardTitle>
          <CardDescription>최근 입찰 내역을 확인할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auction.bids.map((bid) => (
              <div key={bid.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{bid.bidder}</p>
                  <p className="text-xs text-gray-500">{new Date(bid.timestamp).toLocaleString("ko-KR")}</p>
                </div>
                <p className="font-bold text-blue-600">₩{bid.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
