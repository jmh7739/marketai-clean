export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: Date
  type: "text" | "image" | "system"
  roomId: string
}

export interface ChatRoom {
  id: string
  name: string
  participants: string[]
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}

export interface ChatUser {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastSeen?: Date
}

export interface ChatNotification {
  id: string
  type: "message" | "join" | "leave"
  roomId: string
  userId: string
  message: string
  timestamp: Date
  read: boolean
}
