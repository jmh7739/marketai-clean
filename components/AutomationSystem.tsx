"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Settings, TrendingUp, Shield, Clock } from "lucide-react"

interface AutomationRule {
  id: string
  name: string
  type: "bidding" | "pricing" | "fraud" | "notification"
  enabled: boolean
  conditions: any
  actions: any
  lastTriggered?: Date
  triggerCount: number
}

export function AutomationSystem() {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 기본 자동화 규칙 로드
    const defaultRules: AutomationRule[] = [
      {
        id: "1",
        name: "AI 가격 분석 자동화",
        type: "pricing",
        enabled: true,
        conditions: { priceVariation: 10 },
        actions: { adjustPrice: true, notify: true },
        triggerCount: 156,
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "2",
        name: "사기 탐지 시스템",
        type: "fraud",
        enabled: true,
        conditions: { suspiciousActivity: true },
        actions: { blockUser: true, alertAdmin: true },
        triggerCount: 23,
        lastTriggered: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        id: "3",
        name: "자동 입찰 관리",
        type: "bidding",
        enabled: false,
        conditions: { maxBid: 100000 },
        actions: { autoBid: true },
        triggerCount: 89,
        lastTriggered: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: "4",
        name: "마감 임박 알림",
        type: "notification",
        enabled: true,
        conditions: { timeLeft: 60 },
        actions: { sendNotification: true },
        triggerCount: 342,
        lastTriggered: new Date(Date.now() - 30 * 60 * 1000),
      },
    ]
    setRules(defaultRules)
  }, [])

  const toggleRule = (ruleId: string) => {
    setRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pricing":
        return <TrendingUp className="w-4 h-4" />
      case "fraud":
        return <Shield className="w-4 h-4" />
      case "bidding":
        return <Bot className="w-4 h-4" />
      case "notification":
        return <Clock className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pricing":
        return "bg-blue-100 text-blue-800"
      case "fraud":
        return "bg-red-100 text-red-800"
      case "bidding":
        return "bg-green-100 text-green-800"
      case "notification":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">자동화 시스템</h2>
          <p className="text-gray-600">AI 기반 자동화 규칙을 관리하고 모니터링하세요</p>
        </div>
        <Button>
          <Bot className="w-4 h-4 mr-2" />새 규칙 추가
        </Button>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">자동화 규칙</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(rule.type)}`}>{getTypeIcon(rule.type)}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                        <p className="text-sm text-gray-600">
                          {rule.triggerCount}회 실행 •
                          {rule.lastTriggered
                            ? ` 마지막 실행: ${rule.lastTriggered.toLocaleString("ko-KR")}`
                            : " 실행 기록 없음"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={rule.enabled ? "default" : "secondary"}>{rule.enabled ? "활성" : "비활성"}</Badge>
                      <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">총 실행 횟수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {rules.reduce((sum, rule) => sum + rule.triggerCount, 0).toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 mt-1">지난 30일</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">활성 규칙</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{rules.filter((rule) => rule.enabled).length}</div>
                <p className="text-xs text-gray-600 mt-1">총 {rules.length}개 중</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">성공률</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">98.7%</div>
                <p className="text-xs text-gray-600 mt-1">평균 성공률</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>시스템 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-enable">새 규칙 자동 활성화</Label>
                  <p className="text-sm text-gray-600">새로 생성된 규칙을 자동으로 활성화합니다</p>
                </div>
                <Switch id="auto-enable" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">시스템 알림</Label>
                  <p className="text-sm text-gray-600">자동화 규칙 실행 시 알림을 받습니다</p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="check-interval">규칙 확인 간격 (분)</Label>
                <Input id="check-interval" type="number" defaultValue="5" min="1" max="60" className="w-32" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AutomationSystem
