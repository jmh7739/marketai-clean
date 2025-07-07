import { supabase } from "./supabase"
import type { RefundRequest, RefundStats } from "@/types/refund"

export class RefundSystem {
  static async createRefundRequest(
    refundData: Omit<RefundRequest, "id" | "requestDate" | "status">,
  ): Promise<RefundRequest> {
    const newRefund: RefundRequest = {
      ...refundData,
      id: crypto.randomUUID(),
      requestDate: new Date(),
      status: "pending",
    }

    const { data, error } = await supabase.from("refund_requests").insert([newRefund]).select().single()

    if (error) throw error
    return data
  }

  static async getRefundRequests(status?: string): Promise<RefundRequest[]> {
    let query = supabase.from("refund_requests").select("*")

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("requestDate", { ascending: false })

    if (error) throw error
    return data || []
  }

  static async updateRefundStatus(
    refundId: string,
    status: RefundRequest["status"],
    adminNotes?: string,
  ): Promise<RefundRequest> {
    const updateData: Partial<RefundRequest> = {
      status,
      processedDate: new Date(),
      adminNotes,
    }

    const { data, error } = await supabase
      .from("refund_requests")
      .update(updateData)
      .eq("id", refundId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getRefundStats(): Promise<RefundStats> {
    const { data: requests, error } = await supabase.from("refund_requests").select("*")

    if (error) throw error

    const stats: RefundStats = {
      totalRequests: requests?.length || 0,
      pendingRequests: requests?.filter((r) => r.status === "pending").length || 0,
      approvedRequests: requests?.filter((r) => r.status === "approved").length || 0,
      rejectedRequests: requests?.filter((r) => r.status === "rejected").length || 0,
      totalRefundAmount: requests?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0,
      averageProcessingTime: 0, // Calculate based on processedDate - requestDate
    }

    return stats
  }
}
