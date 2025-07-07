"use client"

import { useState, useEffect } from "react"
import { X, Bell, Gavel, Heart, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Notification {
  id: string
  type: "bid" | "outbid" | "watch" | "message" | "auction_end"
  title: string
  message: string
  timestamp: Date
  read: boolean
  productId?: string
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const router = useRouter()

  // 실시간 알림 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      // 랜덤하게 알림 생성
      if (Math.random() > 0.7) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ["bid", "outbid", "watch", "message"][Math.floor(Math.random() * 4)] as any,
          title: "새로운 입찰",
          message: "iPhone 15 Pro Max에 새로운 입찰이 있습니다.",
          timestamp: new Date(),
          read: false,
          productId: "1",
        }

        setNotifications((prev) => [newNotification, ...prev.slice(0, 9)])

        // 브라우저 알림
        if (Notification.permission === "granted") {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: "/favicon.ico",
          })
        }
      }
    }, 10000) // 10초마다 체크

    return () => clearInterval(interval)
  }, [])

  // 알림 권한 요청
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "bid":
        return <Gavel className="w-4 h-4 text-blue-500" />
      case "outbid":
        return <Gavel className="w-4 h-4 text-red-500" />
      case "watch":
        return <Heart className="w-4 h-4 text-pink-500" />
      case "message":
        return <MessageCircle className="w-4 h-4 text-green-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.productId) {
      router.push(`/product/${notification.productId}`)
      setShowNotifications(false)
    }
  }

  return (
    <div className="relative">
      {/* 알림 버튼 */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-blue-600"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* 알림 드롭다운 */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">알림</h3>
              <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">새로운 알림이 없습니다.</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNotification(notification.id)
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button onClick={() => setNotifications([])} className="w-full text-sm text-blue-600 hover:text-blue-800">
                모든 알림 삭제
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
