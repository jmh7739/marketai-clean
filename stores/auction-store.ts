import { create } from "zustand"
import { SupabaseService, type Auction } from "@/lib/supabase"

interface AuctionStore {
  auctions: Auction[]
  currentAuction: Auction | null
  loading: boolean
  error: string | null

  // Actions
  fetchAuctions: () => Promise<void>
  fetchAuctionById: (id: string) => Promise<void>
  createAuction: (auctionData: any) => Promise<{ success: boolean; id?: string; error?: string }>
  placeBid: (auctionId: string, amount: number, userId: string) => Promise<{ success: boolean; error?: string }>
  subscribeToAuctions: () => () => void
  subscribeToAuctionBids: (auctionId: string) => () => void
  clearError: () => void
}

export const useAuctionStore = create<AuctionStore>((set, get) => ({
  auctions: [],
  currentAuction: null,
  loading: false,
  error: null,

  fetchAuctions: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await SupabaseService.getActiveAuctions()
      if (error) throw error
      set({ auctions: data || [], loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  fetchAuctionById: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await SupabaseService.getAuctionById(id)
      if (error) throw error
      set({ currentAuction: data, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  createAuction: async (auctionData) => {
    try {
      const { data, error } = await SupabaseService.createAuction(auctionData)
      if (error) throw error

      // 새 경매를 목록에 추가
      set((state) => ({
        auctions: [data, ...state.auctions],
      }))

      return { success: true, id: data.id }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  },

  placeBid: async (auctionId: string, amount: number, userId: string) => {
    try {
      const { data, error } = await SupabaseService.createBid({
        auction_id: auctionId,
        bidder_id: userId,
        amount,
        is_auto_bid: false,
        is_winning: true,
      })

      if (error) throw error

      // 현재 경매 정보 업데이트
      set((state) => ({
        currentAuction: state.currentAuction
          ? {
              ...state.currentAuction,
              current_price: amount,
              total_bids: state.currentAuction.total_bids + 1,
            }
          : null,
        auctions: state.auctions.map((auction) =>
          auction.id === auctionId
            ? { ...auction, current_price: amount, total_bids: auction.total_bids + 1 }
            : auction,
        ),
      }))

      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  },

  subscribeToAuctions: () => {
    const subscription = SupabaseService.subscribeToAuctions((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload

      set((state) => {
        let updatedAuctions = [...state.auctions]

        switch (eventType) {
          case "INSERT":
            updatedAuctions = [newRecord, ...updatedAuctions]
            break
          case "UPDATE":
            updatedAuctions = updatedAuctions.map((auction) => (auction.id === newRecord.id ? newRecord : auction))
            break
          case "DELETE":
            updatedAuctions = updatedAuctions.filter((auction) => auction.id !== oldRecord.id)
            break
        }

        return { auctions: updatedAuctions }
      })
    })

    return () => subscription.unsubscribe()
  },

  subscribeToAuctionBids: (auctionId: string) => {
    const subscription = SupabaseService.subscribeToAuctionBids(auctionId, (payload) => {
      const { new: newBid } = payload

      set((state) => ({
        currentAuction:
          state.currentAuction && state.currentAuction.id === auctionId
            ? {
                ...state.currentAuction,
                current_price: newBid.amount,
                total_bids: state.currentAuction.total_bids + 1,
              }
            : state.currentAuction,
      }))
    })

    return () => subscription.unsubscribe()
  },

  clearError: () => set({ error: null }),
}))
