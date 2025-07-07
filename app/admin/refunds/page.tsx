"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, DollarSign } from "lucide-react"
import type { RefundRequest } from "@/types/refund"

export default function RefundManagement() {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for refund requests
    const mockRefunds: RefundRequest[] = [
      {
        id: "1",
        userId: "user123",
        auctionId: "auction456",
        amount: 150.0,
        reason: "Item not as described",
        status: "pending",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        userId: "user789",
        auctionId: "auction101",
        amount: 75.5,
        reason: "Seller did not ship item",
        status: "approved",
        createdAt: "2024-01-14T14:20:00Z",
        updatedAt: "2024-01-15T09:15:00Z",
        adminNotes: "Verified with shipping records",
        processedBy: "admin@example.com",
        processedAt: "2024-01-15T09:15:00Z",
      },
    ]

    setRefundRequests(mockRefunds)
    setLoading(false)
  }, [])

  const handleRefundAction = (id: string, action: "approve" | "reject") => {
    setRefundRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status: action === "approve" ? "approved" : "rejected",
              processedBy: "admin@example.com",
              processedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : request,
      ),
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "default",
      approved: "default",
      rejected: "destructive",
      processed: "default",
    } as const

    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      processed: "bg-blue-100 text-blue-800",
    }

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading refund requests...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Refund Management</h1>
          <p className="text-gray-600">Review and process refund requests</p>
        </div>
      </div>

      <div className="grid gap-4">
        {refundRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Refund Request #{request.id}
                    {getStatusBadge(request.status)}
                  </CardTitle>
                  <CardDescription>
                    Amount: ${request.amount.toFixed(2)} • Auction: {request.auctionId}
                  </CardDescription>
                </div>
                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleRefundAction(request.id, "approve")}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleRefundAction(request.id, "reject")}>
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Reason:</strong> {request.reason}
                </p>
                <p>
                  <strong>User ID:</strong> {request.userId}
                </p>
                <p>
                  <strong>Created:</strong> {new Date(request.createdAt).toLocaleDateString()}
                </p>
                {request.adminNotes && (
                  <p>
                    <strong>Admin Notes:</strong> {request.adminNotes}
                  </p>
                )}
                {request.processedBy && (
                  <p>
                    <strong>Processed by:</strong> {request.processedBy}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
