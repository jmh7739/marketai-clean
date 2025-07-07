"use client"

import { useState, useCallback } from "react"
import { setupRecaptcha, sendSMSVerification, verifySMSCode, clearRecaptcha } from "@/lib/firebase"
import { upsertUser, getUserByFirebaseUid, type UserProfile } from "@/lib/supabase-client"

// 인증 단계 타입
export type AuthStep = "phone" | "verification" | "profile" | "complete"

// 사용자 정보 타입
export interface AuthUser {
  uid: string
  phoneNumber: string
  displayName?: string
  email?: string
}

// usePhoneAuth 훅
export const usePhoneAuth = () => {
  // 상태 관리
  const [step, setStep] = useState<AuthStep>("phone")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 사용자 입력 데이터
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  // Firebase 관련 상태
  const [user, setUser] = useState<AuthUser | null>(null)
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null)

  // 오류 설정 함수
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage)
    setLoading(false)
  }, [])

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = useCallback((phone: string): string => {
    // 한국 전화번호 포맷팅
    let cleaned = phone.replace(/\D/g, "")

    // 010으로 시작하는 경우 +82로 변환
    if (cleaned.startsWith("010")) {
      cleaned = "82" + cleaned.substring(1)
    }
    // 이미 82로 시작하는 경우
    else if (cleaned.startsWith("82")) {
      // 그대로 유지
    }
    // 다른 형태의 번호
    else if (cleaned.length === 11 && cleaned.startsWith("01")) {
      cleaned = "82" + cleaned.substring(1)
    }

    return "+" + cleaned
  }, [])

  // reCAPTCHA 초기화
  const initializeRecaptcha = useCallback(
    async (containerId: string): Promise<boolean> => {
      try {
        setError(null)
        console.log("reCAPTCHA 초기화 시작...")

        // 기존 reCAPTCHA 정리
        if (recaptchaVerifier) {
          clearRecaptcha()
          setRecaptchaVerifier(null)
        }

        const verifier = await setupRecaptcha(containerId)
        if (!verifier) {
          handleError("reCAPTCHA 초기화에 실패했습니다.")
          return false
        }

        setRecaptchaVerifier(verifier)
        console.log("reCAPTCHA 초기화 성공")
        return true
      } catch (error) {
        console.error("reCAPTCHA 초기화 오류:", error)
        handleError("reCAPTCHA 초기화 중 오류가 발생했습니다.")
        return false
      }
    },
    [recaptchaVerifier, handleError],
  )

  // SMS 전송
  const sendSMS = useCallback(
    async (phone: string) => {
      if (!phone.trim()) {
        handleError("전화번호를 입력해주세요.")
        return
      }

      if (!recaptchaVerifier) {
        handleError("reCAPTCHA가 초기화되지 않았습니다.")
        return
      }

      setLoading(true)
      setError(null)

      try {
        console.log("SMS 전송 시작:", phone)

        const formattedPhone = formatPhoneNumber(phone)
        console.log("포맷팅된 전화번호:", formattedPhone)

        const result = await sendSMSVerification(formattedPhone, recaptchaVerifier)

        if (!result.success) {
          handleError(result.error || "SMS 전송에 실패했습니다.")
          return
        }

        setConfirmationResult(result.confirmationResult)
        setPhoneNumber(formattedPhone)
        setStep("verification")
        console.log("SMS 전송 성공")
      } catch (error) {
        console.error("SMS 전송 오류:", error)
        handleError("SMS 전송 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    },
    [recaptchaVerifier, formatPhoneNumber, handleError],
  )

  // 인증 코드 확인
  const verifyCode = useCallback(
    async (code: string) => {
      if (!code.trim()) {
        handleError("인증 코드를 입력해주세요.")
        return
      }

      if (!confirmationResult) {
        handleError("SMS 전송을 먼저 진행해주세요.")
        return
      }

      setLoading(true)
      setError(null)

      try {
        console.log("인증 코드 확인 시작:", code)

        const result = await verifySMSCode(confirmationResult, code)

        if (!result.success) {
          handleError(result.error || "인증 코드 확인에 실패했습니다.")
          return
        }

        const firebaseUser = result.user
        setUser({
          uid: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
        })

        setVerificationCode(code)
        setStep("profile")
        console.log("인증 코드 확인 성공:", firebaseUser)
      } catch (error) {
        console.error("인증 코드 확인 오류:", error)
        handleError("인증 코드 확인 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    },
    [confirmationResult, handleError],
  )

  // 사용자 프로필 저장
  const saveUserProfile = useCallback(
    async (name: string, email?: string) => {
      if (!name.trim()) {
        handleError("이름을 입력해주세요.")
        return
      }

      if (!user) {
        handleError("사용자 정보가 없습니다.")
        return
      }

      setLoading(true)
      setError(null)

      try {
        console.log("사용자 프로필 저장 시작:", { name, email })

        const userProfile: UserProfile = {
          firebase_uid: user.uid,
          phone: phoneNumber,
          name: name.trim(),
          email: email?.trim() || undefined,
          phone_verified: true,
          email_verified: false,
        }

        const result = await upsertUser(userProfile)

        if (!result.success) {
          handleError(result.error || "사용자 프로필 저장에 실패했습니다.")
          return
        }

        setUserName(name.trim())
        setUserEmail(email?.trim() || "")
        setStep("complete")
        console.log("사용자 프로필 저장 성공:", result.user)
      } catch (error) {
        console.error("사용자 프로필 저장 오류:", error)
        handleError("사용자 프로필 저장 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    },
    [user, phoneNumber, handleError],
  )

  // 인증 초기화
  const resetAuth = useCallback(() => {
    console.log("인증 초기화")

    // 상태 초기화
    setStep("phone")
    setLoading(false)
    setError(null)

    // 데이터 초기화
    setPhoneNumber("")
    setVerificationCode("")
    setUserName("")
    setUserEmail("")
    setUser(null)
    setConfirmationResult(null)

    // reCAPTCHA 정리
    if (recaptchaVerifier) {
      clearRecaptcha()
      setRecaptchaVerifier(null)
    }
  }, [recaptchaVerifier])

  // 이전 단계로 이동
  const goBack = useCallback(() => {
    console.log("이전 단계로 이동:", step)

    switch (step) {
      case "verification":
        setStep("phone")
        setVerificationCode("")
        setError(null)
        break
      case "profile":
        setStep("verification")
        setUserName("")
        setUserEmail("")
        setError(null)
        break
      case "complete":
        setStep("profile")
        setError(null)
        break
      default:
        break
    }
  }, [step])

  // 기존 사용자 확인
  const checkExistingUser = useCallback(async (firebaseUid: string) => {
    try {
      console.log("기존 사용자 확인:", firebaseUid)

      const result = await getUserByFirebaseUid(firebaseUid)

      if (result.success && result.user) {
        console.log("기존 사용자 발견:", result.user)
        setUserName(result.user.name)
        setUserEmail(result.user.email || "")
        return result.user
      }

      return null
    } catch (error) {
      console.error("기존 사용자 확인 오류:", error)
      return null
    }
  }, [])

  return {
    // 상태
    step,
    loading,
    error,
    phoneNumber,
    verificationCode,
    userName,
    userEmail,
    user,

    // 함수
    initializeRecaptcha,
    sendSMS,
    verifyCode,
    saveUserProfile,
    resetAuth,
    goBack,
    setError,
    formatPhoneNumber,
    checkExistingUser,

    // 유틸리티
    setPhoneNumber,
    setVerificationCode,
    setUserName,
    setUserEmail,
  }
}

export default usePhoneAuth
