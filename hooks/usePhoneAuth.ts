"use client"

import { useState, useCallback } from "react"
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
  recaptchaVerifier: RecaptchaVerifier | null
}

export function usePhoneAuth() {
  const [state, setState] = useState<PhoneAuthState>({
    loading: false,
    error: null,
    confirmationResult: null,
    recaptchaVerifier: null,
  })

  const setupRecaptcha = useCallback(() => {
    if (typeof window === "undefined") return null

    // Clean up existing verifier
    if ((window as any).recaptchaVerifier) {
      ;(window as any).recaptchaVerifier.clear()
    }

    const recaptchaContainer = document.getElementById("recaptcha-container")
    if (!recaptchaContainer) {
      console.error("reCAPTCHA container not found")
      return null
    }

    try {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        callback: (response: string) => {
          console.log("reCAPTCHA solved:", response)
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired")
          setState((prev) => ({ ...prev, error: "reCAPTCHA가 만료되었습니다. 다시 시도해주세요." }))
        },
        "error-callback": (error: any) => {
          console.error("reCAPTCHA error:", error)
          setState((prev) => ({ ...prev, error: "reCAPTCHA 오류가 발생했습니다." }))
        },
      })
      ;(window as any).recaptchaVerifier = verifier
      setState((prev) => ({ ...prev, recaptchaVerifier: verifier }))
      return verifier
    } catch (error) {
      console.error("Failed to setup reCAPTCHA:", error)
      setState((prev) => ({ ...prev, error: "reCAPTCHA 설정에 실패했습니다." }))
      return null
    }
  }, [])

  const sendVerificationCode = async (phoneNumber: string): Promise<ConfirmationResult> => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      // Format phone number
      let formattedPhone = phoneNumber.replace(/[^0-9+]/g, "")

      // Add country code if not present
      if (formattedPhone.startsWith("010")) {
        formattedPhone = "+82" + formattedPhone.substring(1)
      } else if (formattedPhone.startsWith("0")) {
        formattedPhone = "+82" + formattedPhone.substring(1)
      } else if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+82" + formattedPhone
      }

      console.log("Sending verification to:", formattedPhone)

      const appVerifier = setupRecaptcha()
      if (!appVerifier) {
        throw new Error("reCAPTCHA 설정에 실패했습니다")
      }

      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier)

      setState((prev) => ({
        ...prev,
        loading: false,
        confirmationResult,
        error: null,
      }))

      return confirmationResult
    } catch (error: any) {
      console.error("Phone verification error:", error)

      let errorMessage = "전화번호 인증 요청에 실패했습니다"

      if (error.code === "auth/invalid-phone-number") {
        errorMessage = "올바르지 않은 전화번호입니다"
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요"
      } else if (error.code === "auth/quota-exceeded") {
        errorMessage = "일일 SMS 한도를 초과했습니다"
      } else if (error.message) {
        errorMessage = error.message
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
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

      setState((prev) => ({
        ...prev,
        loading: false,
        error: null,
      }))

      return result.user
    } catch (error: any) {
      console.error("Code verification error:", error)

      let errorMessage = "인증번호가 올바르지 않습니다"

      if (error.code === "auth/invalid-verification-code") {
        errorMessage = "잘못된 인증번호입니다"
      } else if (error.code === "auth/code-expired") {
        errorMessage = "인증번호가 만료되었습니다"
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))

      throw error
    }
  }

  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      confirmationResult: null,
      recaptchaVerifier: null,
    })

    // Clean up reCAPTCHA
    if ((window as any).recaptchaVerifier) {
      ;(window as any).recaptchaVerifier.clear()
      ;(window as any).recaptchaVerifier = null
    }
  }, [])

  return {
    sendVerificationCode,
    verifyCode,
    resetState,
    loading: state.loading,
    error: state.error,
    isCodeSent: !!state.confirmationResult,
  }
}
