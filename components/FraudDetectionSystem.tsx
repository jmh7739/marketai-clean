"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Eye, Shield, Users, ImageIcon } from "lucide-react"

interface FraudAlert {
  id: string
  type: "duplicate_image" | "suspicious_price" | "fake_account" | "unusual_pattern"
  severity: "low" | "medium" | "high"
  description: string
  userId?: string
  productId?: string
  timestamp: Date
  status: "pending" | "resolved" | "false_positive"
}

export default function FraudDetectionSystem() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([
    {
      id: "1",
      type: "duplicate_image",
      severity: "high",
      description: "동일한 상품 이미지가 여러 계정에서 사용됨",
      userId: "user123",
      productId: "prod456",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: "pending",
    },
    {
      id: "2",
      type: "suspicious_price",
      severity: "medium",
      description: "시장가 대비 비정상적으로 낮은 가격 설정",
      userId: "user789",
      productId: "prod101",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "pending",
    },
    {
      id: "3",
      type: "fake_account",
      severity: "high",
      description: "단기간 내 대량 계정 생성 패턴 감지",
      userId: "user999",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: "resolved",
    },
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case "duplicate_image":
        return <ImageIcon className="w-5 h-5 text-orange-500" />
      case "suspicious_price":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "fake_account":
        return <Users className="w-5 h-5 text-red-500" />
      case "unusual_pattern":
        return <Eye className="w-5 h-5 text-purple-500" />
      default:
        return <Shield className="w-5 h-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "destructive"
      case "resolved":
        return "default"
      case "false_positive":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const handleResolve = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" as const } : alert)))
  }

  const handleFalsePositive = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, status: "false_positive" as const } : alert)),
    )
  }

  const pendingAlerts = alerts.filter((alert) => alert.status === "pending")
  const resolvedAlerts = alerts.filter((alert) => alert.status !== "pending")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">사기 방지 시스템</h2>
          <p className="text-gray-600">AI 기반 사기 탐지 및 예방 시스템</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{pendingAlerts.length}</div>
            <div className="text-sm text-gray-600">대기중</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</div>
            <div className="text-sm text-gray-600">처리완료</div>
          </div>
        </div>
      </div>

      {/* 대기중인 알림 */}
      {pendingAlerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">처리 대기중인 알림</h3>
          <div className="space-y-4">
            {pendingAlerts.map((alert) => (
              <Card key={alert.id} className="border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity === "high" ? "높음" : alert.severity === "medium" ? "보통" : "낮음"}
                          </Badge>
                          <span className="text-sm text-gray-500">{alert.timestamp.toLocaleString("ko-KR")}</span>
                        </div>
                        <p className="font-medium mb-1">{alert.description}</p>
                        <div className="text-sm text-gray-600">
                          {alert.userId && <span>사용자: {alert.userId}</span>}
                          {alert.productId && <span className="ml-4">상품: {alert.productId}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleFalsePositive(alert.id)}>
                        오탐지
                      </Button>
                      <Button size="sm" onClick={() => handleResolve(alert.id)}>
                        처리완료
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 처리된 알림 */}
      {resolvedAlerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">처리 완료된 알림</h3>
          <div className="space-y-2">
            {resolvedAlerts.slice(0, 5).map((alert) => (
              <Card key={alert.id} className="border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getIcon(alert.type)}
                      <span className="text-sm">{alert.description}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(alert.status)}>
                        {alert.status === "resolved" ? "해결됨" : "오탐지"}
                      </Badge>
                      <span className="text-xs text-gray-500">{alert.timestamp.toLocaleDateString("ko-KR")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
