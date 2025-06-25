"use client"

import { useState } from "react"
import { Package, Truck, CheckCircle, Clock, MessageCircle, Star, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import SafeLink from "@/components/SafeLink"

interface Order {
  id: string
  productTitle: string
  productImage: string
  seller: string
  finalPrice: number
  orderDate: string
  status: "payment_pending" | "paid" | "shipped" | "delivered" | "cancelled"
  trackingNumber?: string
  deliveryDate?: string
  canReview: boolean
  canReturn: boolean
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    productTitle: "iPhone 15 Pro Max 256GB 자연 티타늄",
    productImage: "/placeholder.svg?height=100&width=100&text=iPhone",
    seller: "TechStore",
    finalPrice: 1250000,
    orderDate: "2024-01-15",
    status: "delivered",
    trackingNumber: "1234567890",
    deliveryDate: "2024-01-17",
    canReview: true,
    canReturn: true,
  },
  {
    id: "ORD-002",
    productTitle: "MacBook Air M2 13인치 실버",
    productImage: "/placeholder.svg?height=100&width=100&text=MacBook",
    seller: "AppleShop",
    finalPrice: 1350000,
    orderDate: "2024-01-14",
    status: "shipped",
    trackingNumber: "0987654321",
    canReview: false,
    canReturn: false,
  },
  {
    id: "ORD-003",
    productTitle: "나이키 에어맥스 270 블랙",
    productImage: "/placeholder.svg?height=100&width=100&text=Nike",
    seller: "ShoesWorld",
    finalPrice: 89000,
    orderDate: "2024-01-13",
    status: "payment_pending",
    canReview: false,
    canReturn: false,
  },
]

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders)
  const [statusFilter, setStatusFilter] = useState("all")
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-4">구매 내역을 확인하려면 로그인해주세요.</p>
            <SafeLink href="/auth/login?redirect=/my-account/orders">
              <Button className="w-full">로그인하기</Button>
            </SafeLink>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "payment_pending":
        return <Badge variant="destructive">결제 대기</Badge>
      case "paid":
        return <Badge variant="default">결제 완료</Badge>
      case "shipped":
        return <Badge variant="secondary">배송 중</Badge>
      case "delivered":
        return <Badge className="bg-green-600">배송 완료</Badge>
      case "cancelled":
        return <Badge variant="outline">취소됨</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "payment_pending":
        return <Clock className="w-5 h-5 text-red-500" />
      case "paid":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case "shipped":
        return <Truck className="w-5 h-5 text-orange-500" />
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "cancelled":
        return <RotateCcw className="w-5 h-5 text-gray-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true
    return order.status === statusFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">구매 내역</h1>
          <p className="text-gray-600">낙찰받은 상품들의 주문 현황을 확인하세요</p>
        </div>

        {/* 필터 */}
        <div className="mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 주문</SelectItem>
              <SelectItem value="payment_pending">결제 대기</SelectItem>
              <SelectItem value="paid">결제 완료</SelectItem>
              <SelectItem value="shipped">배송 중</SelectItem>
              <SelectItem value="delivered">배송 완료</SelectItem>
              <SelectItem value="cancelled">취소됨</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 주문 목록 */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">주문 내역이 없습니다</h3>
              <p className="text-gray-600 mb-4">경매에 참여해서 상품을 낙찰받아보세요!</p>
              <SafeLink href="/">
                <Button>경매 둘러보기</Button>
              </SafeLink>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">주문번호: {order.id}</CardTitle>
                      <p className="text-sm text-gray-600">주문일: {order.orderDate}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    {/* 상품 이미지 */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={order.productImage || "/placeholder.svg"}
                        alt={order.productTitle}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* 상품 정보 */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">{order.productTitle}</h3>
                      <p className="text-sm text-gray-600 mb-2">판매자: {order.seller}</p>
                      <p className="text-xl font-bold text-blue-600">₩{order.finalPrice.toLocaleString()}</p>

                      {/* 배송 정보 */}
                      {order.trackingNumber && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(order.status)}
                            <span className="font-medium">{order.status === "shipped" ? "배송 중" : "배송 완료"}</span>
                          </div>
                          <p className="text-sm text-gray-600">운송장번호: {order.trackingNumber}</p>
                          {order.deliveryDate && (
                            <p className="text-sm text-gray-600">배송완료일: {order.deliveryDate}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="flex flex-col space-y-2">
                      {order.status === "payment_pending" && (
                        <SafeLink href={`/payment/${order.id}`}>
                          <Button size="sm" className="w-full">
                            결제하기
                          </Button>
                        </SafeLink>
                      )}

                      {order.trackingNumber && (
                        <SafeLink href={`/tracking?number=${order.trackingNumber}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <Truck className="w-4 h-4 mr-2" />
                            배송조회
                          </Button>
                        </SafeLink>
                      )}

                      <SafeLink href={`/chat/seller/${order.seller}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          판매자 문의
                        </Button>
                      </SafeLink>

                      {order.canReview && (
                        <Button variant="outline" size="sm" className="w-full">
                          <Star className="w-4 h-4 mr-2" />
                          리뷰 작성
                        </Button>
                      )}

                      {order.canReturn && (
                        <SafeLink href={`/help/returns?order=${order.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            교환/환불
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
