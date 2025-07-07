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
  getDoc,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "./firebase"
import type { User, AuctionProduct, Bid } from "@/types"

// 사용자 관리
export const createUser = async (userData: Omit<User, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("사용자 생성 실패:", error)
    return { success: false, error }
  }
}

export const getUser = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { success: true, user: { id: docSnap.id, ...docSnap.data() } as User }
    } else {
      return { success: false, error: "사용자를 찾을 수 없습니다" }
    }
  } catch (error) {
    console.error("사용자 조회 실패:", error)
    return { success: false, error }
  }
}

export const updateUser = async (userId: string, userData: Partial<User>) => {
  try {
    const docRef = doc(db, "users", userId)
    await updateDoc(docRef, {
      ...userData,
      updatedAt: Timestamp.now(),
    })
    return { success: true }
  } catch (error) {
    console.error("사용자 업데이트 실패:", error)
    return { success: false, error }
  }
}

// 상품 관리
export const createProduct = async (productData: Omit<AuctionProduct, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("상품 생성 실패:", error)
    return { success: false, error }
  }
}

export const getProducts = async (filters?: { category?: string; status?: string }) => {
  try {
    let q = query(collection(db, "products"), orderBy("createdAt", "desc"))

    if (filters?.category) {
      q = query(q, where("category", "==", filters.category))
    }
    if (filters?.status) {
      q = query(q, where("status", "==", filters.status))
    }

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

export const updateProduct = async (productId: string, productData: Partial<AuctionProduct>) => {
  try {
    const docRef = doc(db, "products", productId)
    await updateDoc(docRef, {
      ...productData,
      updatedAt: Timestamp.now(),
    })
    return { success: true }
  } catch (error) {
    console.error("상품 업데이트 실패:", error)
    return { success: false, error }
  }
}

// 입찰 관리
export const createBid = async (bidData: Omit<Bid, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "bids"), {
      ...bidData,
      timestamp: Timestamp.now(),
    })

    // 상품의 현재 입찰가 업데이트
    const productRef = doc(db, "products", bidData.auctionId)
    await updateDoc(productRef, {
      currentBid: bidData.amount,
      totalBids: increment(1),
      updatedAt: Timestamp.now(),
    })

    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("입찰 생성 실패:", error)
    return { success: false, error }
  }
}

// 이미지 업로드
export const uploadImage = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return { success: true, url: downloadURL }
  } catch (error) {
    console.error("이미지 업로드 실패:", error)
    return { success: false, error }
  }
}

export const deleteImage = async (path: string) => {
  try {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
    return { success: true }
  } catch (error) {
    console.error("이미지 삭제 실패:", error)
    return { success: false, error }
  }
}

// 실시간 구독
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
