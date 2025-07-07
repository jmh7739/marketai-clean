"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, User, AlertTriangle } from "lucide-react"

interface DisputePageProps {
  params: Promise<{ id: string }>
}

interface Dispute {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  createdAt: string
  updatedAt: string
  userId: string
  userName: string
  messages: DisputeMessage[]
}

interface DisputeMessage {
  id: string
  content: string
  sender: "user" | "admin"
  senderName: string
  timestamp: string
}

export default function DisputePage({ params }: DisputePageProps) {
  const router = useRouter()
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const loadDispute = async () => {
      try {
        const { id } = await params
        // Mock data - replace with actual API call
        const mockDispute: Dispute = {
          id,
          title: "결제 문제 신고",
          description: "경매 낙찰 후 결제가 정상적으로 처리되지 않았습니다.",
          status: "in-progress",
          priority: "high",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T14:20:00Z",
          userId: "user123",
          userName: "김철수",
          messages: [
            {
              id: "1",
              content: "경매 낙찰 후 결제가 정상적으로 처리되지 않았습니다. 도움이 필요합니다.",
              sender: "user",
              senderName: "김철수",
              timestamp: "2024-01-15T10:30:00Z",
            },
            {
              id: "2",
              content: "안녕하세요. 문의사항을 확인했습니다. 결제 내역을 조사 중이니 잠시만 기다려주세요.",
              sender: "admin",
              senderName: "관리자",
              timestamp: "2024-01-15T11:15:00Z",
            },
          ],
        }
        setDispute(mockDispute)
      } catch (error) {
        console.error("Failed to load dispute:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDispute()
  }, [params])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !dispute) return

    setSending(true)
    try {
      // Mock API call - replace with actual implementation
      const newMsg: DisputeMessage = {
        id: Date.now().toString(),
        content: newMessage,
        sender: "admin",
        senderName: "관리자",
        timestamp: new Date().toISOString(),
      }

      setDispute((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, newMsg],
              updatedAt: new Date().toISOString(),
            }
          : null,
      )

      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setSending(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!dispute) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">분쟁을 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-4">요청하신 분쟁이 존재하지 않거나 삭제되었습니다.</p>
            <Button onClick={() => router.back()}>돌아가기</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          ← 돌아가기
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">분쟁 상세</h1>
          <div className="flex gap-2">
            <Badge className={getStatusColor(dispute.status)}>
              {dispute.status === "pending" && "대기중"}
              {dispute.status === "in-progress" && "처리중"}
              {dispute.status === "resolved" && "해결됨"}
              {dispute.status === "closed" && "종료됨"}
            </Badge>
            <Badge className={getPriorityColor(dispute.priority)}>
              {dispute.priority === "high" && "높음"}
              {dispute.priority === "medium" && "보통"}
              {dispute.priority === "low" && "낮음"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 분쟁 정보 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                분쟁 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">제목</label>
                <p className="text-sm text-gray-900">{dispute.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">설명</label>
                <p className="text-sm text-gray-900">{dispute.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">신고자</label>
                <p className="text-sm text-gray-900">{dispute.userName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">생성일</label>
                <p className="text-sm text-gray-900">{new Date(dispute.createdAt).toLocaleString("ko-KR")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">최종 업데이트</label>
                <p className="text-sm text-gray-900">{new Date(dispute.updatedAt).toLocaleString("ko-KR")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 메시지 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                대화 내역
              </CardTitle>
              <CardDescription>신고자와의 대화를 확인하고 응답할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {dispute.messages.map((message, index) => (
                  <div key={message.id}>
                    <div className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "admin" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs ${message.sender === "admin" ? "text-blue-100" : "text-gray-500"}`}>
                            {message.senderName}
                          </span>
                          <span className={`text-xs ${message.sender === "admin" ? "text-blue-100" : "text-gray-500"}`}>
                            {new Date(message.timestamp).toLocaleString("ko-KR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < dispute.messages.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Textarea
                  placeholder="메시지를 입력하세요..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sending}>
                    {sending ? "전송 중..." : "메시지 전송"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
