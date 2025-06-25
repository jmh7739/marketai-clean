"use client"

import { useAdminAuth } from "@/contexts/AdminAuthContext"
import { redirect } from "next/navigation"
import AutomationSystem from "@/components/AutomationSystem"
import FraudDetectionSystem from "@/components/FraudDetectionSystem"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MarketAnalytics from "@/components/MarketAnalytics"

export default function AdminAutomationPage() {
  const { isAuthenticated } = useAdminAuth()

  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="automation" className="space-y-6">
          <TabsList>
            <TabsTrigger value="automation">자동화 시스템</TabsTrigger>
            <TabsTrigger value="fraud">사기 방지</TabsTrigger>
            <TabsTrigger value="analytics">시장 분석</TabsTrigger>
          </TabsList>

          <TabsContent value="automation">
            <AutomationSystem />
          </TabsContent>

          <TabsContent value="fraud">
            <FraudDetectionSystem />
          </TabsContent>

          <TabsContent value="analytics">
            <MarketAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
