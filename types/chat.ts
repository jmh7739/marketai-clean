export interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type: "text" | "image"
  timestamp: Date
  isRead: boolean
}

export interface ChatRoom {
  id: string
  productId: string
  sellerId: string
  buyerId: string
  productTitle: string
  productImage: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isActive: boolean
}
