"use client"

import { useState } from "react"
import { User, Package, Heart, MessageCircle, Settings, Bell, Star, Gavel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "대시보드", icon: User },
    { id: "auctions", label: "내 경매", icon: Gavel },
    { id: "selling", label: "판매 중", icon: Package },
    { id: "watchlist", label: "관심목록", icon: Heart },
    { id: "messages", label: "메시지", icon: MessageCircle },
    { id: "profile", label: "프로필", icon: Settings },
    { id: "notifications", label: "알림설정", icon: Bell },
  ]

  const myAuctions = [
    {
      id: 1,
      title: "iPhone 15 Pro Max 256GB",
      currentPrice: 1200000,
      myBid: 1150000,
      timeLeft: "4시간 30분",
      status: "winning",
      image: "/placeholder.svg?height=80&width=80&text=iPhone",
    },
    {
      id: 2,
      title: "MacBook Air M2 13인치",
      currentPrice: 1350000,
      myBid: 1300000,
      timeLeft: "1일 8시간",
      status: "outbid",
      image: "/placeholder.svg?height=80&width=80&text=MacBook",
    },
  ]

  const sellingItems = [
    {
      id: 3,
      title: "iPad Pro 11인치 M2",
      currentPrice: 950000,
      startPrice: 800000,
      bidCount: 18,
      timeLeft: "2일 14시간",
      viewCount: 89,
      image: "/placeholder.svg?height=80&width=80&text=iPad",
    },
  ]

  const watchlistItems = [
    {
      id: 4,
      title: "Samsung Galaxy S24 Ultra",
      currentPrice: 1100000,
      timeLeft: "3일 12시간",
      image: "/placeholder.svg?height=80&width=80&text=Galaxy",
    },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Gavel className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">참여 중인 경매</p>
                      <p className="text-2xl font-bold">{myAuctions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Package className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">판매 중</p>
                      <p className="text-2xl font-bold">{sellingItems.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Heart className="w-8 h-8 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">관심목록</p>
                      <p className="text-2xl font-bold">{watchlistItems.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Star className="w-8 h-8 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">평점</p>
                      <p className="text-2xl font-bold">4.9</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 최근 활동 */}
            <Card>
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <Gavel className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">iPhone 15 Pro Max에 입찰했습니다</p>
                      <p className="text-sm text-gray-600">₩1,150,000 • 2시간 전</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <Package className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium">iPad Pro 경매를 등록했습니다</p>
                      <p className="text-sm text-gray-600">시작가 ₩800,000 • 1일 전</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "auctions":
        return (
          <Card>
            <CardHeader>
              <CardTitle>참여 중인 경매</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myAuctions.map((auction) => (
                  <div key={auction.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={auction.image || "/placeholder.svg"}
                      alt={auction.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{auction.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>현재가: ₩{auction.currentPrice.toLocaleString()}</span>
                        <span>내 입찰: ₩{auction.myBid.toLocaleString()}</span>
                        <span>{auction.timeLeft} 남음</span>
                      </div>
                    </div>
                    <div>
                      {auction.status === "winning" ? (
                        <Badge className="bg-green-500">최고가</Badge>
                      ) : (
                        <Badge variant="destructive">입찰 밀림</Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      상세보기
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "selling":
        return (
          <Card>
            <CardHeader>
              <CardTitle>판매 중인 상품</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sellingItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>현재가: ₩{item.currentPrice.toLocaleString()}</span>
                        <span>시작가: ₩{item.startPrice.toLocaleString()}</span>
                        <span>입찰 {item.bidCount}회</span>
                        <span>조회 {item.viewCount}회</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{item.timeLeft} 남음</p>
                      <Badge variant="outline">진행중</Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      관리
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "watchlist":
        return (
          <Card>
            <CardHeader>
              <CardTitle>관심목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {watchlistItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>현재가: ₩{item.currentPrice.toLocaleString()}</span>
                        <span>{item.timeLeft} 남음</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        입찰하기
                      </Button>
                      <Button variant="outline" size="sm">
                        제거
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "profile":
        return (
          <Card>
            <CardHeader>
              <CardTitle>프로필 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">이름</Label>
                    <Input id="name" defaultValue="홍길동" />
                  </div>
                  <div>
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" type="email" defaultValue="hong@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">전화번호</Label>
                    <Input id="phone" defaultValue="010-1234-5678" />
                  </div>
                  <div>
                    <Label htmlFor="location">지역</Label>
                    <Select defaultValue="seoul">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seoul">서울</SelectItem>
                        <SelectItem value="busan">부산</SelectItem>
                        <SelectItem value="daegu">대구</SelectItem>
                        <SelectItem value="incheon">인천</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">자기소개</Label>
                  <Textarea
                    id="bio"
                    placeholder="자신을 소개해주세요"
                    defaultValue="안전하고 신뢰할 수 있는 거래를 지향합니다."
                  />
                </div>
                <Button>프로필 저장</Button>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return <div>준비 중입니다.</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">내 계정</h1>
          <p className="text-gray-600">계정 정보와 활동을 관리하세요</p>
        </div>

        <div className="flex gap-8">
          {/* 사이드바 */}
          <div className="w-64">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          activeTab === tab.id ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" : "text-gray-700"
                        }`}
                      >
                        <IconComponent className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
