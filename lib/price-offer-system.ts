import { supabase } from "./supabase-client"

export interface PriceOffer {
  id: string
  auctionId: string
  buyerId: string
  sellerId: string
  offerAmount: number
  message?: string
  status: "pending" | "accepted" | "rejected" | "expired"
  expiresAt: string
  createdAt: string
}

export class PriceOfferSystem {
  // 가격 제안하기
  static async makeOffer(data: {
    auctionId: string
    buyerId: string
    offerAmount: number
    message?: string
  }) {
    try {
      // 경매 정보 확인
      const { data: auction } = await supabase
        .from("auctions")
        .select("seller_id, current_price, buy_it_now_price, status")
        .eq("id", data.auctionId)
        .single()

      if (!auction) {
        return { success: false, error: "경매를 찾을 수 없습니다" }
      }

      if (auction.status !== "active") {
        return { success: false, error: "진행 중인 경매가 아닙니다" }
      }

      if (auction.seller_id === data.buyerId) {
        return { success: false, error: "본인 상품에는 제안할 수 없습니다" }
      }

      // 기존 대기 중인 제안 확인
      const { data: existingOffer } = await supabase
        .from("price_offers")
        .select("id")
        .eq("auction_id", data.auctionId)
        .eq("buyer_id", data.buyerId)
        .eq("status", "pending")
        .single()

      if (existingOffer) {
        return { success: false, error: "이미 대기 중인 제안이 있습니다" }
      }

      // 가격 제안 생성
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000) // 48시간 후

      const { data: offer } = await supabase
        .from("price_offers")
        .insert({
          auction_id: data.auctionId,
          buyer_id: data.buyerId,
          seller_id: auction.seller_id,
          offer_amount: data.offerAmount,
          message: data.message,
          status: "pending",
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      // 판매자에게 알림
      await this.notifySeller(auction.seller_id, offer.id, data.offerAmount)

      return { success: true, offerId: offer.id, expiresAt }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 가격 제안 수락
  static async acceptOffer(offerId: string, sellerId: string) {
    try {
      const { data: offer } = await supabase
        .from("price_offers")
        .select("*, auction:auctions(*)")
        .eq("id", offerId)
        .eq("seller_id", sellerId)
        .eq("status", "pending")
        .single()

      if (!offer) {
        return { success: false, error: "제안을 찾을 수 없습니다" }
      }

      if (new Date() > new Date(offer.expires_at)) {
        return { success: false, error: "만료된 제안입니다" }
      }

      // 제안 수락 처리
      await supabase
        .from("price_offers")
        .update({
          status: "accepted",
          accepted_at: new Date().toISOString(),
        })
        .eq("id", offerId)

      // 경매 즉시 종료 및 낙찰 처리
      await supabase
        .from("auctions")
        .update({
          status: "completed",
          current_price: offer.offer_amount,
          winner_id: offer.buyer_id,
          ended_at: new Date().toISOString(),
          end_reason: "price_offer_accepted",
        })
        .eq("id", offer.auction_id)

      // 거래 생성
      await this.createTransaction(offer.auction_id, offer.buyer_id, offer.offer_amount)

      // 구매자에게 알림
      await this.notifyBuyer(offer.buyer_id, offer.auction_id, "accepted")

      return { success: true, transactionAmount: offer.offer_amount }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 가격 제안 거절
  static async rejectOffer(offerId: string, sellerId: string, reason?: string) {
    try {
      const { data: offer } = await supabase
        .from("price_offers")
        .update({
          status: "rejected",
          rejection_reason: reason,
          rejected_at: new Date().toISOString(),
        })
        .eq("id", offerId)
        .eq("seller_id", sellerId)
        .eq("status", "pending")
        .select()
        .single()

      if (!offer) {
        return { success: false, error: "제안을 찾을 수 없습니다" }
      }

      // 구매자에게 알림
      await this.notifyBuyer(offer.buyer_id, offer.auction_id, "rejected")

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 만료된 제안 정리
  static async cleanupExpiredOffers() {
    try {
      const { data } = await supabase
        .from("price_offers")
        .update({ status: "expired" })
        .lt("expires_at", new Date().toISOString())
        .eq("status", "pending")
        .select()

      return { success: true, expiredCount: data?.length || 0 }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 판매자 알림
  private static async notifySeller(sellerId: string, offerId: string, amount: number) {
    // 실제로는 알림 시스템 호출
    console.log(`판매자 ${sellerId}에게 ${amount}원 가격 제안 알림`)
  }

  // 구매자 알림
  private static async notifyBuyer(buyerId: string, auctionId: string, result: string) {
    // 실제로는 알림 시스템 호출
    console.log(`구매자 ${buyerId}에게 제안 ${result} 알림`)
  }

  // 거래 생성
  private static async createTransaction(auctionId: string, buyerId: string, amount: number) {
    await supabase.from("transactions").insert({
      auction_id: auctionId,
      buyer_id: buyerId,
      amount: amount,
      status: "pending_payment",
      created_at: new Date().toISOString(),
    })
  }
}
