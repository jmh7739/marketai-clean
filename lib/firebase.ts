import { initializeApp, getApps } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id",
}

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Auth
export const auth = getAuth(app)

// Initialize Firestore
export const db = getFirestore(app)

// Connect to emulators in development (only in browser)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  try {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
    console.log("Connected to Firebase Auth emulator")
  } catch (error) {
    console.log("Auth emulator connection failed:", error)
  }

  try {
    connectFirestoreEmulator(db, "localhost", 8080)
    console.log("Connected to Firestore emulator")
  } catch (error) {
    console.log("Firestore emulator connection failed:", error)
  }
}

export default app
