"use client"
import { useRouter } from "next/navigation"
import { useChat } from "@/contexts/ChatContext"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Clock, User } from "lucide-react"
import Image from "next/image"

export default function ChatListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { chatRooms, isConnected } = useChat()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-600">채팅을 이용하려면 먼저 로그인해주세요.</p>
        </div>
      </div>
    )
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "방금 전"
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    return `${days}일 전`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">채팅</h1>
              <p className="text-sm text-gray-600">
                {isConnected ? (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    온라인
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    연결 중...
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 채팅방 목록 */}
        {chatRooms.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">아직 채팅이 없습니다</h3>
            <p className="text-gray-600">상품 페이지에서 판매자와 채팅을 시작해보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chatRooms.map((room) => (
              <Card
                key={room.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/chat/${room.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* 상품 이미지 */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={room.productImage || "/placeholder.svg?height=64&width=64"}
                        alt={room.productTitle}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* 채팅 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{room.productTitle}</h3>
                        {room.unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {room.unreadCount}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {user.id === room.sellerId ? room.buyerName : room.sellerName}
                        </span>
                      </div>

                      {room.lastMessage && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {room.lastMessage.type === "image" ? "📷 이미지" : room.lastMessage.content}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            {formatTime(room.lastMessage.timestamp)}
                          </div>
                        </div>
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
