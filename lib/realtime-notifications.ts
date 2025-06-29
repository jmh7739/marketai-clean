import { wsService } from "./websocket-service"

export interface NotificationData {
  id: string
  type: "bid" | "outbid" | "won" | "offer" | "message"
  title: string
  message: string
  userId: string
  auctionId?: string
  timestamp: Date
  read: boolean
}

class NotificationService {
  private notifications: NotificationData[] = []
  private listeners: Function[] = []
  private soundEnabled = true

  constructor() {
    this.initializeWebSocket()
    this.loadSettings()
  }

  private initializeWebSocket() {
    wsService.on("notification", (data: NotificationData) => {
      this.addNotification(data)
    })

    wsService.on("bid_update", (data: any) => {
      this.addNotification({
        id: Date.now().toString(),
        type: "bid",
        title: "새로운 입찰",
        message: `${data.productName}에 새로운 입찰이 있습니다.`,
        userId: data.userId,
        auctionId: data.auctionId,
        timestamp: new Date(),
        read: false,
      })
    })

    wsService.on("auction_won", (data: any) => {
      this.addNotification({
        id: Date.now().toString(),
        type: "won",
        title: "경매 낙찰!",
        message: `축하합니다! ${data.productName} 경매에서 낙찰되었습니다.`,
        userId: data.userId,
        auctionId: data.auctionId,
        timestamp: new Date(),
        read: false,
      })
    })
  }

  private addNotification(notification: NotificationData) {
    this.notifications.unshift(notification)

    // 최대 100개까지만 저장
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100)
    }

    // 로컬 스토리지에 저장
    this.saveToStorage()

    // 리스너들에게 알림
    this.listeners.forEach((listener) => listener(notification))

    // 사운드 재생
    if (this.soundEnabled) {
      this.playNotificationSound()
    }

    // 브라우저 알림
    this.showBrowserNotification(notification)
  }

  private playNotificationSound() {
    try {
      const audio = new Audio("/sounds/notification.mp3")
      audio.volume = 0.3
      audio.play().catch(() => {
        // 자동 재생 정책으로 인한 오류 무시
      })
    } catch (error) {
      console.log("알림 사운드 재생 실패:", error)
    }
  }

  private async showBrowserNotification(notification: NotificationData) {
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/icon-192x192.png",
          badge: "/icon-72x72.png",
          tag: notification.id,
          requireInteraction: false,
          silent: false,
        })
      } catch (error) {
        console.log("브라우저 알림 표시 실패:", error)
      }
    }
  }

  async requestPermission(): Promise<boolean> {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }
    return false
  }

  subscribe(listener: Function) {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  getNotifications(): NotificationData[] {
    return this.notifications
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length
  }

  markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      this.saveToStorage()
    }
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true))
    this.saveToStorage()
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled
    localStorage.setItem("notification_sound", enabled.toString())
  }

  private loadSettings() {
    const soundSetting = localStorage.getItem("notification_sound")
    if (soundSetting !== null) {
      this.soundEnabled = soundSetting === "true"
    }

    // 저장된 알림 불러오기
    const saved = localStorage.getItem("notifications")
    if (saved) {
      try {
        this.notifications = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }))
      } catch (error) {
        console.error("알림 데이터 로드 실패:", error)
      }
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem("notifications", JSON.stringify(this.notifications))
    } catch (error) {
      console.error("알림 데이터 저장 실패:", error)
    }
  }
}

export const notificationService = new NotificationService()
