"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: Date
  type: "text" | "image" | "system"
}

interface ChatRoom {
  id: string
  name: string
  participants: string[]
  lastMessage?: ChatMessage
  unreadCount: number
}

interface ChatContextType {
  rooms: ChatRoom[]
  currentRoom: ChatRoom | null
  messages: ChatMessage[]
  sendMessage: (roomId: string, message: string) => void
  joinRoom: (roomId: string) => void
  leaveRoom: () => void
  createRoom: (productId: string, sellerId: string, productTitle: string, productImage: string) => Promise<ChatRoom>
  loading: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 초기 채팅방 목록 로드 (데모 데이터)
    const demoRooms: ChatRoom[] = [
      {
        id: "room_1",
        name: "일반 채팅",
        participants: ["user_1", "user_2"],
        unreadCount: 0,
      },
      {
        id: "room_2",
        name: "경매 문의",
        participants: ["user_1", "seller_1"],
        unreadCount: 2,
      },
    ]
    setRooms(demoRooms)
  }, [])

  const sendMessage = (roomId: string, message: string) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: "current_user",
      senderName: "나",
      message,
      timestamp: new Date(),
      type: "text",
    }

    if (currentRoom?.id === roomId) {
      setMessages((prev) => [...prev, newMessage])
    }

    // 실제 구현에서는 서버로 메시지 전송
    console.log("Sending message:", newMessage)
  }

  const joinRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    if (room) {
      setCurrentRoom(room)
      setMessages([]) // 실제로는 서버에서 메시지 히스토리 로드

      // 읽음 처리
      setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, unreadCount: 0 } : r)))
    }
  }

  const leaveRoom = () => {
    setCurrentRoom(null)
    setMessages([])
  }

  const createRoom = async (
    productId: string,
    sellerId: string,
    productTitle: string,
    productImage: string,
  ): Promise<ChatRoom> => {
    const newRoom: ChatRoom = {
      id: `room_${Date.now()}`,
      name: `${productTitle} 문의`,
      participants: ["current_user", sellerId],
      unreadCount: 0,
    }

    setRooms((prev) => [...prev, newRoom])
    return newRoom
  }

  const value: ChatContextType = {
    rooms,
    currentRoom,
    messages,
    sendMessage,
    joinRoom,
    leaveRoom,
    createRoom,
    loading,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
