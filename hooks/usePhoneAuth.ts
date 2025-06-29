"use client"

import { useState, useEffect } from "react"
import { getClientAuth } from "@/lib/firebase"
import type { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber as SignInFn } from "firebase/auth" // 타입 전용

/* ────────── 유틸 함수 ────────── */
const toE164 = (raw: string) => {
  const digits = raw.replace(/[^\d]/g, "")
  if (digits.startsWith("010")) return "+8210" + digits.slice(3)
  if (digits.startsWith("01")) return "+821" + digits.slice(2)
  if (digits.startsWith("82")) return "+" + digits
  return "+82" + digits
}

/* 기타 getErrorMessage 함수는 기존과 동일 (생략) */

/* ────────── 훅 구현 ────────── */
export function usePhoneAuth() {
  const [verificationCode, setVerificationCode] = useState("")
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [smsSent, setSmsSent] = useState(false)
  const [recaptchaReady, setRecaptchaReady] = useState(false)

  /* reCAPTCHA & Auth 초기화 */
  useEffect(() => {
    if (typeof window === "undefined") return
    ;(async () => {
      const auth = await getClientAuth()
      const { RecaptchaVerifier } = await import("firebase/auth")
      // 컨테이너 보장
      if (!document.getElementById("recaptcha-container")) {
        const el = document.createElement("div")
        el.id = "recaptcha-container"
        el.style.display = "none"
        document.body.appendChild(el)
      }
      ;(window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" })
      setRecaptchaReady(true)
    })()
    return () => {
      try {
        ;(window as any).recaptchaVerifier?.clear?.()
      } catch {}
    }
  }, [])

  /* 쿨다운 타이머 (생략: 기존 코드 그대로) */

  /* 인증번호 전송 */
  const sendVerificationCode = async (phone: string) => {
    if (!recaptchaReady) return { success: false, message: "보안 검증 준비 중입니다." }
    if (cooldown > 0) return { success: false, message: `${cooldown}초 후 재시도 가능` }

    setLoading(true)
    setError(null)
    try {
      const auth = await getClientAuth()
      const { signInWithPhoneNumber } = (await import("firebase/auth")) as {
        signInWithPhoneNumber: SignInFn
      }
      const verifier = (window as any).recaptchaVerifier as RecaptchaVerifier
      const confirm = await signInWithPhoneNumber(auth, toE164(phone), verifier)
      setConfirmation(confirm)
      setSmsSent(true)
      /* 쿨다운 시작 (생략) */
      return { success: true, message: "인증번호가 발송되었습니다." }
    } catch (e) {
      /* 오류 처리 (생략) */
      return { success: false, message: "인증번호 발송 실패" }
    } finally {
      setLoading(false)
    }
  }

  /* verifyCode 함수는 기존과 동일 (생략) */

  return {
    verificationCode,
    setVerificationCode,
    sendVerificationCode,
    /* verifyCode, error, loading … 나머지 그대로 */
  }
}

export default usePhoneAuth
