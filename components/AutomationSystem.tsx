"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bot, Settings, Zap, TrendingUp, Shield, CheckCircle, XCircle, Play, Pause } from "lucide-react"

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: string
  action: string
  conditions: Record<string, any>
  isActive: boolean
  lastExecuted?: string
  executionCount: number
}

interface AutomationStats {
  totalRules: number
  activeRules: number
  executionsToday: number
  successRate: number
}

export default function AutomationSystem() {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "자동 입찰 관리",
      description: "경매 종료 10분 전 자동으로 최고 입찰가 갱신",
      trigger: "auction_ending_soon",
      action: "auto_bid",
      conditions: { timeRemaining: 10, bidIncrement: 1000 },
      isActive: true,
      lastExecuted: "2024-01-15T10:30:00Z",
      executionCount: 45,
    },
    {
      id: "2",
      name: "가격 알림",
      description: "관심 상품이 설정 가격 이하로 떨어지면 알림",
      trigger: "price_drop",
      action: "send_notification",
      conditions: { priceThreshold: 50000 },
      isActive: true,
      lastExecuted: "2024-01-15T09:15:00Z",
      executionCount: 23,
    },
    {
      id: "3",
      name: "사기 탐지",
      description: "의심스러운 활동 패턴 감지 시 자동 신고",
      trigger: "suspicious_activity",
      action: "flag_user",
      conditions: { riskScore: 80 },
      isActive: true,
      lastExecuted: "2024-01-15T08:45:00Z",
      executionCount: 12,
    },
  ])

  const [stats, setStats] = useState<AutomationStats>({
    totalRules: 3,
    activeRules: 3,
    executionsToday: 80,
    successRate: 94.5,
  })

  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    trigger: "",
    action: "",
    conditions: {},
  })

  const [showCreateForm, setShowCreateForm] = useState(false)

  const toggleRule = (ruleId: string) => {
    setRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule)))
  }

  const deleteRule = (ruleId: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== ruleId))
  }

  const createRule = () => {
    if (!newRule.name || !newRule.trigger || !newRule.action) return

    const rule: AutomationRule = {
      id: Date.now().toString(),
      name: newRule.name,
      description: newRule.description,
      trigger: newRule.trigger,
      action: newRule.action,
      conditions: newRule.conditions,
      isActive: true,
      executionCount: 0,
    }

    setRules((prev) => [...prev, rule])
    setNewRule({ name: "", description: "", trigger: "", action: "", conditions: {} })
    setShowCreateForm(false)
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-600" />
            자동화 시스템
          </h1>
          <p className="text-muted-foreground mt-2">AI 기반 자동화 규칙으로 효율적인 경매 관리</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Zap className="h-4 w-4 mr-2" />새 규칙 만들기
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 규칙</p>
                <p className="text-2xl font-bold">{stats.totalRules}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">활성 규칙</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeRules}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">오늘 실행</p>
                <p className="text-2xl font-bold">{stats.executionsToday}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">성공률</p>
                <p className="text-2xl font-bold text-blue-600">{stats.successRate}%</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 규칙 생성 폼 */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>새 자동화 규칙 만들기</CardTitle>
            <CardDescription>조건과 액션을 설정하여 자동화 규칙을 생성하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ruleName">규칙 이름</Label>
                <Input
                  id="ruleName"
                  value={newRule.name}
                  onChange={(e) => setNewRule((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="규칙 이름을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ruleDescription">설명</Label>
                <Input
                  id="ruleDescription"
                  value={newRule.description}
                  onChange={(e) => setNewRule((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="규칙 설명을 입력하세요"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>트리거</Label>
                <Select
                  value={newRule.trigger}
                  onValueChange={(value) => setNewRule((prev) => ({ ...prev, trigger: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="트리거 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auction_ending_soon">경매 종료 임박</SelectItem>
                    <SelectItem value="price_drop">가격 하락</SelectItem>
                    <SelectItem value="new_bid">새 입찰</SelectItem>
                    <SelectItem value="suspicious_activity">의심스러운 활동</SelectItem>
                    <SelectItem value="user_registration">사용자 등록</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>액션</Label>
                <Select
                  value={newRule.action}
                  onValueChange={(value) => setNewRule((prev) => ({ ...prev, action: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="액션 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto_bid">자동 입찰</SelectItem>
                    <SelectItem value="send_notification">알림 발송</SelectItem>
                    <SelectItem value="flag_user">사용자 신고</SelectItem>
                    <SelectItem value="send_email">이메일 발송</SelectItem>
                    <SelectItem value="update_price">가격 업데이트</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                취소
              </Button>
              <Button onClick={createRule}>규칙 생성</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 규칙 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>자동화 규칙</CardTitle>
          <CardDescription>현재 설정된 자동화 규칙들을 관리하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${rule.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                    <h3 className="font-semibold">{rule.name}</h3>
                    <Badge variant={rule.isActive ? "default" : "secondary"}>{rule.isActive ? "활성" : "비활성"}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => toggleRule(rule.id)}>
                      {rule.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteRule(rule.id)}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">트리거:</span>
                    <Badge variant="outline" className="ml-2">
                      {rule.trigger}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">액션:</span>
                    <Badge variant="outline" className="ml-2">
                      {rule.action}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">실행 횟수:</span>
                    <span className="ml-2">{rule.executionCount}회</span>
                  </div>
                </div>

                {rule.lastExecuted && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    마지막 실행: {new Date(rule.lastExecuted).toLocaleString("ko-KR")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 시스템 상태 */}
      <Card>
        <CardHeader>
          <CardTitle>시스템 상태</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>모든 자동화 시스템이 정상적으로 작동 중입니다.</AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">CPU 사용률</span>
                  <span className="text-sm">23%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "23%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">메모리 사용률</span>
                  <span className="text-sm">67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "67%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
