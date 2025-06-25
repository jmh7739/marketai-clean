"use client"

import { useState } from "react"
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User as FirebaseUser,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

export function useFirebaseAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

  // reCAPTCHA 설정
  const setupRecaptcha = (containerId: string) => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved")
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired")
          setError("reCAPTCHA가 만료되었습니다. 다시 시도해주세요.")
        },
      })
      return recaptchaVerifier
    } catch (error) {
      console.error("reCAPTCHA setup error:", error)
      setError("reCAPTCHA 설정 중 오류가 발생했습니다.")
      return null
    }
  }

  // 전화번호로 인증번호 발송
  const sendVerificationCode = async (phoneNumber: string) => {
    setLoading(true)
    setError(null)

    try {
      // 한국 전화번호 형식 변환 (010-1234-5678 → +821012345678)
      const formattedPhone = phoneNumber.replace(/^010/, "+8210").replace(/-/g, "")

      const recaptchaVerifier = setupRecaptcha("recaptcha-container")
      if (!recaptchaVerifier) {
        throw new Error("reCAPTCHA 설정 실패")
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier)
      setConfirmationResult(confirmation)

      return { success: true, message: "인증번호가 발송되었습니다." }
    } catch (error: any) {
      console.error("SMS send error:", error)

      let errorMessage = "인증번호 발송에 실패했습니다."

      if (error.code === "auth/invalid-phone-number") {
        errorMessage = "올바르지 않은 전화번호입니다."
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요."
      } else if (error.code === "auth/quota-exceeded") {
        errorMessage = "일일 SMS 발송 한도를 초과했습니다."
      }

      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 인증번호 확인
  const verifyCode = async (code: string): Promise<{ success: boolean; user?: FirebaseUser; message: string }> => {
    if (!confirmationResult) {
      return { success: false, message: "먼저 인증번호를 요청해주세요." }
    }

    setLoading(true)
    setError(null)

    try {
      const result = await confirmationResult.confirm(code)
      return {
        success: true,
        user: result.user,
        message: "전화번호 인증이 완료되었습니다.",
      }
    } catch (error: any) {
      console.error("Code verification error:", error)

      let errorMessage = "인증번호가 올바르지 않습니다."

      if (error.code === "auth/invalid-verification-code") {
        errorMessage = "인증번호가 올바르지 않습니다."
      } else if (error.code === "auth/code-expired") {
        errorMessage = "인증번호가 만료되었습니다. 다시 요청해주세요."
      }

      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    sendVerificationCode,
    verifyCode,
    confirmationResult: !!confirmationResult,
  }
}
