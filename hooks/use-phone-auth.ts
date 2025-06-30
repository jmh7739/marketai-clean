"use client"

import { useState } from "react"
import { auth } from "@/lib/firebase"
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User as FirebaseUser,
} from "firebase/auth"

interface PhoneAuthState {
  loading: boolean
  error: string | null
  confirmationResult: ConfirmationResult | null
}

export function usePhoneAuth() {
  const [state, setState] = useState<PhoneAuthState>({
    loading: false,
    error: null,
    confirmationResult: null,
  })

  const setupRecaptcha = () => {
    if (typeof window !== "undefined") {
      const recaptchaContainer = document.getElementById("recaptcha-container")
      if (recaptchaContainer && !(window as any).recaptchaVerifier) {
        ;(window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA solved")
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired")
          },
        })
      }
    }
  }

  const sendVerificationCode = async (phoneNumber: string): Promise<ConfirmationResult> => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      setupRecaptcha()
      const appVerifier = (window as any).recaptchaVerifier
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)

      setState((prev) => ({
        ...prev,
        loading: false,
        confirmationResult,
      }))

      return confirmationResult
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "전화번호 인증 요청에 실패했습니다",
      }))
      throw error
    }
  }

  const verifyCode = async (code: string): Promise<FirebaseUser> => {
    if (!state.confirmationResult) {
      throw new Error("인증 요청을 먼저 해주세요")
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const result = await state.confirmationResult.confirm(code)
      setState((prev) => ({ ...prev, loading: false }))
      return result.user
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "인증번호가 올바르지 않습니다",
      }))
      throw error
    }
  }

  return {
    sendVerificationCode,
    verifyCode,
    loading: state.loading,
    error: state.error,
  }
}
