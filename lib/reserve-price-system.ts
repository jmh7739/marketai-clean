import { supabase } from "./supabase-client"

export interface ReservePrice {
  auctionId: string
  reservePrice: number
  isReserveMet: boolean
  highestBid: number
}

export class ReservePriceSystem {
  // 최소 낙찰가 설정
  static async setReservePrice(auctionId: string, reservePrice: number) {
    try {
      const { data, error } = await supabase
        .from("auctions")
        .update({
          reserve_price: reservePrice,
          has_reserve: true,
        })
        .eq("id", auctionId)
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 최소 낙찰가 달성 여부 확인
  static async checkReserveMet(auctionId: string): Promise<boolean> {
    try {
      const { data: auction } = await supabase
        .from("auctions")
        .select("reserve_price, current_price")
        .eq("id", auctionId)
        .single()

      if (!auction || !auction.reserve_price) return true
      return auction.current_price >= auction.reserve_price
    } catch (error) {
      console.error("최소 낙찰가 확인 오류:", error)
      return false
    }
  }

  // 경매 종료 시 유찰 처리
  static async handleAuctionEnd(auctionId: string) {
    try {
      const isReserveMet = await this.checkReserveMet(auctionId)

      if (!isReserveMet) {
        // 유찰 처리
        await supabase
          .from("auctions")
          .update({
            status: "failed",
            ended_at: new Date().toISOString(),
            failure_reason: "reserve_not_met",
          })
          .eq("id", auctionId)

        return { success: true, result: "failed", reason: "reserve_not_met" }
      } else {
        // 정상 낙찰
        await supabase
          .from("auctions")
          .update({
            status: "completed",
            ended_at: new Date().toISOString(),
          })
          .eq("id", auctionId)

        return { success: true, result: "completed" }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 유찰된 경매 재등록
  static async relistFailedAuction(auctionId: string, newReservePrice?: number) {
    try {
      const { data: originalAuction } = await supabase
        .from("auctions")
        .select("*")
        .eq("id", auctionId)
        .eq("status", "failed")
        .single()

      if (!originalAuction) {
        return { success: false, error: "유찰된 경매를 찾을 수 없습니다" }
      }

      // 새 경매 생성
      const { data: newAuction } = await supabase
        .from("auctions")
        .insert({
          ...originalAuction,
          id: undefined,
          reserve_price: newReservePrice || originalAuction.reserve_price,
          current_price: originalAuction.starting_price,
          bid_count: 0,
          status: "active",
          created_at: new Date().toISOString(),
          ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 후
          relist_count: (originalAuction.relist_count || 0) + 1,
        })
        .select()
        .single()

      return { success: true, newAuctionId: newAuction.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
