import { supabase } from "./supabase-client"

export interface PaymentReport {
  id: string
  auctionId: string
  buyerId: string
  sellerId: string
  method: "manual" | "receipt"
  depositorName?: string
  depositDate?: string
  depositTime?: string
  memo?: string
  receiptUrl?: string
  status: "pending" | "confirmed" | "rejected"
  createdAt: string
  confirmedAt?: string
  rejectedReason?: string
}

export class PaymentFlowService {
  // 입금 신고 생성
  static async createPaymentReport(data: {
    auctionId: string
    buyerId: string
    method: "manual" | "receipt"
    depositorName?: string
    depositDate?: string
    depositTime?: string
    memo?: string
    receiptFile?: File
  }) {
    try {
      // 1. 경매 정보 조회
      const { data: auction, error: auctionError } = await supabase
        .from("auctions")
        .select(`
          *,
          seller:profiles!seller_id(*),
          winner:auction_winners!inner(*)
        `)
        .eq("id", data.auctionId)
        .single()

      if (auctionError || !auction) {
        throw new Error("경매 정보를 찾을 수 없습니다")
      }

      // 2. 영수증 파일 업로드 (필요시)
      let receiptUrl = null
      if (data.receiptFile) {
        const fileName = `receipts/${data.auctionId}_${Date.now()}.${data.receiptFile.name.split(".").pop()}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("payment-receipts")
          .upload(fileName, data.receiptFile)

        if (uploadError) throw uploadError
        receiptUrl = uploadData.path
      }

      // 3. 입금 신고 기록 생성
      const { data: report, error: reportError } = await supabase
        .from("payment_reports")
        .insert({
          auction_id: data.auctionId,
          buyer_id: data.buyerId,
          seller_id: auction.seller_id,
          method: data.method,
          depositor_name: data.depositorName,
          deposit_date: data.depositDate,
          deposit_time: data.depositTime,
          memo: data.memo,
          receipt_url: receiptUrl,
          status: "pending",
          expected_amount: auction.winner.winning_bid,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (reportError) throw reportError

      // 4. 판매자에게 알림 발송
      await this.notifySellerPaymentReport(auction.seller_id, {
        auctionTitle: auction.title,
        buyerName: data.depositorName || "구매자",
        amount: auction.winner.winning_bid,
        reportId: report.id,
      })

      return { success: true, reportId: report.id }
    } catch (error) {
      console.error("입금 신고 생성 오류:", error)
      return { success: false, error: error.message }
    }
  }

  // 판매자 입금 확인/거부
  static async confirmPaymentReport(reportId: string, sellerId: string, confirmed: boolean, reason?: string) {
    try {
      const status = confirmed ? "confirmed" : "rejected"
      const updateData: any = {
        status,
        confirmed_at: new Date().toISOString(),
      }

      if (!confirmed && reason) {
        updateData.rejected_reason = reason
      }

      const { data: report, error } = await supabase
        .from("payment_reports")
        .update(updateData)
        .eq("id", reportId)
        .eq("seller_id", sellerId)
        .select(`
          *,
          auction:auctions(*),
          buyer:profiles!buyer_id(*)
        `)
        .single()

      if (error) throw error

      if (confirmed) {
        // 결제 완료 처리
        await this.processPaymentComplete(report.auction_id)
        await this.notifyBuyerPaymentConfirmed(report.buyer_id, {
          auctionTitle: report.auction.title,
          amount: report.expected_amount,
        })
      } else {
        // 구매자에게 거부 알림
        await this.notifyBuyerPaymentRejected(report.buyer_id, {
          auctionTitle: report.auction.title,
          reason: reason || "입금 정보가 일치하지 않습니다",
        })
      }

      return { success: true }
    } catch (error) {
      console.error("입금 확인 처리 오류:", error)
      return { success: false, error: error.message }
    }
  }

  // 결제 완료 처리
  private static async processPaymentComplete(auctionId: string) {
    // 거래 상태 업데이트
    await supabase
      .from("transactions")
      .update({
        status: "payment_completed",
        paid_at: new Date().toISOString(),
      })
      .eq("auction_id", auctionId)

    // 판매자에게 배송 요청 알림
    const { data: auction } = await supabase.from("auctions").select("seller_id, title").eq("id", auctionId).single()

    if (auction) {
      await this.notifySellerShippingRequest(auction.seller_id, {
        auctionTitle: auction.title,
      })
    }
  }

  // 알림 메서드들
  private static async notifySellerPaymentReport(sellerId: string, data: any) {
    console.log(`판매자 ${sellerId}에게 입금 신고 알림:`, data)
    // 실제로는 푸시 알림, 이메일 발송
  }

  private static async notifyBuyerPaymentConfirmed(buyerId: string, data: any) {
    console.log(`구매자 ${buyerId}에게 결제 확인 알림:`, data)
  }

  private static async notifyBuyerPaymentRejected(buyerId: string, data: any) {
    console.log(`구매자 ${buyerId}에게 입금 거부 알림:`, data)
  }

  private static async notifySellerShippingRequest(sellerId: string, data: any) {
    console.log(`판매자 ${sellerId}에게 배송 요청 알림:`, data)
  }
}
