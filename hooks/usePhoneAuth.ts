"use client"

import { useState } from "react"
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ApplicationVerifier,
  type ConfirmationResult,
  type FirebaseError,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

/* ───────────────────────── Utils ───────────────────────── */
const toE164 = (raw: string) => {
  const d = raw.replace(/[^\d]/g, "")
  if (d.startsWith("010")) return "+8210" + d.slice(3)
  if (d.startsWith("01")) return "+821" + d.slice(2)
  if (d.startsWith("82")) return "+" + d
  return "+82" + d
}

/* Firebase 오류를 사용자 친화적 메시지로 변환 */
const getErrorMessage = (error: FirebaseError): string => {
  switch (error.code) {
    case "auth/too-many-requests":
      return "인증번호 요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
    case "auth/invalid-phone-number":
      return "올바르지 않은 전화번호입니다. 다시 확인해주세요."
    case "auth/quota-exceeded":
      return "일일 인증번호 발송 한도를 초과했습니다. 내일 다시 시도해주세요."
    case "auth/captcha-check-failed":
      return "보안 검증에 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요."
    case "auth/invalid-verification-code":
      return "인증번호가 올바르지 않습니다. 다시 입력해주세요."
    case "auth/code-expired":
      return "인증번호가 만료되었습니다. 새로운 인증번호를 요청해주세요."
    case "auth/session-expired":
      return "인증 세션이 만료되었습니다. 처음부터 다시 시도해주세요."
    default:
      return "인증번호 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
  }
}

/* ───────────────────── Hook 구현 ───────────────────── */
export function usePhoneAuth() {
  const [verificationCode, setVerificationCode] = useState("")
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [smsSent, setSmsSent] = useState(false)

  /* 쿨다운 타이머 */
  const startCooldown = (sec = 60) => {
    setCooldown(sec)
    const tick = () => setCooldown((prev) => (prev <= 1 ? 0 : (setTimeout(tick, 1_000), prev - 1)))
    tick()
  }

  /* 실제 reCAPTCHA 설정 */
  const getVerifier = (): ApplicationVerifier => {
    const el = document.getElementById("recaptcha-container")
    if (el) el.innerHTML = ""

    return new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA solved")
      },
      "expired-callback": () => {
        console.log("reCAPTCHA expired")
      },
    })
  }

  /* 인증번호 전송 */
  const sendVerificationCode = async (phone: string) => {
    /* 클라이언트 쿨다운 확인 */
    const last = Number(sessionStorage.getItem("sms_last") || 0)
    const diff = (Date.now() - last) / 1_000
    if (diff < 60) {
      const remaining = 60 - Math.floor(diff)
      startCooldown(remaining)
      setErrorMessage(`${remaining}초 후에 다시 시도해주세요.`)
      return { success: false, message: `${remaining}초 후에 다시 시도해주세요.` }
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      const verifier = getVerifier()
      const confirm = await signInWithPhoneNumber(auth, toE164(phone), verifier)
      setConfirmation(confirm)
      setSmsSent(true)
      sessionStorage.setItem("sms_last", String(Date.now()))
      startCooldown(60)
      return { success: true, message: "인증번호가 발송되었습니다." }
    } catch (e) {
      const err = e as FirebaseError
      console.warn("SMS send error:", err.code, err.message)

      const userMessage = getErrorMessage(err)
      setErrorMessage(userMessage)

      if (err.code === "auth/too-many-requests") {
        startCooldown(120)
        sessionStorage.setItem("sms_last", String(Date.now()))
      }

      return { success: false, message: userMessage }
    } finally {
      setLoading(false)
    }
  }

  /* 인증번호 확인 */
  const verifyCode = async () => {
    if (!confirmation) {
      const message = "먼저 인증번호를 요청해주세요."
      setErrorMessage(message)
      return { success: false, message }
    }

    setLoading(true)
    setErrorMessage(null)
    try {
      await confirmation.confirm(verificationCode)
      return { success: true, message: "전화번호 인증이 완료되었습니다." }
    } catch (e) {
      const err = e as FirebaseError
      console.warn("Code verification error:", err.code)

      const userMessage = getErrorMessage(err)
      setErrorMessage(userMessage)
      return { success: false, message: userMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    verificationCode,
    setVerificationCode,
    loading,
    error: errorMessage,
    cooldown,
    smsSent,
    sendVerificationCode,
    verifyCode,
  }
}

export default usePhoneAuth
