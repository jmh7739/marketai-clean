"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MessageSquare, Upload, AlertTriangle } from "lucide-react"

interface DisputePageProps {
  params: Promise<{ id: string }>
}

interface Dispute {
  id: string
  title: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  description: string
  createdAt: string
  updatedAt: string
  messages: Array<{
    id: string
    sender: string
    message: string
    timestamp: string
    isAdmin: boolean
  }>
}

export default function DisputePage({ params }: DisputePageProps) {
  const router = useRouter()
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDispute() {
      const { id } = await params

      // Mock data - replace with actual API call
      const mockDispute: Dispute = {
        id,
        title: `분쟁 사건 #${id}`,
        status: "in-progress",
        priority: "high",
        description: "경매 상품에 대한 설명과 실제 상품이 다릅니다. 환불을 요청합니다.",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-16T14:20:00Z",
        messages: [
          {
            id: "1",
            sender: "사용자",
            message: "경매에서 구매한 상품이 설명과 다릅니다.",
            timestamp: "2024-01-15T10:30:00Z",
            isAdmin: false,
          },
          {
            id: "2",
            sender: "관리자",
            message: "신고 접수되었습니다. 조사 후 연락드리겠습니다.",
            timestamp: "2024-01-15T11:00:00Z",
            isAdmin: true,
          },
        ],
      }

      setDispute(mockDispute)
      setLoading(false)
    }

    loadDispute()
  }, [params])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !dispute) return

    const message = {
      id: Date.now().toString(),
      sender: "사용자",
      message: newMessage,
      timestamp: new Date().toISOString(),
      isAdmin: false,
    }

    setDispute({
      ...dispute,
      messages: [...dispute.messages, message],
    })
    setNewMessage("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
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
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">분쟁을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">요청하신 분쟁 사건이 존재하지 않습니다.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          돌아가기
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{dispute.title}</h1>
          <div className="flex gap-2">
            <Badge className={getStatusColor(dispute.status)}>
              {dispute.status === "open" && "접수"}
              {dispute.status === "in-progress" && "처리중"}
              {dispute.status === "resolved" && "해결됨"}
              {dispute.status === "closed" && "종료"}
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
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                대화 내역
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {dispute.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isAdmin ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isAdmin ? "bg-gray-100 text-gray-900" : "bg-blue-500 text-white"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">{message.sender}</div>
                      <div className="text-sm">{message.message}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleString("ko-KR")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <Label htmlFor="message">새 메시지</Label>
                <Textarea
                  id="message"
                  placeholder="메시지를 입력하세요..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    파일 첨부
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    메시지 전송
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>분쟁 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">분쟁 ID</Label>
                <p className="text-sm">{dispute.id}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">생성일</Label>
                <p className="text-sm">{new Date(dispute.createdAt).toLocaleString("ko-KR")}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">최종 업데이트</Label>
                <p className="text-sm">{new Date(dispute.updatedAt).toLocaleString("ko-KR")}</p>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-gray-500">설명</Label>
                <p className="text-sm text-gray-700 mt-1">{dispute.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
