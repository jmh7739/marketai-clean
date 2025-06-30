"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getClientAuth } from "@/lib/firebase"
import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth"

/* ───────────────────── utils ───────────────────── */
const toE164 = (raw: string): string => {
  const digits = raw.replace(/[^\d]/g, "")
  if (digits.startsWith("010")) return "+8210" + digits.slice(3)
  if (digits.startsWith("01")) return "+821" + digits.slice(2)
  if (digits.startsWith("82")) return "+" + digits
  return "+82" + digits
}

/* ───────────────────── hook ───────────────────── */
export function usePhoneAuth() {
  /* ui state */
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [smsSent, setSmsSent] = useState(false)

  /* cooldown timer */
  const [cooldown, setCooldown] = useState(0)
  const cooldownRef = useRef<NodeJS.Timeout | null>(null)

  /* firebase confirmation */
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null)

  /* clean up interval on unmount */
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current)
      try {
        ;(window as any).recaptchaVerifier?.clear?.()
      } catch {
        /* silent */
      }
    }
  }, [])

  /* start cooldown – 60s default */
  const startCooldown = (seconds = 60) => {
    setCooldown(seconds)
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1 && cooldownRef.current) {
          clearInterval(cooldownRef.current)
          cooldownRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1_000)
  }

  /* helper to lazily create invisible recaptcha */
  const getRecaptcha = async (): Promise<RecaptchaVerifier> => {
    const auth = getClientAuth()
    const { RecaptchaVerifier } = await import("firebase/auth")
    if (!document.getElementById("recaptcha-container")) {
      const el = document.createElement("div")
      el.id = "recaptcha-container"
      el.style.display = "none"
      document.body.appendChild(el)
    }

    if (!(window as any).recaptchaVerifier) {
      ;(window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      })
    }

    return (window as any).recaptchaVerifier as RecaptchaVerifier
  }

  /* ───────────── public api ───────────── */
  const sendVerificationCode = useCallback(
    async (phone: string) => {
      if (cooldown > 0) return { success: false, message: `${cooldown}초 후 다시 시도해 주세요.` }

      try {
        setLoading(true)
        setError(null)

        const auth = getClientAuth()
        const verifier = await getRecaptcha()
        const { signInWithPhoneNumber } = await import("firebase/auth")

        const confirmation = await signInWithPhoneNumber(auth, toE164(phone), verifier)
        setConfirmResult(confirmation)
        setSmsSent(true)
        startCooldown(60)
        return { success: true }
      } catch (e: any) {
        const errorMessage = e?.message ?? "인증번호 발송 중 오류가 발생했습니다."
        setError(errorMessage)
        return { success: false, message: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [cooldown],
  )

  const verifyCode = useCallback(async () => {
    if (!confirmResult) {
      setError("먼저 인증번호를 요청해 주세요.")
      return { success: false }
    }
    if (verificationCode.length !== 6) {
      setError("6자리 인증번호를 입력해 주세요.")
      return { success: false }
    }

    try {
      setLoading(true)
      const result = await confirmResult.confirm(verificationCode)
      return { success: true, user: result.user }
    } catch (e: any) {
      setError(e?.message ?? "인증에 실패했습니다. 다시 시도해 주세요.")
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [confirmResult, verificationCode])

  const clearError = () => setError(null)

  return {
    /* state */
    verificationCode,
    setVerificationCode,
    loading,
    error,
    cooldown,
    smsSent,
    /* actions */
    sendVerificationCode,
    verifyCode,
    clearError,
  }
}

export default usePhoneAuth
