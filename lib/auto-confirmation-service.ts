import { supabase } from "./supabase"

export interface AutoConfirmationPolicy {
  businessDays: number
  maxDays: number
  trackingIncentive: boolean
  mandatoryConfirmation: boolean
}

export class AutoConfirmationService {
  private static readonly POLICY: AutoConfirmationPolicy = {
    businessDays: 7, // 송장 등록 시 평일 7일
    maxDays: 30, // 최대 30일 후 강제 확정
    trackingIncentive: true, // 송장 등록 시 빠른 확정
    mandatoryConfirmation: true, // 최종적으로는 무조건 확정
  }

  // 자동 확정 날짜 계산
  static calculateAutoConfirmDate(deliveredAt: Date, hasTracking: boolean): Date {
    const confirmDate = new Date(deliveredAt)

    if (hasTracking) {
      // 송장 등록 시: 평일 기준 7일
      let addedDays = 0
      while (addedDays < this.POLICY.businessDays) {
        confirmDate.setDate(confirmDate.getDate() + 1)
        const dayOfWeek = confirmDate.getDay()
        // 주말(토:6, 일:0) 제외
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          addedDays++
        }
      }
    } else {
      // 송장 미등록 시: 30일 후 강제 확정
      confirmDate.setDate(confirmDate.getDate() + this.POLICY.maxDays)
    }

    return confirmDate
  }

  // 자동 확정 처리
  static async processAutoConfirmation(transactionId: string) {
    try {
      const { data: transaction } = await supabase
        .from("transactions")
        .select(`
          *,
          auction:auctions(*),
          buyer:profiles!buyer_id(*),
          seller:profiles!seller_id(*)
        `)
        .eq("id", transactionId)
        .single()

      if (!transaction) return

      const hasTracking = !!transaction.tracking_number
      const confirmationType = hasTracking ? "auto_with_tracking" : "auto_mandatory"

      // 자동 확정 처리
      await supabase
        .from("transactions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          confirmation_type: confirmationType,
          auto_confirmed: true,
        })
        .eq("id", transactionId)

      // 정산 처리 예약
      await this.scheduleSettlement(transaction)

      // 알림 발송
      await this.sendAutoConfirmationNotification(transaction, hasTracking)

      console.log(`거래 ${transactionId} 자동 확정 완료 (${confirmationType})`)
    } catch (error) {
      console.error("자동 확정 처리 오류:", error)
    }
  }

  // 정산 예약
  private static async scheduleSettlement(transaction: any) {
    const settlementDate = new Date()
    settlementDate.setDate(settlementDate.getDate() + 7) // 확정 후 7일

    await supabase.from("settlement_schedule").insert({
      transaction_id: transaction.id,
      seller_id: transaction.seller_id,
      amount: transaction.amount,
      scheduled_at: settlementDate.toISOString(),
      status: "scheduled",
    })
  }

  // 자동 확정 알림
  private static async sendAutoConfirmationNotification(transaction: any, hasTracking: boolean) {
    const message = hasTracking
      ? "배송 완료 후 7일이 경과하여 자동으로 구매가 확정되었습니다."
      : "경매 종료 후 30일이 경과하여 자동으로 구매가 확정되었습니다."

    console.log(`구매자 ${transaction.buyer_id}에게 알림: ${message}`)
    console.log(`판매자 ${transaction.seller_id}에게 정산 예정 알림`)
  }

  // 확정 정책 안내 텍스트
  static getConfirmationPolicyText(): string {
    return `
구매확정 정책:
• 송장 등록 시: 배송완료 후 평일 기준 7일 후 자동 확정
• 송장 미등록 시: 경매 종료 후 30일 후 자동 확정
• 구매자는 언제든 수동으로 구매확정 가능
• 자동 확정 후 7일 뒤 판매자에게 정산
    `
  }
}
