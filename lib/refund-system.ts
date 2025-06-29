import { db } from "./supabase"
import type { RefundPolicy, RefundRequest, CancellationRule } from "@/types/refund"

export class RefundSystem {
  // 환불 정책 정의
  static readonly REFUND_POLICIES: RefundPolicy[] = [
    {
      id: "auction_before_bid",
      type: "auction_cancel",
      title: "입찰 전 경매 취소",
      description: "첫 입찰이 없는 경우 판매자가 취소 가능",
      conditions: ["입찰자가 없는 경우", "경매 시작 후 24시간 이내", "정당한 사유 필요"],
      refundRate: 100,
      processingDays: 1,
      feeDeduction: 0,
    },
    {
      id: "auction_with_bids",
      type: "auction_cancel",
      title: "입찰 후 경매 취소",
      description: "입찰이 있는 경우 취소 시 패널티 적용",
      conditions: ["관리자 승인 필요", "정당한 사유 필요", "입찰자들에게 보상"],
      refundRate: 80,
      processingDays: 3,
      feeDeduction: 20,
    },
    {
      id: "post_auction_buyer",
      type: "post_auction_cancel",
      title: "낙찰 후 구매자 취소",
      description: "낙찰 후 구매자의 일방적 취소",
      conditions: ["결제 전 24시간 이내만 가능", "취소 수수료 10% 적용", "판매자 동의 필요"],
      refundRate: 90,
      processingDays: 2,
      feeDeduction: 10,
    },
    {
      id: "dispute_resolution",
      type: "dispute_refund",
      title: "분쟁 해결 환불",
      description: "상품 하자, 허위 정보 등으로 인한 환불",
      conditions: ["증빙 자료 제출 필요", "관리자 조사 후 결정", "상품 반송 필요"],
      refundRate: 100,
      processingDays: 7,
      feeDeduction: 0,
    },
  ]

  // 취소 규칙 정의
  static readonly CANCELLATION_RULES: CancellationRule[] = [
    {
      phase: "before_bid",
      allowedBy: "seller",
      penaltyRate: 0,
      description: "입찰 전에는 판매자가 자유롭게 취소 가능",
    },
    {
      phase: "during_auction",
      allowedBy: "admin_only",
      penaltyRate: 20,
      description: "경매 진행 중에는 관리자 승인 필요",
    },
    {
      phase: "after_auction",
      allowedBy: "both",
      penaltyRate: 10,
      description: "낙찰 후 24시간 이내 취소 가능 (패널티 적용)",
    },
    {
      phase: "payment_pending",
      allowedBy: "buyer",
      penaltyRate: 5,
      description: "결제 대기 중 구매자 취소 가능",
    },
  ]

  // 환불 요청 생성
  static async createRefundRequest(request: Omit<RefundRequest, "id" | "createdAt" | "status">) {
    try {
      const { data, error } = await db
        .from("refund_requests")
        .insert([
          {
            ...request,
            status: "pending",
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error("환불 요청 생성 실패:", error)
      return { success: false, error }
    }
  }

  // 환불 요청 처리
  static async processRefundRequest(
    requestId: string,
    decision: "approved" | "rejected",
    adminNotes: string,
    adminId: string,
  ) {
    try {
      const { data, error } = await db
        .from("refund_requests")
        .update({
          status: decision,
          admin_notes: adminNotes,
          processed_by: adminId,
          processed_at: new Date().toISOString(),
        })
        .eq("id", requestId)
        .select()
        .single()

      if (error) throw error

      // 승인된 경우 실제 환불 처리
      if (decision === "approved") {
        await this.executeRefund(data)
      }

      return { success: true, data }
    } catch (error) {
      console.error("환불 요청 처리 실패:", error)
      return { success: false, error }
    }
  }

  // 실제 환불 실행
  private static async executeRefund(refundRequest: any) {
    // 실제 환경에서는 PG사 API 호출
    console.log(`환불 실행: ${refundRequest.amount}원`)

    // 거래 상태 업데이트
    await db.from("transactions").update({ status: "refunded" }).eq("auction_id", refundRequest.auction_id)
  }

  // 취소 가능 여부 확인
  static canCancel(
    phase: string,
    userRole: "seller" | "buyer",
  ): { allowed: boolean; penalty: number; reason?: string } {
    const rule = this.CANCELLATION_RULES.find((r) => r.phase === phase)

    if (!rule) {
      return { allowed: false, penalty: 0, reason: "해당 단계에서는 취소가 불가능합니다" }
    }

    if (rule.allowedBy === "admin_only") {
      return { allowed: false, penalty: rule.penaltyRate, reason: "관리자 승인이 필요합니다" }
    }

    if (rule.allowedBy === "both" || rule.allowedBy === userRole) {
      return { allowed: true, penalty: rule.penaltyRate }
    }

    return { allowed: false, penalty: 0, reason: "취소 권한이 없습니다" }
  }
}
