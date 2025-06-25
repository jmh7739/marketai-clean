"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RealAuctionSystem from "@/components/RealAuctionSystem"
import { Badge } from "@/components/ui/badge"

export default function AuctionTestPage() {
  const [selectedAuction, setSelectedAuction] = useState("auction-1")

  const testAuctions = [
    {
      id: "auction-1",
      title: "iPhone 15 Pro Max 256GB 자연 티타늄",
      image: "/placeholder.svg?height=200&width=200",
      currentBid: 1200000,
      status: "active",
    },
    {
      id: "auction-2",
      title: "MacBook Pro M3 14인치",
      image: "/placeholder.svg?height=200&width=200",
      currentBid: 2500000,
      status: "active",
    },
    {
      id: "auction-3",
      title: "에어팟 프로 2세대",
      image: "/placeholder.svg?height=200&width=200",
      currentBid: 250000,
      status: "ending-soon",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔥 실시간 경매 테스트</h1>
        <p className="text-gray-600">경매 시스템이 제대로 작동하는지 확인해보세요!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 경매 상품 목록 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>진행중인 경매</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAuction === auction.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedAuction(auction.id)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={auction.image || "/placeholder.svg"}
                      alt={auction.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1">{auction.title}</h3>
                      <p className="text-lg font-bold text-blue-600">₩{auction.currentBid.toLocaleString()}</p>
                      <Badge variant={auction.status === "ending-soon" ? "destructive" : "default"} className="text-xs">
                        {auction.status === "ending-soon" ? "마감임박" : "진행중"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 테스트 안내 */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">🧪 테스트 방법</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• 왼쪽에서 경매 상품을 선택하세요</p>
              <p>• 오른쪽에서 실시간 입찰을 해보세요</p>
              <p>• 자동으로 다른 사용자의 입찰이 발생합니다</p>
              <p>• 타이머가 실시간으로 업데이트됩니다</p>
              <p>• 로그인하면 실제 입찰이 가능합니다</p>
            </CardContent>
          </Card>
        </div>

        {/* 실시간 경매 시스템 */}
        <div className="lg:col-span-2">
          <RealAuctionSystem auctionId={selectedAuction} />
        </div>
      </div>

      {/* 기능 체크리스트 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>✅ 구현된 기능 체크리스트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ 경매 시스템</h4>
              <ul className="text-sm space-y-1">
                <li>• 실시간 입찰</li>
                <li>• 자동 입찰 시뮬레이션</li>
                <li>• 입찰 내역 표시</li>
                <li>• 타이머 카운트다운</li>
                <li>• 최소 입찰 증가액</li>
                <li>• 추천 입찰가</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ 사용자 시스템</h4>
              <ul className="text-sm space-y-1">
                <li>• Firebase 인증</li>
                <li>• 전화번호 인증</li>
                <li>• 사용자 프로필</li>
                <li>• 로그인 상태 관리</li>
                <li>• 권한 체크</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ 상품 관리</h4>
              <ul className="text-sm space-y-1">
                <li>• 상품 등록 폼</li>
                <li>• AI 분석 UI</li>
                <li>• 이미지 업로드</li>
                <li>• 카테고리 분류</li>
                <li>• 배송 설정</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ 채팅 시스템</h4>
              <ul className="text-sm space-y-1">
                <li>• Socket.IO 실시간 채팅</li>
                <li>• 채팅방 생성</li>
                <li>• 메시지 전송</li>
                <li>• 채팅 내역</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ 결제 시스템</h4>
              <ul className="text-sm space-y-1">
                <li>• Mock 결제 처리</li>
                <li>• 결제 성공/실패</li>
                <li>• 결제 내역</li>
                <li>• 무통장입금</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ 관리 기능</h4>
              <ul className="text-sm space-y-1">
                <li>• 관리자 대시보드</li>
                <li>• 사용자 관리</li>
                <li>• 신고 처리</li>
                <li>• 통계 조회</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
