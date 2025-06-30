import { initializeApp, getApps } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
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

// Connect to emulators in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  try {
    // Only connect if not already connected
    if (!auth.config.emulator) {
      connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
    }
    if (!(db as any)._delegate._databaseId.projectId.includes("localhost")) {
      connectFirestoreEmulator(db, "localhost", 8080)
    }
  } catch (error) {
    console.log("Emulators already connected or not available")
  }
}

export default app
