import { supabase } from "./supabase-client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface AuctionUpdate {
  auctionId: string
  currentPrice: number
  totalBids: number
  highestBidder?: string
  timeRemaining: number
}

export interface BidUpdate {
  auctionId: string
  bidderId: string
  amount: number
  timestamp: string
  isAutoBid: boolean
}

export class RealtimeAuctionService {
  private static channels: Map<string, RealtimeChannel> = new Map()

  // 경매 실시간 구독
  static subscribeToAuction(
    auctionId: string,
    onAuctionUpdate: (update: AuctionUpdate) => void,
    onBidUpdate: (update: BidUpdate) => void,
  ): () => void {
    const channelName = `auction-${auctionId}`

    // 기존 채널이 있으면 제거
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe()
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "auctions",
          filter: `id=eq.${auctionId}`,
        },
        (payload) => {
          const auction = payload.new as any
          onAuctionUpdate({
            auctionId: auction.id,
            currentPrice: auction.current_price,
            totalBids: auction.total_bids,
            highestBidder: auction.highest_bidder,
            timeRemaining: this.calculateTimeRemaining(auction.end_time),
          })
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
          filter: `auction_id=eq.${auctionId}`,
        },
        (payload) => {
          const bid = payload.new as any
          onBidUpdate({
            auctionId: bid.auction_id,
            bidderId: bid.bidder_id,
            amount: bid.amount,
            timestamp: bid.created_at,
            isAutoBid: bid.is_auto_bid,
          })
        },
      )
      .subscribe()

    this.channels.set(channelName, channel)

    // 구독 해제 함수 반환
    return () => {
      channel.unsubscribe()
      this.channels.delete(channelName)
    }
  }

  // 입찰 처리
  static async placeBid(auctionId: string, bidderId: string, amount: number, maxBidAmount?: number): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc("place_bid", {
        p_auction_id: auctionId,
        p_bidder_id: bidderId,
        p_amount: amount,
        p_max_bid_amount: maxBidAmount,
      })

      if (error) {
        console.error("입찰 오류:", error)
        return false
      }

      return data.success
    } catch (error) {
      console.error("입찰 처리 오류:", error)
      return false
    }
  }

  private static calculateTimeRemaining(endTime: string): number {
    const end = new Date(endTime).getTime()
    const now = Date.now()
    return Math.max(0, end - now)
  }

  // 모든 구독 해제
  static unsubscribeAll(): void {
    this.channels.forEach((channel) => channel.unsubscribe())
    this.channels.clear()
  }
}
