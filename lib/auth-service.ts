import { initializeApp } from "firebase/app"
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User as FirebaseUser,
} from "firebase/auth"
import { SupabaseService, type User } from "@/lib/supabase"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export class AuthService {
  private static recaptchaVerifier: RecaptchaVerifier | null = null
  private static confirmationResult: ConfirmationResult | null = null

  static initRecaptcha(containerId: string) {
    if (typeof window === "undefined") return

    this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA solved")
      },
      "expired-callback": () => {
        console.log("reCAPTCHA expired")
      },
    })
  }

  static async sendVerificationCode(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error("reCAPTCHA not initialized")
      }

      // 한국 전화번호 형식으로 변환 (+82)
      const formattedPhone = phoneNumber.startsWith("010") ? `+82${phoneNumber.substring(1)}` : phoneNumber

      this.confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, this.recaptchaVerifier)
      return { success: true }
    } catch (error) {
      console.error("SMS send error:", error)
      return { success: false, error: (error as Error).message }
    }
  }

  static async verifyCode(code: string): Promise<{ success: boolean; user?: FirebaseUser; error?: string }> {
    try {
      if (!this.confirmationResult) {
        throw new Error("No verification in progress")
      }

      const result = await this.confirmationResult.confirm(code)
      return { success: true, user: result.user }
    } catch (error) {
      console.error("Code verification error:", error)
      return { success: false, error: "인증번호가 올바르지 않습니다." }
    }
  }

  static async registerUser(userData: {
    phone: string
    name: string
    nickname?: string
    email?: string
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data, error } = await SupabaseService.createUser({
        phone: userData.phone,
        name: userData.name,
        nickname: userData.nickname,
        email: userData.email,
        rating: 5.0,
        total_sales: 0,
        total_purchases: 0,
        is_verified: true, // 전화번호 인증 완료
        is_banned: false,
      })

      if (error) throw error
      return { success: true, user: data }
    } catch (error) {
      console.error("User registration error:", error)
      return { success: false, error: (error as Error).message }
    }
  }

  static async loginUser(phone: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data, error } = await SupabaseService.getUserByPhone(phone)
      if (error) throw error

      if (!data) {
        return { success: false, error: "등록되지 않은 전화번호입니다." }
      }

      return { success: true, user: data }
    } catch (error) {
      console.error("User login error:", error)
      return { success: false, error: (error as Error).message }
    }
  }

  static cleanup() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear()
      this.recaptchaVerifier = null
    }
    this.confirmationResult = null
  }
}
