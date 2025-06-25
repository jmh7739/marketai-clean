export interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type: "text" | "image" | "system"
  timestamp: Date
  isRead: boolean
}

export interface ChatRoom {
  id: string
  productId: string
  productTitle: string
  productImage: string
  sellerId: string
  sellerName: string
  buyerId: string
  buyerName: string
  lastMessage?: ChatMessage
  unreadCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ChatUser {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastSeen: Date
}
