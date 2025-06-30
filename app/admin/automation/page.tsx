"use client"

import { useAdminAuth } from "@/contexts/AdminAuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { AutomationSystem } from "@/components/AutomationSystem"
import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function AdminAutomationPage() {
  const { user, loading } = useAdminAuth()
  const [automationSettings, setAutomationSettings] = useState({
    autoModeration: true,
    priceAlerts: true,
    bidValidation: true,
    fraudDetection: true,
    autoRefunds: false,
    scheduledReports: true,
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600">관리자 로그인이 필요합니다.</p>
        </div>
      </div>
    )
  }

  const handleToggle = (key: keyof typeof automationSettings) => {
    setAutomationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">자동화 시스템</h1>
        <p className="text-gray-600">경매 프로세스 자동화 관리</p>
      </div>

      <AutomationSystem />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              자동 조정
              <Badge variant={automationSettings.autoModeration ? "default" : "secondary"}>
                {automationSettings.autoModeration ? "활성" : "비활성"}
              </Badge>
            </CardTitle>
            <CardDescription>부적절한 콘텐츠를 자동으로 감지하고 조치합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>자동 조정 활성화</span>
              <Switch
                checked={automationSettings.autoModeration}
                onCheckedChange={() => handleToggle("autoModeration")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              가격 알림
              <Badge variant={automationSettings.priceAlerts ? "default" : "secondary"}>
                {automationSettings.priceAlerts ? "활성" : "비활성"}
              </Badge>
            </CardTitle>
            <CardDescription>비정상적인 가격 변동을 자동으로 감지합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>가격 알림 활성화</span>
              <Switch checked={automationSettings.priceAlerts} onCheckedChange={() => handleToggle("priceAlerts")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              입찰 검증
              <Badge variant={automationSettings.bidValidation ? "default" : "secondary"}>
                {automationSettings.bidValidation ? "활성" : "비활성"}
              </Badge>
            </CardTitle>
            <CardDescription>입찰의 유효성을 자동으로 검증합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>입찰 검증 활성화</span>
              <Switch
                checked={automationSettings.bidValidation}
                onCheckedChange={() => handleToggle("bidValidation")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              사기 탐지
              <Badge variant={automationSettings.fraudDetection ? "default" : "secondary"}>
                {automationSettings.fraudDetection ? "활성" : "비활성"}
              </Badge>
            </CardTitle>
            <CardDescription>의심스러운 활동을 자동으로 탐지합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>사기 탐지 활성화</span>
              <Switch
                checked={automationSettings.fraudDetection}
                onCheckedChange={() => handleToggle("fraudDetection")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              자동 환불
              <Badge variant={automationSettings.autoRefunds ? "default" : "secondary"}>
                {automationSettings.autoRefunds ? "활성" : "비활성"}
              </Badge>
            </CardTitle>
            <CardDescription>특정 조건에서 자동으로 환불을 처리합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>자동 환불 활성화</span>
              <Switch checked={automationSettings.autoRefunds} onCheckedChange={() => handleToggle("autoRefunds")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              예약 보고서
              <Badge variant={automationSettings.scheduledReports ? "default" : "secondary"}>
                {automationSettings.scheduledReports ? "활성" : "비활성"}
              </Badge>
            </CardTitle>
            <CardDescription>정기적으로 보고서를 자동 생성합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>예약 보고서 활성화</span>
              <Switch
                checked={automationSettings.scheduledReports}
                onCheckedChange={() => handleToggle("scheduledReports")}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>자동화 통계</CardTitle>
            <CardDescription>최근 24시간 자동화 활동 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">127</div>
                <div className="text-sm text-gray-600">자동 조정</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">43</div>
                <div className="text-sm text-gray-600">가격 알림</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">892</div>
                <div className="text-sm text-gray-600">입찰 검증</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">5</div>
                <div className="text-sm text-gray-600">사기 탐지</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button>설정 저장</Button>
      </div>
    </div>
  )
}
