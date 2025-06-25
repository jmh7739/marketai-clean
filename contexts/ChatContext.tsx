"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import type { ChatMessage, ChatRoom } from "@/types/chat"
import { useAuth } from "./AuthContext"

interface ChatContextType {
  messages: string[]
  sendMessage: (message: string) => void
  socket: Socket | null
  chatRooms: ChatRoom[]
  currentRoom: ChatRoom | null
  isConnected: boolean
  unreadCount: number
  joinRoom: (roomId: string) => void
  leaveRoom: () => void
  markAsRead: (roomId: string) => void
  createRoom: (productId: string, sellerId: string, productTitle: string, productImage: string) => Promise<ChatRoom>
  startTyping: () => void
  stopTyping: () => void
  typingUsers: string[]
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const sendMessage = (message: string) => {
    setMessages((prev) => [...prev, message])
  }

  // Socket 연결
  useEffect(() => {
    if (user) {
      const socketInstance = io(process.env.NODE_ENV === "production" ? "" : "http://localhost:3000", {
        path: "/api/socket",
      })

      socketInstance.on("connect", () => {
        console.log("Socket 연결됨")
        setIsConnected(true)
        socketInstance.emit("user-online", user.id)
      })

      socketInstance.on("disconnect", () => {
        console.log("Socket 연결 해제됨")
        setIsConnected(false)
      })

      socketInstance.on("new-message", (message: ChatMessage) => {
        // setMessages((prev) => [...prev, message])
      })

      socketInstance.on("user-typing", ({ userName, isTyping }: { userName: string; isTyping: boolean }) => {
        setTypingUsers((prev) => {
          if (isTyping) {
            return prev.includes(userName) ? prev : [...prev, userName]
          } else {
            return prev.filter((name) => name !== userName)
          }
        })
      })

      socketInstance.on("new-notification", (notification) => {
        // 알림 처리
        console.log("새 알림:", notification)
      })

      setSocket(socketInstance)

      return () => {
        socketInstance.emit("user-offline", user.id)
        socketInstance.disconnect()
      }
    }
  }, [user])

  // 채팅방 목록 로드
  useEffect(() => {
    if (user) {
      loadChatRooms()
    }
  }, [user])

  const loadChatRooms = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/chat/rooms?userId=${user.id}`)
      const rooms = await response.json()
      setChatRooms(rooms)
    } catch (error) {
      console.error("채팅방 목록 로드 실패:", error)
    }
  }

  // const sendMessage = (content: string, type: "text" | "image" = "text") => {
  //   if (!socket || !currentRoom || !user || !content.trim()) return

  //   const message: ChatMessage = {
  //     id: Date.now().toString(),
  //     roomId: currentRoom.id,
  //     senderId: user.id,
  //     senderName: user.name,
  //     senderAvatar: user.avatar,
  //     content: content.trim(),
  //     type,
  //     timestamp: new Date(),
  //     isRead: false,
  //   }

  //   socket.emit("send-message", message)
  // }

  const joinRoom = async (roomId: string) => {
    if (!socket) return

    // 이전 방 나가기
    if (currentRoom) {
      socket.emit("leave-room", currentRoom.id)
    }

    // 새 방 입장
    socket.emit("join-room", roomId)

    // 방 정보 설정
    const room = chatRooms.find((r) => r.id === roomId)
    if (room) {
      setCurrentRoom(room)

      // 메시지 로드
      try {
        const response = await fetch(`/api/chat/messages/${roomId}`)
        const roomMessages = await response.json()
        // setMessages(roomMessages)

        // 읽음 처리
        if (user) {
          markAsRead(roomId)
        }
      } catch (error) {
        console.error("메시지 로드 실패:", error)
      }
    }
  }

  const leaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit("leave-room", currentRoom.id)
      setCurrentRoom(null)
      // setMessages([])
      setTypingUsers([])
    }
  }

  const markAsRead = (roomId: string) => {
    if (!socket || !user) return
    socket.emit("mark-as-read", { roomId, userId: user.id })
  }

  const createRoom = async (
    productId: string,
    sellerId: string,
    productTitle: string,
    productImage: string,
  ): Promise<ChatRoom> => {
    if (!user) throw new Error("로그인이 필요합니다")

    const response = await fetch("/api/chat/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        sellerId,
        buyerId: user.id,
        productTitle,
        productImage,
      }),
    })

    if (!response.ok) {
      throw new Error("채팅방 생성 실패")
    }

    const room = await response.json()
    setChatRooms((prev) => [room, ...prev])
    return room
  }

  const startTyping = () => {
    if (socket && currentRoom && user) {
      socket.emit("typing-start", { roomId: currentRoom.id, userName: user.name })
    }
  }

  const stopTyping = () => {
    if (socket && currentRoom && user) {
      socket.emit("typing-stop", { roomId: currentRoom.id, userName: user.name })
    }
  }

  const unreadCount = chatRooms.reduce((total, room) => total + room.unreadCount, 0)

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        socket,
        chatRooms,
        currentRoom,
        isConnected,
        unreadCount,
        joinRoom,
        leaveRoom,
        markAsRead,
        createRoom,
        startTyping,
        stopTyping,
        typingUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
