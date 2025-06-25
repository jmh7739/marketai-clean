"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { ChatMessage, ChatRoom } from "@/types/chat"

interface ChatContextType {
  messages: ChatMessage[]
  rooms: ChatRoom[]
  activeRoom: string | null
  sendMessage: (content: string) => void
  setActiveRoom: (roomId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [activeRoom, setActiveRoom] = useState<string | null>(null)

  const sendMessage = (content: string) => {
    if (!activeRoom) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      roomId: activeRoom,
      senderId: "current-user",
      senderName: "나",
      content,
      type: "text",
      timestamp: new Date(),
      isRead: false,
    }

    setMessages((prev) => [...prev, newMessage])
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        rooms,
        activeRoom,
        sendMessage,
        setActiveRoom,
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
