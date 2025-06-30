import { create } from "zustand"

interface Auction {
  id: string
  title: string
  description: string
  currentBid: number
  minBid: number
  endTime: Date
  imageUrl: string
  sellerId: string
  sellerName: string
  category: string
  condition: string
  location: string
  bidCount: number
  watchers: number
  status: "active" | "ended" | "cancelled"
}

interface AuctionStore {
  auctions: Auction[]
  loading: boolean
  error: string | null
  fetchAuctions: () => void
  subscribeToAuctions: () => () => void
  placeBid: (auctionId: string, amount: number) => Promise<boolean>
  addToWatchlist: (auctionId: string) => void
}

export const useAuctionStore = create<AuctionStore>((set, get) => ({
  auctions: [],
  loading: false,
  error: null,

  fetchAuctions: () => {
    set({ loading: true, error: null })

    // 데모 데이터
    const demoAuctions: Auction[] = [
      {
        id: "auction_1",
        title: "아이폰 14 Pro 256GB",
        description: "거의 새 제품, 케이스와 함께 판매",
        currentBid: 850000,
        minBid: 800000,
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24시간 후
        imageUrl: "/placeholder.svg?height=200&width=200",
        sellerId: "seller_1",
        sellerName: "김판매",
        category: "전자제품",
        condition: "거의새것",
        location: "서울시 강남구",
        bidCount: 12,
        watchers: 45,
        status: "active",
      },
      {
        id: "auction_2",
        title: "맥북 프로 M2 13인치",
        description: "2023년 구매, 사용감 거의 없음",
        currentBid: 1200000,
        minBid: 1100000,
        endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48시간 후
        imageUrl: "/placeholder.svg?height=200&width=200",
        sellerId: "seller_2",
        sellerName: "이판매",
        category: "전자제품",
        condition: "매우좋음",
        location: "서울시 서초구",
        bidCount: 8,
        watchers: 32,
        status: "active",
      },
    ]

    setTimeout(() => {
      set({ auctions: demoAuctions, loading: false })
    }, 1000)
  },

  subscribeToAuctions: () => {
    // 실시간 업데이트 시뮬레이션
    const interval = setInterval(() => {
      const { auctions } = get()
      if (auctions.length > 0) {
        const updatedAuctions = auctions.map((auction) => ({
          ...auction,
          currentBid: auction.currentBid + Math.floor(Math.random() * 10000),
          bidCount: auction.bidCount + Math.floor(Math.random() * 2),
        }))
        set({ auctions: updatedAuctions })
      }
    }, 30000) // 30초마다 업데이트

    return () => clearInterval(interval)
  },

  placeBid: async (auctionId: string, amount: number): Promise<boolean> => {
    try {
      const { auctions } = get()
      const auction = auctions.find((a) => a.id === auctionId)

      if (!auction) return false
      if (amount <= auction.currentBid) return false

      const updatedAuctions = auctions.map((a) =>
        a.id === auctionId ? { ...a, currentBid: amount, bidCount: a.bidCount + 1 } : a,
      )

      set({ auctions: updatedAuctions })
      return true
    } catch (error) {
      console.error("Error placing bid:", error)
      return false
    }
  },

  addToWatchlist: (auctionId: string) => {
    const { auctions } = get()
    const updatedAuctions = auctions.map((a) => (a.id === auctionId ? { ...a, watchers: a.watchers + 1 } : a))
    set({ auctions: updatedAuctions })
  },
}))
