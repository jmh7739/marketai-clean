// lib/firebase.ts ─ Firebase App & 안전한 Auth 싱글턴
import { initializeApp, getApps, type FirebaseApp } from "firebase/app"

/* ───────────── Firebase Config ───────────── */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

/* ───────────── 앱 싱글턴 ───────────── */
export const firebaseApp: FirebaseApp = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig)

/* ───────────── Auth 싱글턴 (클라이언트 전용) ───────────── */
let _auth: import("firebase/auth").Auth | null = null
let _loading = false // 동시 호출 대비

export async function getClientAuth() {
  if (_auth) return _auth
  if (_loading)
    // 다른 호출이 생성 완료되길 기다림
    return new Promise<import("firebase/auth").Auth>((res) => {
      const iv = setInterval(() => {
        if (_auth) {
          clearInterval(iv)
          res(_auth!)
        }
      }, 10)
    })

  if (typeof window === "undefined") throw new Error("getClientAuth() must run in the browser")

  _loading = true
  const { getAuth } = await import("firebase/auth")
  _auth = getAuth(firebaseApp)
  _loading = false
  return _auth
}
