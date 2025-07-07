/* -------------------------------------------------------------------------- */
/*                               Firebase Client                              */
/* -------------------------------------------------------------------------- */
"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */
export interface UserProfile {
  id: string
  name: string
  email?: string
  phone: string
  avatar?: string
  joinDate: string
  verified: boolean
  rating: number
  totalSales: number
  totalPurchases: number
  preferences?: string[]
  createdAt: string
  updatedAt: string
}

export type User = UserProfile

export interface Auction {
  id: string
  title: string
  description: string
  currentBid: number
  startingBid: number
  buyNowPrice?: number
  endDate: string
  sellerId: string
  sellerName: string
  category: string
  condition: string
  images: string[]
  bidCount: number
  watchers: number
  location: string
  shippingCost: number
  status: "active" | "ended" | "sold"
  isLive: boolean
  views: number
  createdAt: string
  updatedAt: string
}

/* -------------------------------------------------------------------------- */
/*                              Firebase Config                               */
/* -------------------------------------------------------------------------- */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: FirebaseApp | null = null
let db: any = null
let auth: any = null
let isFirebaseAvailable = false

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */
const isBrowser = () => typeof window !== "undefined"

/**
 * Firebase 초기화 (실패해도 앱이 동작하도록 안전하게 처리)
 */
async function initFirebase() {
  if (!isBrowser()) return false
  if (app && db && auth) return isFirebaseAvailable

  try {
    // 환경변수 확인
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.warn("Firebase configuration is incomplete")
      return false
    }

    // Firebase 앱 초기화
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

    // 동적 import로 Firebase 서비스 로드
    const [{ getFirestore }, { getAuth, RecaptchaVerifier }] = await Promise.all([
      import("firebase/firestore"),
      import("firebase/auth"),
    ])

    db = getFirestore(app)
    auth = getAuth(app)

    // RecaptchaVerifier를 전역에서 사용할 수 있도록 설정
    ;(globalThis as any).RecaptchaVerifier = RecaptchaVerifier

    isFirebaseAvailable = true
    console.log("✅ Firebase initialized successfully")
    return true
  } catch (error) {
    console.warn("⚠️ Firebase initialization failed:", error)
    isFirebaseAvailable = false
    return false
  }
}

/* -------------------------------------------------------------------------- */
/*                            reCAPTCHA + SMS Auth                            */
/* -------------------------------------------------------------------------- */
export async function setupRecaptcha(containerId: string) {
  if (!isBrowser()) throw new Error("This function can only run in the browser")

  const initialized = await initFirebase()
  if (!initialized) throw new Error("Firebase not available")

  const RecaptchaVerifier = (globalThis as any).RecaptchaVerifier
  if (!RecaptchaVerifier) throw new Error("RecaptchaVerifier not available")

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: "normal",
    callback: () => console.log("reCAPTCHA solved"),
    "expired-callback": () => console.log("reCAPTCHA expired"),
  })

  await verifier.render()
  return verifier
}

export async function sendPhoneVerification(phone: string, verifier: any) {
  if (!isBrowser()) throw new Error("This function can only run in the browser")

  const initialized = await initFirebase()
  if (!initialized) throw new Error("Firebase not available")

  const { signInWithPhoneNumber } = await import("firebase/auth")
  return signInWithPhoneNumber(auth, phone, verifier)
}

export const sendSMSVerification = sendPhoneVerification

export async function verifyPhoneCode(confirm: any, code: string) {
  if (!isBrowser()) throw new Error("This function can only run in the browser")
  const result = await confirm.confirm(code)
  return result.user
}

/* -------------------------------------------------------------------------- */
/*                               Auth Helpers                                 */
/* -------------------------------------------------------------------------- */
export async function signInWithEmail(email: string, password: string) {
  if (!isBrowser()) throw new Error("This function can only run in the browser")

  const initialized = await initFirebase()
  if (!initialized) throw new Error("Firebase not available")

  const { signInWithEmailAndPassword } = await import("firebase/auth")
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signUpWithEmail(email: string, password: string) {
  if (!isBrowser()) throw new Error("This function can only run in the browser")

  const initialized = await initFirebase()
  if (!initialized) throw new Error("Firebase not available")

  const { createUserWithEmailAndPassword } = await import("firebase/auth")
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function signOut() {
  if (!isBrowser()) throw new Error("This function can only run in the browser")

  const initialized = await initFirebase()
  if (!initialized) throw new Error("Firebase not available")

  const { signOut: firebaseSignOut } = await import("firebase/auth")
  await firebaseSignOut(auth)
}

export function onAuthStateChange(callback: (user: UserProfile | null) => void) {
  if (!isBrowser()) return () => {}

  let unsubscribe: () => void = () => {}
  ;(async () => {
    const initialized = await initFirebase()
    if (!initialized) {
      callback(null)
      return
    }

    const { onAuthStateChanged } = await import("firebase/auth")
    unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) return callback(null)
      const profile = await getUserProfile(fbUser.uid)
      callback(profile)
    })
  })()

  return () => unsubscribe()
}

/* -------------------------------------------------------------------------- */
/*                           Firestore CRUD Helpers                           */
/* -------------------------------------------------------------------------- */
export async function createUserProfile(data: Partial<UserProfile>) {
  if (!isBrowser()) throw new Error("This function can only run in the browser")

  const initialized = await initFirebase()
  if (!initialized) throw new Error("Firebase not available")

  const { setDoc, doc } = await import("firebase/firestore")

  const profile: UserProfile = {
    id: data.id!,
    name: data.name ?? "",
    email: data.email,
    phone: data.phone ?? "",
    avatar: data.avatar,
    joinDate: data.joinDate ?? new Date().toISOString(),
    verified: data.verified ?? false,
    rating: data.rating ?? 5,
    totalSales: data.totalSales ?? 0,
    totalPurchases: data.totalPurchases ?? 0,
    preferences: data.preferences ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await setDoc(doc(db, "users", profile.id), profile)
  return profile
}

export async function getUserProfile(userId: string) {
  if (!isBrowser()) throw new Error("This function can only run in the browser")

  const initialized = await initFirebase()
  if (!initialized) return null

  const { getDoc, doc } = await import("firebase/firestore")
  const snap = await getDoc(doc(db, "users", userId))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (!isBrowser()) return null

  try {
    const initialized = await initFirebase()
    if (!initialized || !auth?.currentUser) return null

    return getUserProfile(auth.currentUser.uid)
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

/* -------------------------------------------------------------------------- */
/*                                Statistics                                  */
/* -------------------------------------------------------------------------- */
export async function getRealStats() {
  if (!isBrowser()) {
    return { totalUsers: 0, activeAuctions: 0, totalBids: 0 }
  }

  try {
    const initialized = await initFirebase()
    if (!initialized) {
      console.warn("Firebase not available, returning zero stats")
      return { totalUsers: 0, activeAuctions: 0, totalBids: 0 }
    }

    const { getDocs, query, collection, where } = await import("firebase/firestore")

    const [usersSnap, activeAuctionsSnap, bidsSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(
        query(
          collection(db, "auctions"),
          where("status", "==", "active"),
          where("endDate", ">", new Date().toISOString()),
        ),
      ),
      getDocs(collection(db, "bids")),
    ])

    return {
      totalUsers: usersSnap.size,
      activeAuctions: activeAuctionsSnap.size,
      totalBids: bidsSnap.size,
    }
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return { totalUsers: 0, activeAuctions: 0, totalBids: 0 }
  }
}

/* -------------------------------------------------------------------------- */
/*                                Dashboard                                   */
/* -------------------------------------------------------------------------- */
export async function getPopularAuctions(limitCount = 4): Promise<Auction[]> {
  if (!isBrowser()) return []

  try {
    const initialized = await initFirebase()
    if (!initialized) {
      console.warn("Firebase not available, returning empty popular auctions")
      return []
    }

    const { getDocs, query, collection, where, orderBy, limit } = await import("firebase/firestore")

    const now = new Date().toISOString()
    const q = query(
      collection(db, "auctions"),
      where("status", "==", "active"),
      where("endDate", ">", now),
      orderBy("views", "desc"),
      limit(limitCount),
    )

    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Auction) }))
  } catch (error) {
    console.error("Failed to fetch popular auctions:", error)
    return []
  }
}

export async function getRecommendedAuctions(user: UserProfile | null, limitCount = 4): Promise<Auction[]> {
  if (!isBrowser()) return []

  try {
    const initialized = await initFirebase()
    if (!initialized) {
      console.warn("Firebase not available, returning empty recommended auctions")
      return []
    }

    const { getDocs, query, collection, where, orderBy, limit } = await import("firebase/firestore")

    const now = new Date().toISOString()
    const base = collection(db, "auctions")

    let q
    if (user?.preferences?.length) {
      q = query(
        base,
        where("status", "==", "active"),
        where("endDate", ">", now),
        where("category", "in", user.preferences),
        limit(limitCount),
      )
    } else {
      q = query(
        base,
        where("status", "==", "active"),
        where("endDate", ">", now),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      )
    }

    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Auction) }))
  } catch (error) {
    console.error("Failed to fetch recommended auctions:", error)
    return []
  }
}

/* -------------------------------------------------------------------------- */
/*                              Misc Utilities                                */
/* -------------------------------------------------------------------------- */
export function validatePhoneNumber(phone: string) {
  return /^010-\d{4}-\d{4}$/.test(phone)
}

export function formatPhoneNumber(phone: string) {
  const cleaned = phone.replace(/\D/g, "")
  return cleaned.startsWith("010") ? `+82${cleaned.slice(1)}` : phone
}

export function checkFirebaseConnection() {
  return {
    isConfigured: Boolean(firebaseConfig.apiKey && firebaseConfig.projectId),
    isAvailable: isFirebaseAvailable,
    config: {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
    },
  }
}

export { auth }
