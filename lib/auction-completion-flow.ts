import { supabase } from "./supabase-client"
import { sendNotification } from "./notification-service"
import { createEscrowTransaction } from "./escrow-service"

export interface AuctionCompletionResult {
  auctionId: string
  winnerId: string
  winnerName: string
  finalPrice: number
  sellerId: string
  sellerName: string
  productTitle: string
  status: "completed" | "payment_pending" | "failed"
}

export class AuctionCompletionService {
  // 경매 종료 처리
  static async completeAuction(auctionId: string): Promise<AuctionCompletionResult> {
    try {
      // 1. 경매 상태를 '종료'로 변경
      const { data: auction, error: auctionError } = await supabase
        .from("auctions")
        .update({
          status: "ended",
          ended_at: new Date().toISOString(),
        })
        .eq("id", auctionId)
        .select(`
          *,
          seller:profiles!seller_id(*),
          category:categories(*)
        `)
        .single()

      if (auctionError) throw auctionError

      // 2. 최고 입찰자 확인
      const { data: winningBid, error: bidError } = await supabase
        .from("bids")
        .select(`
          *,
          bidder:profiles!bidder_id(*)
        `)
        .eq("auction_id", auctionId)
        .order("amount", { ascending: false })
        .limit(1)
        .single()

      if (bidError || !winningBid) {
        // 입찰자가 없는 경우
        await this.handleNoWinnerAuction(auctionId)
        throw new Error("낙찰자가 없습니다")
      }

      // 3. 낙찰 기록 생성
      const { data: winRecord, error: winError } = await supabase
        .from("auction_winners")
        .insert({
          auction_id: auctionId,
          winner_id: winningBid.bidder_id,
          winning_bid: winningBid.amount,
          seller_id: auction.seller_id,
          status: "payment_pending",
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (winError) throw winError

      // 4. 에스크로 거래 생성
      await createEscrowTransaction({
        auctionId,
        buyerId: winningBid.bidder_id,
        sellerId: auction.seller_id,
        amount: winningBid.amount,
        productTitle: auction.title,
      })

      // 5. 낙찰자에게 알림 발송
      await sendNotification({
        userId: winningBid.bidder_id,
        type: "auction_won",
        title: "축하합니다! 경매에서 낙찰되었습니다",
        message: `"${auction.title}" 상품을 ${winningBid.amount.toLocaleString()}원에 낙찰받으셨습니다.`,
        data: {
          auctionId,
          amount: winningBid.amount,
          paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
      })

      // 6. 판매자에게 알림 발송
      await sendNotification({
        userId: auction.seller_id,
        type: "auction_sold",
        title: "상품이 낙찰되었습니다",
        message: `"${auction.title}" 상품이 ${winningBid.amount.toLocaleString()}원에 낙찰되었습니다.`,
        data: {
          auctionId,
          winnerId: winningBid.bidder_id,
          amount: winningBid.amount,
        },
      })

      // 7. 낙찰되지 않은 입찰자들에게 알림
      await this.notifyLosingBidders(auctionId, winningBid.bidder_id, auction.title)

      return {
        auctionId,
        winnerId: winningBid.bidder_id,
        winnerName: winningBid.bidder.name,
        finalPrice: winningBid.amount,
        sellerId: auction.seller_id,
        sellerName: auction.seller.name,
        productTitle: auction.title,
        status: "payment_pending",
      }
    } catch (error) {
      console.error("경매 완료 처리 오류:", error)
      throw error
    }
  }

  // 결제 완료 처리
  static async handlePaymentComplete(auctionId: string, paymentId: string) {
    try {
      // 1. 낙찰 기록 업데이트
      await supabase
        .from("auction_winners")
        .update({
          status: "paid",
          payment_id: paymentId,
          paid_at: new Date().toISOString(),
        })
        .eq("auction_id", auctionId)

      // 2. 거래 기록 생성
      const { data: winner } = await supabase
        .from("auction_winners")
        .select(`
          *,
          auction:auctions(*),
          winner:profiles!winner_id(*),
          seller:profiles!seller_id(*)
        `)
        .eq("auction_id", auctionId)
        .single()

      if (winner) {
        await supabase.from("transactions").insert({
          auction_id: auctionId,
          buyer_id: winner.winner_id,
          seller_id: winner.seller_id,
          amount: winner.winning_bid,
          payment_id: paymentId,
          status: "payment_completed",
          created_at: new Date().toISOString(),
        })

        // 3. 판매자에게 배송 요청 알림
        await sendNotification({
          userId: winner.seller_id,
          type: "shipping_required",
          title: "배송을 시작해주세요",
          message: `구매자가 결제를 완료했습니다. 상품을 배송해주세요.`,
          data: {
            auctionId,
            buyerName: winner.winner.name,
            amount: winner.winning_bid,
          },
        })

        // 4. 구매자에게 결제 완료 알림
        await sendNotification({
          userId: winner.winner_id,
          type: "payment_completed",
          title: "결제가 완료되었습니다",
          message: `판매자가 곧 상품을 배송할 예정입니다.`,
          data: {
            auctionId,
            trackingAvailable: true,
          },
        })
      }
    } catch (error) {
      console.error("결제 완료 처리 오류:", error)
      throw error
    }
  }

  // 배송 시작 처리
  static async handleShippingStart(auctionId: string, trackingNumber: string, shippingCompany: string) {
    try {
      // 1. 거래 상태 업데이트
      await supabase
        .from("transactions")
        .update({
          status: "shipped",
          tracking_number: trackingNumber,
          shipping_company: shippingCompany,
          shipped_at: new Date().toISOString(),
        })
        .eq("auction_id", auctionId)

      // 2. 구매자에게 배송 시작 알림
      const { data: transaction } = await supabase
        .from("transactions")
        .select(`
          *,
          auction:auctions(*),
          buyer:profiles!buyer_id(*)
        `)
        .eq("auction_id", auctionId)
        .single()

      if (transaction) {
        await sendNotification({
          userId: transaction.buyer_id,
          type: "shipping_started",
          title: "상품이 배송되었습니다",
          message: `운송장번호: ${trackingNumber} (${shippingCompany})`,
          data: {
            auctionId,
            trackingNumber,
            shippingCompany,
            estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        })
      }
    } catch (error) {
      console.error("배송 시작 처리 오류:", error)
      throw error
    }
  }

  // 구매 확정 처리
  static async handlePurchaseConfirmation(auctionId: string, buyerId: string, rating?: number, review?: string) {
    try {
      // 1. 거래 완료 처리
      await supabase
        .from("transactions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          buyer_rating: rating,
          buyer_review: review,
        })
        .eq("auction_id", auctionId)
        .eq("buyer_id", buyerId)

      // 2. 에스크로 자금 해제
      await supabase
        .from("escrow_transactions")
        .update({
          status: "released",
          released_at: new Date().toISOString(),
        })
        .eq("auction_id", auctionId)

      // 3. 판매자 평점 업데이트
      if (rating) {
        const { data: transaction } = await supabase
          .from("transactions")
          .select("seller_id")
          .eq("auction_id", auctionId)
          .single()

        if (transaction) {
          await this.updateSellerRating(transaction.seller_id, rating)
        }
      }

      // 4. 판매자에게 거래 완료 알림
      const { data: completedTransaction } = await supabase
        .from("transactions")
        .select(`
          *,
          auction:auctions(*),
          seller:profiles!seller_id(*)
        `)
        .eq("auction_id", auctionId)
        .single()

      if (completedTransaction) {
        await sendNotification({
          userId: completedTransaction.seller_id,
          type: "transaction_completed",
          title: "거래가 완료되었습니다",
          message: `구매자가 상품을 확인했습니다. 판매 대금이 지급됩니다.`,
          data: {
            auctionId,
            amount: completedTransaction.amount,
            rating: rating,
          },
        })
      }
    } catch (error) {
      console.error("구매 확정 처리 오류:", error)
      throw error
    }
  }

  // 입찰자가 없는 경매 처리
  private static async handleNoWinnerAuction(auctionId: string) {
    await supabase.from("auctions").update({ status: "no_winner" }).eq("id", auctionId)

    // 판매자에게 알림
    const { data: auction } = await supabase.from("auctions").select("seller_id, title").eq("id", auctionId).single()

    if (auction) {
      await sendNotification({
        userId: auction.seller_id,
        type: "auction_no_winner",
        title: "경매가 유찰되었습니다",
        message: `"${auction.title}" 상품에 입찰자가 없어 경매가 종료되었습니다.`,
        data: { auctionId },
      })
    }
  }

  // 낙찰되지 않은 입찰자들에게 알림
  private static async notifyLosingBidders(auctionId: string, winnerId: string, productTitle: string) {
    const { data: losingBidders } = await supabase
      .from("bids")
      .select("bidder_id")
      .eq("auction_id", auctionId)
      .neq("bidder_id", winnerId)

    if (losingBidders) {
      const uniqueBidders = [...new Set(losingBidders.map((b) => b.bidder_id))]

      for (const bidderId of uniqueBidders) {
        await sendNotification({
          userId: bidderId,
          type: "auction_lost",
          title: "아쉽게도 낙찰되지 않았습니다",
          message: `"${productTitle}" 경매에서 다른 분이 낙찰받았습니다.`,
          data: { auctionId },
        })
      }
    }
  }

  // 판매자 평점 업데이트
  private static async updateSellerRating(sellerId: string, newRating: number) {
    const { data: seller } = await supabase.from("profiles").select("rating, total_sales").eq("id", sellerId).single()

    if (seller) {
      const totalRating = seller.rating * seller.total_sales + newRating
      const newTotalSales = seller.total_sales + 1
      const updatedRating = totalRating / newTotalSales

      await supabase
        .from("profiles")
        .update({
          rating: updatedRating,
          total_sales: newTotalSales,
        })
        .eq("id", sellerId)
    }
  }
}
