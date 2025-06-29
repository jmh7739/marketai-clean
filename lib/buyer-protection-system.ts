import { supabase } from "./supabase-client"

export interface ProtectionCase {
  id: string
  transactionId: string
  buyerId: string
  sellerId: string
  issueType: "item_not_received" | "significantly_not_as_described" | "counterfeit_item" | "seller_fraud"
  description: string
  evidence: string[]
  status: "open" | "in_discussion" | "escalated" | "resolved"
  createdAt: string
  resolvedAt?: string
}

export class BuyerProtectionSystem {
  // 문제 신고
  static async reportIssue(data: {
    transactionId: string
    buyerId: string
    issueType: string
    description: string
    evidence: File[]
  }) {
    try {
      // 거래 확인
      const { data: transaction } = await supabase
        .from("transactions")
        .select("*, auction:auctions(seller_id)")
        .eq("id", data.transactionId)
        .eq("buyer_id", data.buyerId)
        .single()

      if (!transaction) {
        return { success: false, error: "거래를 찾을 수 없습니다" }
      }

      // 신고 기간 확인 (30일)
      const deliveredAt = transaction.delivered_at
      if (deliveredAt) {
        const daysSinceDelivery = (Date.now() - new Date(deliveredAt).getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceDelivery > 30) {
          return { success: false, error: "신고 가능 기간이 지났습니다 (30일)" }
        }
      }

      // 증거 파일 업로드
      const evidenceUrls = await this.uploadEvidence(data.evidence)

      // 보호 케이스 생성
      const { data: protectionCase } = await supabase
        .from("protection_cases")
        .insert({
          transaction_id: data.transactionId,
          buyer_id: data.buyerId,
          seller_id: transaction.auction.seller_id,
          issue_type: data.issueType,
          description: data.description,
          evidence: evidenceUrls,
          status: "open",
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      // 분쟁해결센터 대화방 생성
      await this.createDisputeRoom(protectionCase.id, data.buyerId, transaction.auction.seller_id)

      return { success: true, caseId: protectionCase.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 분쟁해결센터 대화방 생성
  private static async createDisputeRoom(caseId: string, buyerId: string, sellerId: string) {
    await supabase.from("dispute_rooms").insert({
      case_id: caseId,
      buyer_id: buyerId,
      seller_id: sellerId,
      status: "active",
      created_at: new Date().toISOString(),
      escalation_deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48시간 후
    })
  }

  // 증거 파일 업로드
  private static async uploadEvidence(files: File[]): Promise<string[]> {
    const urls: string[] = []

    for (const file of files) {
      const fileName = `evidence/${Date.now()}_${file.name}`
      const { data } = await supabase.storage.from("protection-cases").upload(fileName, file)

      if (data) urls.push(data.path)
    }

    return urls
  }

  // 케이스 해결
  static async resolveCase(
    caseId: string,
    resolution: {
      type: "refund" | "exchange" | "no_action"
      amount?: number
      reason: string
    },
  ) {
    try {
      await supabase
        .from("protection_cases")
        .update({
          status: "resolved",
          resolution_type: resolution.type,
          resolution_amount: resolution.amount,
          resolution_reason: resolution.reason,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", caseId)

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
