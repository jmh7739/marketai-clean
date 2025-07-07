import type { Server as NetServer } from "http"
import type { NextApiResponse } from "next"
import { Server as ServerIO } from "socket.io"
import type { ChatMessage, ChatRoom } from "@/types/chat"

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

// 메모리 저장소 (실제 서비스에서는 데이터베이스 사용)
const chatRooms = new Map<string, ChatRoom>()
const chatMessages = new Map<string, ChatMessage[]>()
const onlineUsers = new Set<string>()

export const initSocket = (server: NetServer) => {
  const io = new ServerIO(server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", (socket) => {
    console.log("사용자 연결:", socket.id)

    // 사용자 온라인 상태 설정
    socket.on("user-online", (userId: string) => {
      onlineUsers.add(userId)
      socket.join(`user-${userId}`)
      io.emit("user-status-change", { userId, isOnline: true })
    })

    // 채팅방 입장
    socket.on("join-room", (roomId: string) => {
      socket.join(roomId)
      console.log(`사용자가 채팅방 ${roomId}에 입장`)
    })

    // 메시지 전송
    socket.on("send-message", (message: ChatMessage) => {
      // 메시지 저장
      if (!chatMessages.has(message.roomId)) {
        chatMessages.set(message.roomId, [])
      }
      chatMessages.get(message.roomId)?.push(message)

      // 채팅방 정보 업데이트
      const room = chatRooms.get(message.roomId)
      if (room) {
        room.lastMessage = message
        room.updatedAt = new Date()
        chatRooms.set(message.roomId, room)
      }

      // 실시간 전송
      io.to(message.roomId).emit("new-message", message)

      // 상대방에게 알림
      const recipientId = room?.sellerId === message.senderId ? room.buyerId : room?.sellerId
      if (recipientId) {
        io.to(`user-${recipientId}`).emit("new-notification", {
          type: "message",
          roomId: message.roomId,
          senderName: message.senderName,
          content: message.content,
        })
      }
    })

    // 메시지 읽음 처리
    socket.on("mark-as-read", ({ roomId, userId }: { roomId: string; userId: string }) => {
      const messages = chatMessages.get(roomId)
      if (messages) {
        messages.forEach((msg) => {
          if (msg.senderId !== userId) {
            msg.isRead = true
          }
        })
        io.to(roomId).emit("messages-read", { roomId, userId })
      }
    })

    // 타이핑 상태
    socket.on("typing-start", ({ roomId, userName }: { roomId: string; userName: string }) => {
      socket.to(roomId).emit("user-typing", { userName, isTyping: true })
    })

    socket.on("typing-stop", ({ roomId, userName }: { roomId: string; userName: string }) => {
      socket.to(roomId).emit("user-typing", { userName, isTyping: false })
    })

    // 연결 해제
    socket.on("disconnect", () => {
      console.log("사용자 연결 해제:", socket.id)
    })

    socket.on("user-offline", (userId: string) => {
      onlineUsers.delete(userId)
      io.emit("user-status-change", { userId, isOnline: false })
    })
  })

  return io
}

// 채팅방 생성
export const createChatRoom = (
  productId: string,
  sellerId: string,
  buyerId: string,
  productTitle: string,
  productImage: string,
): ChatRoom => {
  const roomId = `${productId}-${sellerId}-${buyerId}`

  const room: ChatRoom = {
    id: roomId,
    productId,
    productTitle,
    productImage,
    sellerId,
    sellerName: `판매자${sellerId.slice(-4)}`,
    buyerId,
    buyerName: `구매자${buyerId.slice(-4)}`,
    unreadCount: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  chatRooms.set(roomId, room)
  return room
}

// 채팅방 목록 조회
export const getChatRooms = (userId: string): ChatRoom[] => {
  return Array.from(chatRooms.values())
    .filter((room) => room.sellerId === userId || room.buyerId === userId)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

// 채팅 메시지 조회
export const getChatMessages = (roomId: string): ChatMessage[] => {
  return chatMessages.get(roomId) || []
}
