"use client"

import { useChat } from "@/contexts/ChatContext"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function ChatPage() {
  const { rooms, currentRoom, messages, sendMessage, joinRoom, loading } = useChat()
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() && currentRoom) {
      sendMessage(currentRoom.id, newMessage.trim())
      setNewMessage("")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">채팅</h1>
        <p className="text-gray-600">실시간 채팅으로 소통하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 채팅방 목록 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">채팅방</h2>
          <div className="space-y-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentRoom?.id === room.id ? "bg-blue-100 border-blue-200" : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => joinRoom(room.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{room.name}</span>
                  {room.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">{room.unreadCount}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className="md:col-span-2 bg-white rounded-lg shadow">
          {currentRoom ? (
            <div className="flex flex-col h-96">
              {/* 채팅 헤더 */}
              <div className="p-4 border-b">
                <h3 className="font-semibold">{currentRoom.name}</h3>
              </div>

              {/* 메시지 영역 */}
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">아직 메시지가 없습니다.</div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "current_user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.senderId === "current_user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          <p>{message.message}</p>
                          <p className="text-xs mt-1 opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 메시지 입력 */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>전송</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-500">채팅방을 선택하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
