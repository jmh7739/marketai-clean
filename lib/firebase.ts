import { initializeApp, getApps } from "firebase/app"
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB8-Mg4Ol91M4R6mMVuwt64jlST97GRjog",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "marketai-auction.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "marketai-auction",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "marketai-auction.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "413550271948",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:413550271948:web:b8df85cf7415d5dc995169",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Client-side auth getter
export const getClientAuth = (): Auth => {
  if (typeof window === "undefined") {
    throw new Error("getClientAuth can only be called on the client side")
  }
  return auth
}

// Connect to emulators in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  try {
    // Check if auth emulator is already connected
    const authConfig = (auth as any).config
    if (!authConfig?.emulator) {
      connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
    }
  } catch (error) {
    console.log("Auth emulator already connected or not available")
  }

  try {
    // Check if Firestore emulator is already connected
    const firestoreSettings = (db as any)._delegate?._databaseId
    if (!firestoreSettings?.projectId?.includes("demo-")) {
      connectFirestoreEmulator(db, "localhost", 8080)
    }
  } catch (error) {
    console.log("Firestore emulator already connected or not available")
  }
}

export default app
