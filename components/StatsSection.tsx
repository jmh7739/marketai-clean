"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getStats } from "@/lib/utils"

export function StatsSection() {
  const [stats, setStats] = useState({
    totalAuctions: 0,
    activeAuctions: 0,
    totalUsers: 0,
    totalBids: 0,
  })

  useEffect(() => {
    setStats(getStats())
  }, [])

  const statItems = [
    { label: "총 경매", value: stats.totalAuctions.toLocaleString(), color: "text-blue-600" },
    { label: "진행중 경매", value: stats.activeAuctions.toLocaleString(), color: "text-green-600" },
    { label: "총 회원수", value: stats.totalUsers.toLocaleString(), color: "text-purple-600" },
    { label: "총 입찰수", value: stats.totalBids.toLocaleString(), color: "text-orange-600" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
            <div className="text-sm text-gray-600 mt-1">{item.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default StatsSection
