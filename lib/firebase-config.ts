import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyB8-Mg4Ol9lM4R6mMVuwt64jlST97GRjog",
  authDomain: "marketai-auction.firebaseapp.com",
  projectId: "marketai-auction",
  storageBucket: "marketai-auction.firebasestorage.app",
  messagingSenderId: "413550271948",
  appId: "1:413550271948:web:b8df85cf7415d5dc995169",
  measurementId: "G-22JEGEC53V",
}

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig)

// 서비스 인스턴스
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Analytics는 브라우저에서만 초기화
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

export default app
