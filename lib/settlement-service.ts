import { supabase } from "./supabase"

export interface SettlementPolicy {
  delayDays: number
  feeRate: number
  batchDay: string
}

export class SettlementService {
  private static readonly POLICY: SettlementPolicy = {
    delayDays: 7, // 구매확정 후 7일
    feeRate: 0.05, // 5% 기본 수수료
    batchDay: "friday", // 매주 금요일 정산
  }

  // 정산 처리
  static async processSettlement(transactionId: string) {
    try {
      const { data: transaction } = await supabase
        .from("transactions")
        .select(`
          *,
          seller:profiles!seller_id(*),
          auction:auctions(*)
        `)
        .eq("id", transactionId)
        .eq("status", "completed")
        .single()

      if (!transaction) return

      // 수수료 계산
      const feeAmount = this.calculateFee(transaction.amount)
      const settlementAmount = transaction.amount - feeAmount

      // 정산 기록 생성
      const { data: settlementRecord } = await supabase
        .from("settlements")
        .insert({
          transaction_id: transactionId,
          seller_id: transaction.seller_id,
          gross_amount: transaction.amount,
          fee_amount: feeAmount,
          net_amount: settlementAmount,
          bank_account: transaction.seller.bank_account,
          account_holder: transaction.seller.account_holder,
          status: "processing",
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      // 실제 계좌 이체 (모의)
      await this.transferToSeller(settlementRecord)

      console.log(`정산 완료: ${settlementAmount}원 → ${transaction.seller.name}`)
    } catch (error) {
      console.error("정산 처리 오류:", error)
    }
  }

  // 수수료 계산 (최소 금액 제한 제거)
  private static calculateFee(amount: number): number {
    if (amount < 10000) return Math.floor(amount * 0.1)
    if (amount < 50000) return Math.floor(amount * 0.09)
    if (amount < 100000) return Math.floor(amount * 0.08)
    if (amount < 300000) return Math.floor(amount * 0.07)
    if (amount < 500000) return Math.floor(amount * 0.065)
    if (amount < 1000000) return Math.floor(amount * 0.06)
    if (amount < 3000000) return Math.floor(amount * 0.055)
    return Math.floor(amount * 0.05)
  }

  // 판매자 계좌 이체
  private static async transferToSeller(settlement: any) {
    // 실제로는 은행 API 호출
    console.log(`계좌 이체: ${settlement.net_amount}원 → ${settlement.account_holder}`)

    await supabase
      .from("settlements")
      .update({
        status: "completed",
        transferred_at: new Date().toISOString(),
      })
      .eq("id", settlement.id)
  }

  // 주간 정산 배치 (매주 금요일)
  static async weeklySettlementBatch() {
    const { data: scheduledSettlements } = await supabase
      .from("settlement_schedule")
      .select("*")
      .eq("status", "scheduled")
      .lte("scheduled_at", new Date().toISOString())

    for (const schedule of scheduledSettlements || []) {
      await this.processSettlement(schedule.transaction_id)

      await supabase.from("settlement_schedule").update({ status: "processed" }).eq("id", schedule.id)
    }

    console.log(`주간 정산 배치 완료: ${scheduledSettlements?.length || 0}건`)
  }

  // 정산 정책 안내 텍스트
  static getSettlementPolicyText(): string {
    return `
정산 정책:
• 구매확정 후 7일 뒤 자동 정산
• 매주 금요일 일괄 정산 처리
• 수수료: 거래액의 5-10% (거래액에 따라 차등)
• 최소 정산 금액 제한 없음
• 정산 완료 시 이메일 및 SMS 알림
    `
  }
}
