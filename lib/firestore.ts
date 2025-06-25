import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  increment,
} from "firebase/firestore"
import { db } from "./firebase"

export interface AuctionProduct {
  id?: string
  title: string
  description: string
  images: string[]
  category: string
  condition: string
  startingPrice: number
  buyNowPrice?: number
  currentBid: number
  endTime: Date
  sellerId: string
  sellerName: string
  location: string
  totalBids: number
  bidders: string[]
  status: "active" | "ended" | "sold"
  createdAt: Date
  updatedAt: Date
}

export interface Bid {
  id?: string
  auctionId: string
  bidderId: string
  bidderName: string
  amount: number
  timestamp: Date
}

// 상품 등록
export const addProduct = async (product: Omit<AuctionProduct, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("상품 등록 실패:", error)
    return { success: false, error }
  }
}

// 모든 활성 상품 가져오기
export const getActiveProducts = async () => {
  try {
    const q = query(collection(db, "products"), where("status", "==", "active"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    const products: AuctionProduct[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      products.push({
        id: doc.id,
        ...data,
        endTime: data.endTime.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as AuctionProduct)
    })

    return { success: true, products }
  } catch (error) {
    console.error("상품 조회 실패:", error)
    return { success: false, error, products: [] }
  }
}

// 실시간 상품 목록 구독
export const subscribeToProducts = (callback: (products: AuctionProduct[]) => void) => {
  const q = query(collection(db, "products"), where("status", "==", "active"), orderBy("createdAt", "desc"))

  return onSnapshot(q, (querySnapshot) => {
    const products: AuctionProduct[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      products.push({
        id: doc.id,
        ...data,
        endTime: data.endTime.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as AuctionProduct)
    })
    callback(products)
  })
}

// 입찰하기
export const placeBid = async (auctionId: string, bid: Omit<Bid, "id">) => {
  try {
    // 입찰 기록 추가
    await addDoc(collection(db, "bids"), {
      ...bid,
      timestamp: Timestamp.now(),
    })

    // 상품의 현재 입찰가 업데이트
    const productRef = doc(db, "products", auctionId)
    await updateDoc(productRef, {
      currentBid: bid.amount,
      totalBids: increment(1),
      updatedAt: Timestamp.now(),
    })

    return { success: true }
  } catch (error) {
    console.error("입찰 실패:", error)
    return { success: false, error }
  }
}
