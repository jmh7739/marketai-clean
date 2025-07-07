"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Share2, Clock, Eye, Users, MapPin, Truck } from "lucide-react"
import {
  formatPrice,
  formatTimeLeft,
  getCurrentUser,
  getAuctions,
  getBids,
  saveBid,
  generateId,
  type Auction,
  type Bid,
} from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface AuctionDetailPageClientProps {
  auctionId: string
}

export default function AuctionDetailPageClient({ auctionId }: AuctionDetailPageClientProps) {
  const router = useRouter()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [bidAmount, setBidAmount] = useState("")
  const [isWatching, setIsWatching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(getCurrentUser())

  useEffect(() => {
    const auctions = getAuctions()
    const foundAuction = auctions.find((a) => a.id === auctionId)

    if (foundAuction) {
      setAuction(foundAuction)
      setBidAmount((foundAuction.currentBid + 1000).toString())

      // 입찰 내역 가져오기
      const allBids = getBids()
      const auctionBids = allBids
        .filter((bid) => bid.auctionId === auctionId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setBids(auctionBids)
    }

    setLoading(false)
  }, [auctionId])

  const handleBid = () => {
    if (!currentUser) {
      toast({
        title: "로그인 필요",
        description: "입찰하려면 로그인해주세요.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!auction) return

    const amount = Number.parseInt(bidAmount)
    if (amount <= auction.currentBid) {
      toast({
        title: "입찰 실패",
        description: "현재 입찰가보다 높은 금액을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    const newBid: Bid = {
      id: generateId(),
      auctionId: auction.id,
      bidderId: currentUser.id,
      bidderName: currentUser.name,
      amount,
      timestamp: new Date().toISOString(),
      isAutoBid: false,
    }

    saveBid(newBid)

    // 경매 정보 업데이트
    const updatedAuction = {
      ...auction,
      currentBid: amount,
      bidCount: auction.bidCount + 1,
    }
    setAuction(updatedAuction)
    setBids([newBid, ...bids])
    setBidAmount((amount + 1000).toString())

    toast({
      title: "입찰 성공",
      description: `${formatPrice(amount)}로 입찰했습니다.`,
    })
  }

  const handleBuyNow = () => {
    if (!currentUser) {
      toast({
        title: "로그인 필요",
        description: "즉시구매하려면 로그인해주세요.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!auction?.buyNowPrice) return

    toast({
      title: "즉시구매 성공",
      description: `${formatPrice(auction.buyNowPrice)}에 구매했습니다.`,
    })

    // 실제로는 결제 페이지로 이동
    router.push(`/checkout/${auction.id}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">경매를 찾을 수 없습니다</h1>
        <Button onClick={() => router.push("/")}>홈으로 돌아가기</Button>
      </div>
    )
  }

  const isEnded = new Date(auction.endDate) <= new Date()
  const isOwner = currentUser?.id === auction.sellerId

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 이미지 갤러리 */}
      <div className="mb-8">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={auction.images[0] || "/placeholder.svg?height=400&width=600&query=auction item"}
            alt={auction.title}
            fill
            className="object-cover"
          />
        </div>
        {auction.images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {auction.images.slice(1, 5).map((image, index) => (
              <div key={index} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${auction.title} ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 상품 정보 */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{auction.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{auction.views.toLocaleString()}회 조회</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{auction.watchers}명 관심</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{auction.location}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsWatching(!isWatching)}>
                <Heart className={`w-4 h-4 ${isWatching ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 판매자 정보 */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>{auction.sellerName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{auction.sellerName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>⭐ 4.8</span>
                    <span>•</span>
                    <span>거래 128회</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 상품 설명 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>상품 설명</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{auction.description}</p>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">카테고리:</span>
                  <span className="ml-2">{auction.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">상태:</span>
                  <span className="ml-2">{auction.condition}</span>
                </div>
                <div>
                  <span className="text-gray-600">배송비:</span>
                  <span className="ml-2">{formatPrice(auction.shippingCost)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <span>택배배송</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 입찰 내역 */}
          <Card>
            <CardHeader>
              <CardTitle>입찰 내역 ({bids.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {bids.length === 0 ? (
                <p className="text-gray-500 text-center py-4">아직 입찰이 없습니다.</p>
              ) : (
                <div className="space-y-3">
                  {bids.slice(0, 10).map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">{bid.bidderName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{bid.bidderName}</p>
                          <p className="text-xs text-gray-500">{new Date(bid.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{formatPrice(bid.amount)}</p>
                        {bid.isAutoBid && (
                          <Badge variant="secondary" className="text-xs">
                            자동입찰
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 입찰 패널 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>현재 입찰가</CardTitle>
                {auction.isLive && (
                  <Badge variant="destructive" className="animate-pulse">
                    LIVE
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-blue-600">{formatPrice(auction.currentBid)}</p>
                <p className="text-sm text-gray-600">시작가: {formatPrice(auction.startingBid)}</p>
              </div>

              <div className="flex items-center space-x-2 text-red-600">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{formatTimeLeft(auction.endDate)}</span>
              </div>

              {!isEnded && !isOwner && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">입찰 금액</label>
                    <Input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="입찰 금액을 입력하세요"
                      min={auction.currentBid + 1000}
                      step={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1">최소 입찰가: {formatPrice(auction.currentBid + 1000)}</p>
                  </div>

                  <Button onClick={handleBid} className="w-full" size="lg">
                    입찰하기
                  </Button>

                  {auction.buyNowPrice && (
                    <Button onClick={handleBuyNow} variant="outline" className="w-full bg-transparent" size="lg">
                      즉시구매 {formatPrice(auction.buyNowPrice)}
                    </Button>
                  )}
                </div>
              )}

              {isEnded && (
                <div className="text-center py-4">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    경매 종료
                  </Badge>
                </div>
              )}

              {isOwner && (
                <div className="text-center py-4">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    내 경매
                  </Badge>
                </div>
              )}

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>입찰 수:</span>
                  <span>{auction.bidCount}회</span>
                </div>
                <div className="flex justify-between">
                  <span>관심 등록:</span>
                  <span>{auction.watchers}명</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비:</span>
                  <span>{formatPrice(auction.shippingCost)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
