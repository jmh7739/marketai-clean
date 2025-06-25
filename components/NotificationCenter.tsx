"use client"
import { useState, useEffect } from "react"
import { Bell, X, Clock, Gavel, MessageCircle, Package, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  type: "bid" | "auction_end" | "payment" | "shipping" | "message" | "system"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
  priority: "low" | "medium" | "high"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "bid",
    title: "입찰이 추가되었습니다",
    message: "iPhone 15 Pro Max에 새로운 입찰이 있습니다. 현재 최고가: ₩1,250,000",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    actionUrl: "/product/1",
    priority: "high",
  },
  {
    id: "2",
    type: "auction_end",
    title: "경매가 종료되었습니다",
    message: "MacBook Air M2 경매가 종료되었습니다. 낙찰되었습니다!",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false,
    actionUrl: "/my-account/orders",
    priority: "high",
  },
  {
    id: "3",
    type: "payment",
    title: "결제 안내",
    message: "낙찰된 상품의 결제를 24시간 내에 완료해주세요.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isRead: true,
    actionUrl: "/payment/2",
    priority: "medium",
  },
  {
    id: "4",
    type: "shipping",
    title: "상품이 발송되었습니다",
    message: "나이키 에어맥스 270이 발송되었습니다. 운송장: 1234567890",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true,
    actionUrl: "/my-account/orders",
    priority: "medium",
  },
  {
    id: "5",
    type: "message",
    title: "새 메시지",
    message: "판매자가 메시지를 보냈습니다.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isRead: false,
    actionUrl: "/chat/room1",
    priority: "low",
  },
]

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // 실시간 알림 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      // 20% 확률로 새 알림 생성
      if (Math.random() < 0.2) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "bid",
          title: "새로운 입찰",
          message: `관심 상품에 새로운 입찰이 있습니다. 현재가: ₩${(Math.random() * 1000000 + 500000).toLocaleString()}`,
          timestamp: new Date(),
          isRead: false,
          actionUrl: "/product/1",
          priority: "medium",
        }
        setNotifications((prev) => [newNotification, ...prev])
      }
    }, 30000) // 30초마다 체크

    return () => clearInterval(interval)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "bid":
        return <Gavel className="w-4 h-4" />
      case "auction_end":
        return <Clock className="w-4 h-4" />
      case "payment":
        return <CreditCard className="w-4 h-4" />
      case "shipping":
        return <Package className="w-4 h-4" />
      case "message":
        return <MessageCircle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}일 전`
    if (hours > 0) return `${hours}시간 전`
    if (minutes > 0) return `${minutes}분 전`
    return "방금 전"
  }

  const filteredNotifications = notifications.filter((n) => (filter === "unread" ? !n.isRead : true))

  return (
    <div className="relative">
      {/* 알림 버튼 */}
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* 알림 패널 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 z-50">
          <Card className="shadow-lg border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">알림</CardTitle>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      모두 읽음
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                  전체 ({notifications.length})
                </Button>
                <Button
                  variant={filter === "unread" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("unread")}
                >
                  읽지 않음 ({unreadCount})
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                {filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>알림이 없습니다</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                          !notification.isRead ? "bg-blue-50" : ""
                        }`}
                        onClick={() => {
                          markAsRead(notification.id)
                          if (notification.actionUrl) {
                            window.location.href = notification.actionUrl
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 ${getPriorityColor(notification.priority)}`}>
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                              <div className="flex items-center gap-2">
                                {!notification.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNotification(notification.id)
                                  }}
                                  className="p-1 h-6 w-6"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{formatTime(notification.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
