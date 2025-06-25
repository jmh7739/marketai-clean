"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Shield, TrendingUp } from "lucide-react"

interface AutomationRule {
  id: string
  name: string
  type: "re_auction" | "spam_filter" | "price_alert" | "fraud_detection"
  status: "active" | "inactive"
  lastTriggered?: Date
  triggerCount: number
}

export default function AutomationSystem() {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "자동 재경매",
      type: "re_auction",
      status: "active",
      lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
      triggerCount: 15,
    },
    {
      id: "2",
      name: "스팸 필터링",
      type: "spam_filter",
      status: "active",
      lastTriggered: new Date(Date.now() - 30 * 60 * 1000),
      triggerCount: 42,
    },
    {
      id: "3",
      name: "가격 이상 감지",
      type: "price_alert",
      status: "active",
      lastTriggered: new Date(Date.now() - 4 * 60 * 60 * 1000),
      triggerCount: 8,
    },
    {
      id: "4",
      name: "사기 탐지",
      type: "fraud_detection",
      status: "active",
      lastTriggered: new Date(Date.now() - 6 * 60 * 60 * 1000),
      triggerCount: 3,
    },
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case "re_auction":
        return <RefreshCw className="w-5 h-5 text-blue-500" />
      case "spam_filter":
        return <Shield className="w-5 h-5 text-green-500" />
      case "price_alert":
        return <TrendingUp className="w-5 h-5 text-orange-500" />
      case "fraud_detection":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <RefreshCw className="w-5 h-5" />
    }
  }

  const getDescription = (type: string) => {
    switch (type) {
      case "re_auction":
        return "낙찰자 미결제시 자동으로 재경매 진행"
      case "spam_filter":
        return "스팸 상품 및 댓글 자동 필터링"
      case "price_alert":
        return "비정상적인 가격 패턴 감지 및 알림"
      case "fraud_detection":
        return "사기 의심 계정 및 거래 패턴 탐지"
      default:
        return ""
    }
  }

  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, status: rule.status === "active" ? "inactive" : "active" } : rule,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">자동화 시스템</h2>
        <p className="text-gray-600">플랫폼 운영을 위한 자동화 규칙들을 관리합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getIcon(rule.type)}
                  <CardTitle className="text-lg">{rule.name}</CardTitle>
                </div>
                <Badge variant={rule.status === "active" ? "default" : "secondary"}>
                  {rule.status === "active" ? "활성" : "비활성"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{getDescription(rule.type)}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>총 실행 횟수:</span>
                  <span className="font-medium">{rule.triggerCount}회</span>
                </div>
                {rule.lastTriggered && (
                  <div className="flex justify-between text-sm">
                    <span>마지막 실행:</span>
                    <span className="font-medium">{rule.lastTriggered.toLocaleString("ko-KR")}</span>
                  </div>
                )}
              </div>

              <Button
                variant={rule.status === "active" ? "outline" : "default"}
                size="sm"
                onClick={() => toggleRule(rule.id)}
                className="w-full"
              >
                {rule.status === "active" ? "비활성화" : "활성화"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
