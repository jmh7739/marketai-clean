"use client"

import { useState } from "react"
import { Package, Eye, Gavel, DollarSign, Clock, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import SafeLink from "@/components/SafeLink"

interface SellingItem {
  id: string
  title: string
  image: string
  currentPrice: number
  startPrice: number
  bidCount: number
  viewCount: number
  timeLeft: string
  status: "active" | "ended" | "sold" | "cancelled"
  category: string
  condition: string
  listDate: string
  endDate?: string
  buyerName?: string
}

const mockSellingItems: SellingItem[] = [
  {
    id: "SELL-001",
    title: "iPhone 14 Pro 128GB 딥퍼플",
    image: "/placeholder.svg?height=100&width=100&text=iPhone14",
    currentPrice: 950000,
    startPrice: 800000,
    bidCount: 15,
    viewCount: 234,
    timeLeft: "2일 14시간",
    status: "active",
    category: "전자제품",
    condition: "거의 새 것",
    listDate: "2024-01-10",
  },
  {
    id: "SELL-002",
    title: "삼성 갤럭시 워치 6 클래식",
    image: "/placeholder.svg?height=100&width=100&text=Watch",
    currentPrice: 280000,
    startPrice: 200000,
    bidCount: 8,
    viewCount: 156,
    timeLeft: "종료됨",
    status: "sold",
    category: "전자제품",
    condition: "좋음",
    listDate: "2024-01-05",
    endDate: "2024-01-12",
    buyerName: "김**",
  },
  {
    id: "SELL-003",
    title: "나이키 에어포스 1 화이트",
    image: "/placeholder.svg?height=100&width=100&text=Nike",
    currentPrice: 120000,
    startPrice: 100000,
    bidCount: 3,
    viewCount: 89,
    timeLeft: "5일 8시간",
    status: "active",
    category: "패션/의류",
    condition: "새 상품",
    listDate: "2024-01-08",
  },
]

export default function SellingPage() {
  const [items] = useState<SellingItem[]>(mockSellingItems)
  const [statusFilter, setStatusFilter] = useState("all")
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-4">판매 내역을 확인하려면 로그인해주세요.</p>
            <SafeLink href="/auth/login?redirect=/my-account/selling">
              <Button className="w-full">로그인하기</Button>
            </SafeLink>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusBadge = (status: SellingItem["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">진행 중</Badge>
      case "ended":
        return <Badge variant="secondary">종료됨</Badge>
      case "sold":
        return <Badge className="bg-blue-600">판매완료</Badge>
      case "cancelled":
        return <Badge variant="destructive">취소됨</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  const filteredItems = items.filter((item) => {
    if (statusFilter === "all") return true
    return item.status === statusFilter
  })

  const totalEarnings = items.filter((item) => item.status === "sold").reduce((sum, item) => sum + item.currentPrice, 0)

  const activeCount = items.filter((item) => item.status === "active").length
  const soldCount = items.filter((item) => item.status === "sold").length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">판매 관리</h1>
              <p className="text-gray-600">등록한 상품들의 경매 현황을 관리하세요</p>
            </div>
            <SafeLink href="/sell">
              <Button>
                <Plus className="w-4 h-4 mr-2" />새 상품 등록
              </Button>
            </SafeLink>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">진행 중인 경매</p>
                  <p className="text-2xl font-bold text-green-600">{activeCount}개</p>
                </div>
                <Gavel className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">판매 완료</p>
                  <p className="text-2xl font-bold text-blue-600">{soldCount}개</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">총 수익</p>
                  <p className="text-2xl font-bold text-purple-600">₩{totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 필터 */}
        <div className="mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상품</SelectItem>
              <SelectItem value="active">진행 중</SelectItem>
              <SelectItem value="ended">종료됨</SelectItem>
              <SelectItem value="sold">판매완료</SelectItem>
              <SelectItem value="cancelled">취소됨</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 상품 목록 */}
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">등록된 상품이 없습니다</h3>
              <p className="text-gray-600 mb-4">첫 번째 상품을 등록해보세요!</p>
              <SafeLink href="/sell">
                <Button>상품 등록하기</Button>
              </SafeLink>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    {/* 상품 이미지 */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* 상품 정보 */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{item.category}</span>
                            <span>•</span>
                            <span>{item.condition}</span>
                            <span>•</span>
                            <span>등록일: {item.listDate}</span>
                          </div>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">현재가</p>
                          <p className="text-lg font-bold text-blue-600">₩{item.currentPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">시작가</p>
                          <p className="text-lg font-semibold">₩{item.startPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">입찰 수</p>
                          <p className="text-lg font-semibold">{item.bidCount}회</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">조회 수</p>
                          <p className="text-lg font-semibold">{item.viewCount}회</p>
                        </div>
                      </div>

                      {/* 상태별 추가 정보 */}
                      {item.status === "active" && (
                        <div className="flex items-center text-sm text-orange-600 mb-3">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>남은 시간: {item.timeLeft}</span>
                        </div>
                      )}

                      {item.status === "sold" && item.buyerName && (
                        <div className="p-3 bg-green-50 rounded-lg mb-3">
                          <p className="text-sm text-green-800">
                            <strong>낙찰자:</strong> {item.buyerName} • <strong>낙찰가:</strong> ₩
                            {item.currentPrice.toLocaleString()}
                          </p>
                          {item.endDate && <p className="text-sm text-green-600">종료일: {item.endDate}</p>}
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="flex flex-col space-y-2">
                      <SafeLink href={`/product/${item.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          상세보기
                        </Button>
                      </SafeLink>

                      {item.status === "active" && (
                        <>
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="w-4 h-4 mr-2" />
                            수정
                          </Button>
                          <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4 mr-2" />
                            삭제
                          </Button>
                        </>
                      )}

                      {item.status === "sold" && (
                        <SafeLink href={`/chat/buyer/${item.buyerName}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            구매자 채팅
                          </Button>
                        </SafeLink>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
