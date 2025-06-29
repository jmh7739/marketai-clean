import { supabase } from "./supabase"

export interface DisputeMessage {
  id: string
  disputeId: string
  senderId: string
  senderType: "buyer" | "seller" | "admin"
  message: string
  attachments?: string[]
  createdAt: string
}

export class DisputeResolutionCenter {
  // 분쟁 신고
  static async createDispute(data: {
    transactionId: string
    buyerId: string
    type: string
    description: string
    evidence: File[]
  }) {
    try {
      // 증거 파일 업로드
      const evidenceUrls = []
      for (const file of data.evidence) {
        const fileName = `disputes/${data.transactionId}_${Date.now()}_${file.name}`
        const { data: uploadData } = await supabase.storage.from("dispute-evidence").upload(fileName, file)

        if (uploadData) evidenceUrls.push(uploadData.path)
      }

      // 분쟁 케이스 생성
      const { data: dispute } = await supabase
        .from("disputes")
        .insert({
          transaction_id: data.transactionId,
          buyer_id: data.buyerId,
          type: data.type,
          description: data.description,
          evidence_urls: evidenceUrls,
          status: "open",
          priority: this.calculatePriority(data.type),
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      // 초기 메시지 생성
      await this.addMessage(dispute.id, data.buyerId, "buyer", data.description)

      // 판매자에게 알림
      await this.notifyParties(dispute, "dispute_created")

      return { success: true, disputeId: dispute.id }
    } catch (error) {
      console.error("분쟁 신고 오류:", error)
      return { success: false, error: error.message }
    }
  }

  // 메시지 추가 (중재를 통한 소통)
  static async addMessage(
    disputeId: string,
    senderId: string,
    senderType: "buyer" | "seller" | "admin",
    message: string,
    attachments?: File[],
  ) {
    try {
      // 첨부파일 업로드
      const attachmentUrls = []
      if (attachments) {
        for (const file of attachments) {
          const fileName = `dispute-messages/${disputeId}_${Date.now()}_${file.name}`
          const { data: uploadData } = await supabase.storage.from("dispute-messages").upload(fileName, file)

          if (uploadData) attachmentUrls.push(uploadData.path)
        }
      }

      // 메시지 저장
      const { data: messageData } = await supabase
        .from("dispute_messages")
        .insert({
          dispute_id: disputeId,
          sender_id: senderId,
          sender_type: senderType,
          message: message,
          attachments: attachmentUrls,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      // 상대방에게 알림
      await this.notifyNewMessage(disputeId, senderType)

      return { success: true, messageId: messageData.id }
    } catch (error) {
      console.error("메시지 추가 오류:", error)
      return { success: false, error: error.message }
    }
  }

  // 분쟁 메시지 조회
  static async getDisputeMessages(disputeId: string) {
    try {
      const { data: messages } = await supabase
        .from("dispute_messages")
        .select(`
          *,
          sender:profiles(name, avatar_url)
        `)
        .eq("dispute_id", disputeId)
        .order("created_at", { ascending: true })

      return { success: true, messages }
    } catch (error) {
      console.error("메시지 조회 오류:", error)
      return { success: false, error: error.message }
    }
  }

  // 관리자 중재 메시지
  static async addAdminMediation(
    disputeId: string,
    adminId: string,
    message: string,
    proposedSolution?: {
      type: "refund" | "exchange" | "partial_refund" | "no_action"
      amount?: number
      reason: string
    },
  ) {
    try {
      // 중재 메시지 추가
      await this.addMessage(disputeId, adminId, "admin", message)

      // 해결 방안 제시
      if (proposedSolution) {
        await supabase
          .from("disputes")
          .update({
            proposed_solution: proposedSolution,
            status: "mediation",
            updated_at: new Date().toISOString(),
          })
          .eq("id", disputeId)
      }

      return { success: true }
    } catch (error) {
      console.error("관리자 중재 오류:", error)
      return { success: false, error: error.message }
    }
  }

  // 분쟁 해결
  static async resolveDispute(
    disputeId: string,
    resolution: {
      type: "refund" | "exchange" | "partial_refund" | "no_action"
      amount?: number
      reason: string
    },
    adminId: string,
  ) {
    try {
      await supabase
        .from("disputes")
        .update({
          status: "resolved",
          resolution_type: resolution.type,
          resolution_amount: resolution.amount,
          resolution_reason: resolution.reason,
          resolved_by: adminId,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", disputeId)

      // 해결 알림 메시지
      const resolutionMessage = `분쟁이 해결되었습니다.\n해결방안: ${resolution.type}\n사유: ${resolution.reason}`
      await this.addMessage(disputeId, adminId, "admin", resolutionMessage)

      // 후속 처리
      await this.executeResolution(disputeId, resolution)

      return { success: true }
    } catch (error) {
      console.error("분쟁 해결 오류:", error)
      return { success: false, error: error.message }
    }
  }

  // 우선순위 계산
  private static calculatePriority(type: string): string {
    switch (type) {
      case "not_received":
        return "high"
      case "defective":
        return "medium"
      case "not_as_described":
        return "medium"
      default:
        return "low"
    }
  }

  // 관련자 알림
  private static async notifyParties(dispute: any, eventType: string) {
    console.log(`분쟁 ${dispute.id} 알림: ${eventType}`)
    // 실제로는 푸시 알림 발송
  }

  // 새 메시지 알림
  private static async notifyNewMessage(disputeId: string, senderType: string) {
    console.log(`분쟁 ${disputeId}에 새 메시지 (${senderType})`)
    // 실제로는 푸시 알림 발송
  }

  // 해결방안 실행
  private static async executeResolution(disputeId: string, resolution: any) {
    switch (resolution.type) {
      case "refund":
        console.log(`전액 환불 처리: ${resolution.amount}원`)
        break
      case "partial_refund":
        console.log(`부분 환불 처리: ${resolution.amount}원`)
        break
      case "exchange":
        console.log(`교환 처리 시작`)
        break
      case "no_action":
        console.log(`조치 없음`)
        break
    }
  }
}
