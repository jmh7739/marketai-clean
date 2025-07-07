import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MapPin, Eye, Users, Star } from "lucide-react"

// Next.js 15에서 params는 Promise입니다
interface AuctionPageProps {
  params: Promise<{ id: string }>
}

// 더미 데이터
const auctionData = {
  id: "1",
  title: "Vintage Rolex Submariner",
  description:
    "A beautiful vintage Rolex Submariner in excellent condition. This watch has been well-maintained and comes with original box and papers.",
  currentBid: 15000,
  startingBid: 10000,
  buyNowPrice: 20000,
  endDate: "2024-01-15T18:00:00Z",
  seller: {
    name: "John Smith",
    rating: 4.8,
    avatar: "/placeholder.svg?height=40&width=40&text=JS",
  },
  category: "Watches",
  condition: "Excellent",
  images: [
    "/placeholder.svg?height=400&width=400&text=Watch+1",
    "/placeholder.svg?height=400&width=400&text=Watch+2",
    "/placeholder.svg?height=400&width=400&text=Watch+3",
  ],
  bidCount: 23,
  watchers: 45,
  location: "New York, NY",
  shippingCost: 25,
  views: 234,
}

const recentBids = [
  { bidder: "User123", amount: 15000, time: "2 minutes ago" },
  { bidder: "WatchLover", amount: 14500, time: "5 minutes ago" },
  { bidder: "Collector99", amount: 14000, time: "8 minutes ago" },
  { bidder: "TimeKeeper", amount: 13500, time: "12 minutes ago" },
  { bidder: "VintageSeeker", amount: 13000, time: "15 minutes ago" },
]

export default async function AuctionPage({ params }: AuctionPageProps) {
  // Next.js 15에서 params를 await해야 합니다
  const { id } = await params

  // 실제로는 데이터베이스에서 경매 정보를 가져와야 합니다
  if (!auctionData) {
    notFound()
  }

  const timeLeft = new Date(auctionData.endDate).getTime() - new Date().getTime()
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 메인 이미지 및 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 이미지 갤러리 */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                <img
                  src={auctionData.images[0] || "/placeholder.svg"}
                  alt={auctionData.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 p-4">
                {auctionData.images.slice(1).map((image, index) => (
                  <div key={index} className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${auctionData.title} ${index + 2}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 상품 정보 */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{auctionData.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {auctionData.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {auctionData.watchers} watching
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {auctionData.location}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{auctionData.category}</Badge>
                  <Badge variant="outline">{auctionData.condition}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{auctionData.description}</p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Starting Bid:</span>
                  <span className="ml-2">${auctionData.startingBid.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium">Shipping:</span>
                  <span className="ml-2">${auctionData.shippingCost}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 판매자 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={auctionData.seller.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {auctionData.seller.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{auctionData.seller.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{auctionData.seller.rating}</span>
                    <span>rating</span>
                  </div>
                </div>
                <Button variant="outline" className="ml-auto bg-transparent">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 입찰 섹션 */}
        <div className="space-y-6">
          {/* 현재 입찰 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>Current Bid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">${auctionData.currentBid.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{auctionData.bidCount} bids</div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>
                  {hoursLeft > 0 ? `${hoursLeft}h ` : ""}
                  {minutesLeft}m left
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={`Min: $${(auctionData.currentBid + 100).toLocaleString()}`}
                    className="flex-1"
                  />
                  <Button>Place Bid</Button>
                </div>

                {auctionData.buyNowPrice && (
                  <Button className="w-full bg-transparent" variant="outline">
                    Buy Now - ${auctionData.buyNowPrice.toLocaleString()}
                  </Button>
                )}

                <Button className="w-full" variant="ghost">
                  Add to Watchlist
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 최근 입찰 내역 */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBids.map((bid, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <div className="font-medium">{bid.bidder}</div>
                      <div className="text-gray-600">{bid.time}</div>
                    </div>
                    <div className="font-bold">${bid.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 배송 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Returns</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${auctionData.shippingCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span>{auctionData.location}</span>
              </div>
              <div className="text-gray-600 mt-3">
                <p>• Fast and secure shipping</p>
                <p>• 30-day return policy</p>
                <p>• Buyer protection included</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
