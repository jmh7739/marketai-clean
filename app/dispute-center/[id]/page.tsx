"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Upload, Clock, CheckCircle } from "lucide-react"
import { DisputeResolutionCenter } from "@/lib/dispute-resolution-center"

interface DisputeMessage {
  id: string
  sender_type: "buyer" | "seller" | "admin"
  message: string
  created_at: string
  sender: { name: string; avatar_url?: string }
  attachments?: string[]
}

export default function DisputeCenterPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<DisputeMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [userType, setUserType] = useState<"buyer" | "seller">("buyer") // 실제로는 로그인 정보에서
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    const result = await DisputeResolutionCenter.getDisputeMessages(params.id)
    if (result.success) {
      setMessages(result.messages || [])
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    setLoading(true)
    const result = await DisputeResolutionCenter.addMessage(
      params.id,
      "user-id", // 실제로는 로그인한 사용자 ID
      userType,
      newMessage,
    )

    if (result.success) {
      setNewMessage("")
      await loadMessages()
    }
    setLoading(false)
  }

  const getSenderBadgeColor = (senderType: string) => {
    switch (senderType) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "seller":
        return "bg-blue-100 text-blue-800"
      case "buyer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSenderLabel = (senderType: string) => {
    switch (senderType) {
      case "admin":
        return "관리자"
      case "seller":
        return "판매자"
      case "buyer":
        return "구매자"
      default:
        return "사용자"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            분쟁 해결 센터
          </CardTitle>
          <p className="text-sm text-gray-600">분쟁 ID: {params.id}</p>
        </CardHeader>
      </Card>

      {/* 안내 메시지 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">분쟁 해결 프로세스</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 구매자와 판매자는 관리자를 통해 소통합니다</li>
                <li>• 모든 메시지는 기록되며 분쟁 해결에 활용됩니다</li>
                <li>• 증거 자료(사진, 문서)를 첨부할 수 있습니다</li>
                <li>• 관리자가 공정한 해결방안을 제시합니다</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 메시지 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>대화 내역</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>아직 메시지가 없습니다.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={message.id}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    {message.sender.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{message.sender.name}</span>
                      <Badge className={getSenderBadgeColor(message.sender_type)}>
                        {getSenderLabel(message.sender_type)}
                      </Badge>
                      <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="whitespace-pre-wrap">{message.message}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {message.attachments.map((attachment, i) => (
                            <Button key={i} variant="outline" size="sm">
                              <Upload className="w-3 h-3 mr-1" />
                              첨부파일 {i + 1}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {index < messages.length - 1 && <Separator className="my-4" />}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 메시지 작성 */}
      <Card>
        <CardHeader>
          <CardTitle>메시지 보내기</CardTitle>
          <p className="text-sm text-gray-600">관리자를 통해 상대방과 소통할 수 있습니다.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="메시지를 입력하세요..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={4}
          />
          <div className="flex justify-between items-center">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              파일 첨부
            </Button>
            <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  전송 중...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  메시지 전송
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 분쟁 상태 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4" />
            분쟁 해결까지 평균 2-3일 소요됩니다
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
