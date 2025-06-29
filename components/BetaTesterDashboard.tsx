"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BetaTesterService, type FeedbackData } from "@/lib/beta-tester-service"
import { Bug, Lightbulb, Palette, Zap, MessageSquare } from "lucide-react"

export default function BetaTesterDashboard() {
  const [feedbackForm, setFeedbackForm] = useState<Partial<FeedbackData>>({
    category: "bug",
    severity: "medium",
  })
  const [stats, setStats] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const data = await BetaTesterService.getFeedbackStats()
    setStats(data)
  }

  const handleSubmitFeedback = async () => {
    if (!feedbackForm.title || !feedbackForm.description) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    setIsSubmitting(true)
    try {
      const success = await BetaTesterService.submitFeedback({
        testerId: "current-user-id", // 실제로는 현재 사용자 ID
        category: feedbackForm.category as any,
        title: feedbackForm.title!,
        description: feedbackForm.description!,
        severity: feedbackForm.severity as any,
      })

      if (success) {
        alert("피드백이 제출되었습니다!")
        setFeedbackForm({ category: "bug", severity: "medium" })
        loadStats()
      } else {
        alert("피드백 제출에 실패했습니다.")
      }
    } catch (error) {
      console.error("피드백 제출 오류:", error)
      alert("오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bug":
        return <Bug className="w-4 h-4" />
      case "feature":
        return <Lightbulb className="w-4 h-4" />
      case "ui":
        return <Palette className="w-4 h-4" />
      case "performance":
        return <Zap className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">베타 테스터 대시보드</h1>
        <p className="text-gray-600">MarketAI 개선에 도움을 주셔서 감사합니다!</p>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">총 피드백</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeedback}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">카테고리별</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {Object.entries(stats.byCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      <span className="capitalize">{category}</span>
                    </div>
                    <span className="font-medium">{count as number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">심각도별</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {Object.entries(stats.bySeverity).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(severity)}`} />
                      <span className="capitalize">{severity}</span>
                    </div>
                    <span className="font-medium">{count as number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 피드백 제출 폼 */}
      <Card>
        <CardHeader>
          <CardTitle>새 피드백 제출</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">카테고리</label>
              <Select
                value={feedbackForm.category}
                onValueChange={(value) => setFeedbackForm((prev) => ({ ...prev, category: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">🐛 버그</SelectItem>
                  <SelectItem value="feature">💡 기능 제안</SelectItem>
                  <SelectItem value="ui">🎨 UI/UX</SelectItem>
                  <SelectItem value="performance">⚡ 성능</SelectItem>
                  <SelectItem value="other">💬 기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">심각도</label>
              <Select
                value={feedbackForm.severity}
                onValueChange={(value) => setFeedbackForm((prev) => ({ ...prev, severity: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 낮음</SelectItem>
                  <SelectItem value="medium">🟡 보통</SelectItem>
                  <SelectItem value="high">🟠 높음</SelectItem>
                  <SelectItem value="critical">🔴 심각</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">제목</label>
            <Input
              placeholder="피드백 제목을 입력하세요"
              value={feedbackForm.title || ""}
              onChange={(e) => setFeedbackForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">상세 내용</label>
            <Textarea
              placeholder="상세한 내용을 입력해주세요. 재현 방법, 기대했던 결과, 실제 결과 등을 포함해주세요."
              rows={5}
              value={feedbackForm.description || ""}
              onChange={(e) => setFeedbackForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <Button onClick={handleSubmitFeedback} disabled={isSubmitting} className="w-full">
            {isSubmitting ? "제출 중..." : "피드백 제출"}
          </Button>
        </CardContent>
      </Card>

      {/* 테스트 가이드 */}
      <Card>
        <CardHeader>
          <CardTitle>테스트 가이드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">🎯 주요 테스트 영역</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>회원가입 및 전화번호 인증</li>
                <li>상품 등록 및 이미지 업로드</li>
                <li>실시간 경매 참여 및 입찰</li>
                <li>프록시 입찰 기능</li>
                <li>결제 및 거래 완료</li>
                <li>모바일 반응형 디자인</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">📱 테스트 환경</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>데스크톱:</strong>
                  <ul className="list-disc list-inside ml-4 text-gray-600">
                    <li>Chrome, Firefox, Safari</li>
                    <li>다양한 화면 크기</li>
                  </ul>
                </div>
                <div>
                  <strong>모바일:</strong>
                  <ul className="list-disc list-inside ml-4 text-gray-600">
                    <li>iOS Safari, Android Chrome</li>
                    <li>세로/가로 모드</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
