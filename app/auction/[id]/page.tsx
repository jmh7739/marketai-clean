"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Gavel, Heart, Share2, AlertCircle } from "lucide-react"

interface AuctionPageProps {
  params: Promise<{ id: string }>
}

interface Auction {
  id: string
  title: string
  description: string
  currentBid: number
  startingBid: number
  endTime: string
  status: "active" | "ended" | "upcoming"
  images: string[]
  seller: {
    id: string
    name: string
    avatar: string
    rating: number
  }
  bids: Bid[]
  category: string
  condition: string
}

interface Bid {
  id: string
  amount: number
  bidder: {
    id: string
    name: string
    avatar: string
  }
  timestamp: string
}

export default function AuctionPage({ params }: AuctionPageProps) {
  const router = useRouter()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [bidAmount, setBidAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const loadAuction = async () => {
      try {
        const { id } = await params
        // Mock data - replace with actual API call
        const mockAuction: Auction = {
          id,
          title: "빈티지 카메라 - Canon AE-1",
          description:
            "1970년대 제작된 클래식 필름 카메라입니다. 완전 작동 상태이며, 렌즈와 케이스가 포함되어 있습니다.",
          currentBid: 150000,
          startingBid: 50000,
          endTime: "2024-01-20T15:00:00Z",
          status: "active",
          images: [
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
          ],
          seller: {
            id: "seller1",
            name: "김수집가",
            avatar: "/placeholder.svg?height=40&width=40",
            rating: 4.8,
          },
          bids: [
            {
              id: "1",
              amount: 150000,
              bidder: {
                id: "bidder1",
                name: "박구매자",
                avatar: "/placeholder.svg?height=32&width=32",
              },
              timestamp: "2024-01-15T14:30:00Z",
            },
            {
              id: "2",
              amount: 120000,
              bidder: {
                id: "bidder2",
                name: "이수집가",
                avatar: "/placeholder.svg?height=32&width=32",
              },
              timestamp: "2024-01-15T13:15:00Z",
            },
          ],
          category: "카메라",
          condition: "중고 - 우수",
        }
        setAuction(mockAuction)
      } catch (error) {
        console.error("Failed to load auction:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAuction()
  }, [params])

  useEffect(() => {
    if (!auction) return

    const updateTimeLeft = () => {
      const now = new Date().getTime()
      const endTime = new Date(auction.endTime).getTime()
      const difference = endTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft(`${days}일 ${hours}시간 ${minutes}분 ${seconds}초`)
      } else {
        setTimeLeft("경매 종료")
      }
    }

    updateTimeLeft()
    const timer = setInterval(updateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [auction])

  const handleBid = async () => {
    if (!auction || !bidAmount) return

    const amount = Number.parseInt(bidAmount)
    if (amount <= auction.currentBid) {
      alert("현재 입찰가보다 높은 금액을 입력해주세요.")
      return
    }

    try {
      // Mock API call - replace with actual implementation
      const newBid: Bid = {
        id: Date.now().toString(),
        amount,
        bidder: {
          id: "current-user",
          name: "현재 사용자",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        timestamp: new Date().toISOString(),
      }

      setAuction((prev) =>
        prev
          ? {
              ...prev,
              currentBid: amount,
              bids: [newBid, ...prev.bids],
            }
          : null,
      )

      setBidAmount("")
      alert("입찰이 완료되었습니다!")
    } catch (error) {
      console.error("Failed to place bid:", error)
      alert("입찰에 실패했습니다. 다시 시도해주세요.")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">경매를 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-4">요청하신 경매가 존재하지 않거나 삭제되었습니다.</p>
            <Button onClick={() => router.back()}>돌아가기</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        ← 돌아가기
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 이미지 섹션 */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={auction.images[0] || "/placeholder.svg"}
              alt={auction.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {auction.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${auction.title} ${index + 2}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">{auction.category}</Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{auction.title}</h1>
            <p className="text-gray-600">{auction.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={auction.seller.avatar || "/placeholder.svg"} />
              <AvatarFallback>{auction.seller.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{auction.seller.name}</p>
              <p className="text-sm text-gray-500">평점: {auction.seller.rating}/5.0</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                경매 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">현재 입찰가</span>
                <span className="text-2xl font-bold text-blue-600">{auction.currentBid.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">시작가</span>
                <span>{auction.startingBid.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">상태</span>
                <span>{auction.condition}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">남은 시간</span>
                </div>
                <span className="font-medium text-red-600">{timeLeft}</span>
              </div>
            </CardContent>
          </Card>

          {auction.status === "active" && (
            <Card>
              <CardHeader>
                <CardTitle>입찰하기</CardTitle>
                <CardDescription>현재 최고가보다 높은 금액을 입력해주세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="입찰 금액"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={auction.currentBid + 1000}
                  />
                  <Button onClick={handleBid} disabled={!bidAmount}>
                    입찰
                  </Button>
                </div>
                <p className="text-sm text-gray-500">최소 입찰 단위: 1,000원</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>입찰 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auction.bids.map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={bid.bidder.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{bid.bidder.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{bid.bidder.name}</p>
                        <p className="text-xs text-gray-500">{new Date(bid.timestamp).toLocaleString("ko-KR")}</p>
                      </div>
                    </div>
                    <span className="font-medium">{bid.amount.toLocaleString()}원</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
