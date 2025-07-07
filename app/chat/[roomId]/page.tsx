"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useChat } from "@/contexts/ChatContext"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, ImageIcon, MoreVertical } from "lucide-react"
import Image from "next/image"

export default function ChatRoomPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { currentRoom, messages, isConnected, sendMessage, joinRoom, leaveRoom, startTyping, stopTyping, typingUsers } =
    useChat()

  const [messageInput, setMessageInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const roomId = params.roomId as string

  // 채팅방 입장
  useEffect(() => {
    if (roomId) {
      joinRoom(roomId)
    }

    return () => {
      leaveRoom()
    }
  }, [roomId])

  // 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 타이핑 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value)

    if (!isTyping) {
      setIsTyping(true)
      startTyping()
    }

    // 타이핑 중지 타이머
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      stopTyping()
    }, 1000)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!messageInput.trim()) return

    sendMessage(messageInput)
    setMessageInput("")

    if (isTyping) {
      setIsTyping(false)
      stopTyping()
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로그인이 필요합니다.</p>
      </div>
    )
  }

  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>채팅방을 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
            <Image
              src={currentRoom.productImage || "/placeholder.svg?height=40&width=40"}
              alt={currentRoom.productTitle}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 truncate">{currentRoom.productTitle}</h2>
            <p className="text-sm text-gray-600">
              {user.id === currentRoom.sellerId ? currentRoom.buyerName : currentRoom.sellerName}
              {isConnected && <span className="ml-2 text-green-600">● 온라인</span>}
            </p>
          </div>

          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md ${
                message.senderId === user.id ? "bg-blue-600 text-white" : "bg-white text-gray-900"
              } rounded-lg px-4 py-2 shadow-sm`}
            >
              {message.type === "image" ? (
                <div className="relative w-48 h-32 rounded overflow-hidden">
                  <Image
                    src={message.content || "/placeholder.svg"}
                    alt="전송된 이미지"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
              <p className={`text-xs mt-1 ${message.senderId === user.id ? "text-blue-100" : "text-gray-500"}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* 타이핑 표시 */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-600">{typingUsers.join(", ")}님이 입력 중...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" className="text-gray-500">
            <ImageIcon className="h-5 w-5" />
          </Button>

          <Input
            value={messageInput}
            onChange={handleInputChange}
            placeholder="메시지를 입력하세요..."
            className="flex-1"
            disabled={!isConnected}
          />

          <Button type="submit" size="sm" disabled={!messageInput.trim() || !isConnected}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
