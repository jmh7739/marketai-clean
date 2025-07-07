"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, X, Eye } from "lucide-react"
import type { ReportData } from "@/types/admin"

export default function ReportManagement() {
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for reports
    const mockReports: ReportData[] = [
      {
        id: "1",
        title: "Monthly Sales Report",
        type: "sales",
        dateRange: {
          start: "2024-01-01",
          end: "2024-01-31",
        },
        data: [],
        createdAt: "2024-01-31T10:00:00Z",
        createdBy: "admin@example.com",
        status: "completed",
      },
      {
        id: "2",
        title: "User Activity Report",
        type: "users",
        dateRange: {
          start: "2024-01-01",
          end: "2024-01-31",
        },
        data: [],
        createdAt: "2024-01-30T15:30:00Z",
        createdBy: "admin@example.com",
        status: "generating",
      },
    ]

    setReports(mockReports)
    setLoading(false)
  }, [])

  const generateReport = (type: string) => {
    const newReport: ReportData = {
      id: Date.now().toString(),
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      type: type as "sales" | "users" | "auctions" | "disputes",
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        end: new Date().toISOString().split("T")[0],
      },
      data: [],
      createdAt: new Date().toISOString(),
      createdBy: "admin@example.com",
      status: "generating",
    }

    setReports((prev) => [newReport, ...prev])

    // Simulate report generation
    setTimeout(() => {
      setReports((prev) =>
        prev.map((report) => (report.id === newReport.id ? { ...report, status: "completed" as const } : report)),
      )
    }, 3000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "generating":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading reports...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Report Management</h1>
          <p className="text-gray-600">Generate and manage system reports</p>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={generateReport}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Generate Report" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales Report</SelectItem>
              <SelectItem value="users">User Report</SelectItem>
              <SelectItem value="auctions">Auction Report</SelectItem>
              <SelectItem value="disputes">Dispute Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {report.title}
                    {getStatusIcon(report.status)}
                  </CardTitle>
                  <CardDescription>
                    {report.dateRange.start} to {report.dateRange.end}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {report.status === "completed" && (
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Created by: {report.createdBy}</span>
                <span>Status: {report.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
