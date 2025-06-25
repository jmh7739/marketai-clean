"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"

export default function FirebaseDebug() {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    // Firebase 설정 확인
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    setConfig(firebaseConfig)
    console.log("Firebase Config:", firebaseConfig)
    console.log("Auth instance:", auth)
  }, [])

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Firebase Debug</h3>
      <div className="space-y-1">
        <div>API Key: {config?.apiKey ? "✅" : "❌"}</div>
        <div>Auth Domain: {config?.authDomain ? "✅" : "❌"}</div>
        <div>Project ID: {config?.projectId ? "✅" : "❌"}</div>
        <div>App ID: {config?.appId ? "✅" : "❌"}</div>
      </div>
    </div>
  )
}
