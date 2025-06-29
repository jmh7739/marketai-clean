import { supabase } from "./supabase-client"

export interface PaymentVerification {
  id: string
  auctionId: string
  buyerId: string
  sellerId: string
  expectedAmount: number
  depositName: string
  depositDate: string
  depositTime: string
  bankAccount: string
  status: "pending" | "verified" | "rejected"
  verifiedAt?: string
  rejectedReason?: string
}

export class PaymentVerificationService {
  // 입금 신고 접수
  static async reportDeposit(data: {
    auctionId: string
    buyerId: string
    depositName: string
    depositDate: string
    depositTime: string
    memo?: string
  }) {
    try {
      // 1. 경매 정보 조회
      const { data: auction, error: auctionError } = await supabase
        .from("auctions")
        .select(`
          *,
          winner:auction_winners!inner(*)
        `)
        .eq("id", data.auctionId)
        .single()

      if (auctionError || !auction) {
        throw new Error("경매 정보를 찾을 수 없습니다")
      }

      // 2. 입금 신고 기록 생성
      const { data: verification, error: verificationError } = await supabase
        .from("payment_verifications")
        .insert({
          auction_id: data.auctionId,
          buyer_id: data.buyerId,
          seller_id: auction.seller_id,
          expected_amount: auction.winner.winning_bid,
          deposit_name: data.depositName,
          deposit_date: data.depositDate,
          deposit_time: data.depositTime,
          bank_account: auction.seller_bank_account,
          status: "pending",
          memo: data.memo,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (verificationError) throw verificationError

      // 3. 판매자에게 입금 확인 요청 알림
      await this.notifySellerForVerification(auction.seller_id, {
        auctionTitle: auction.title,
        buyerName: data.depositName,
        amount: auction.winner.winning_bid,
        depositTime: `${data.depositDate} ${data.depositTime}`,
      })

      return { success: true, verificationId: verification.id }
    } catch (error) {
      console.error("입금 신고 처리 오류:", error)
      return { success: false, error: error.message }
    }
  }

  // 판매자 입금 확인
  static async confirmDeposit(verificationId: string, sellerId: string, confirmed: boolean, reason?: string) {
    try {
      const status = confirmed ? "verified" : "rejected"
      const updateData: any = {
        status,
        verified_at: new Date().toISOString(),
      }

      if (!confirmed && reason) {
        updateData.rejected_reason = reason
      }

      const { data: verification, error } = await supabase
        .from("payment_verifications")
        .update(updateData)
        .eq("id", verificationId)
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
        await this.processPaymentComplete(verification.auction_id)

        // 구매자에게 결제 확인 알림
        await this.notifyBuyerPaymentConfirmed(verification.buyer_id, {
          auctionTitle: verification.auction.title,
          amount: verification.expected_amount,
        })
      } else {
        // 구매자에게 입금 거부 알림
        await this.notifyBuyerPaymentRejected(verification.buyer_id, {
          auctionTitle: verification.auction.title,
          reason: reason || "입금 정보가 일치하지 않습니다",
        })
      }

      return { success: true }
    } catch (error) {
      console.error("입금 확인 처리 오류:", error)
      return { success: false, error: error.message }
    }
  }

  // 자동 입금 확인 (은행 API 연동 시)
  static async autoVerifyDeposit(
    bankAccount: string,
    expectedAmount: number,
    timeWindow: { start: string; end: string },
  ) {
    try {
      // 실제로는 은행 API를 통해 입금 내역 조회
      // const bankTransactions = await bankAPI.getTransactions({
      //   account: bankAccount,
      //   startDate: timeWindow.start,
      //   endDate: timeWindow.end,
      //   amount: expectedAmount
      // })

      // 모의 은행 거래 내역 (실제로는 은행 API 응답)
      const mockTransactions = [
        {
          amount: expectedAmount,
          depositorName: "홍길동",
          transactionTime: "2024-01-15 14:30:25",
          transactionId: "TXN123456789",
        },
      ]

      return {
        success: true,
        transactions: mockTransactions,
        autoVerified: mockTransactions.length > 0,
      }
    } catch (error) {
      console.error("자동 입금 확인 오류:", error)
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

    // 에스크로 상태 업데이트 (실제로는 에스크로 해제)
    await supabase
      .from("escrow_transactions")
      .update({
        status: "payment_confirmed",
        confirmed_at: new Date().toISOString(),
      })
      .eq("auction_id", auctionId)
  }

  // 알림 메서드들
  private static async notifySellerForVerification(sellerId: string, data: any) {
    // 실제로는 푸시 알림, 이메일, SMS 발송
    console.log(`판매자 ${sellerId}에게 입금 확인 요청:`, data)
  }

  private static async notifyBuyerPaymentConfirmed(buyerId: string, data: any) {
    console.log(`구매자 ${buyerId}에게 결제 확인 알림:`, data)
  }

  private static async notifyBuyerPaymentRejected(buyerId: string, data: any) {
    console.log(`구매자 ${buyerId}에게 입금 거부 알림:`, data)
  }
}
