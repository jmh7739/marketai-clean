"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Phone, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { usePhoneAuth } from "@/hooks/usePhoneAuth"
import type { User as UserType } from "@/types"

export default function PhoneAuthPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const {
    verificationCode,
    setVerificationCode,
    loading: phoneLoading,
    error: phoneError,
    cooldown,
    smsSent,
    sendVerificationCode,
    verifyCode,
    clearError,
  } = usePhoneAuth()

  const redirectTo = searchParams.get("redirect") || "/"
  const prefilledPhone = searchParams.get("phone") || ""

  useEffect(() => {
    if (prefilledPhone) {
      setPhoneNumber(prefilledPhone)
    }
  }, [prefilledPhone])

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "")
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/
    return phoneRegex.test(phone)
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    setPhoneNumber(formatted)
    setError("")
    clearError()
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePhone(phoneNumber)) {
      setError("올바른 전화번호를 입력해주세요 (010-XXXX-XXXX)")
      return
    }

    const result = await sendVerificationCode(phoneNumber)
    if (result.success) {
      setShowVerification(true)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await verifyCode()
    if (result.success && result.user) {
      const userData: UserType = {
        id: result.user.uid,
        name: result.user.displayName || "사용자",
        email: result.user.email || "",
        phone: phoneNumber,
        avatar: result.user.photoURL || "",
        createdAt: new Date().toISOString(),
        isVerified: true,
        role: "user",
        status: "active",
        lastLoginAt: new Date().toISOString(),
        preferences: {
          notifications: true,
          marketing: false,
          language: "ko",
        },
      }

      login(userData)
      router.push(redirectTo)
    }
  }

  const handleBackToPhone = () => {
    setShowVerification(false)
    setVerificationCode("")
    clearError()
  }

  const handleBackToLogin = () => {
    const params = new URLSearchParams()
    if (redirectTo !== "/") {
      params.set("redirect", redirectTo)
    }

    const url = `/auth/login${params.toString() ? `?${params.toString()}` : ""}`
    router.push(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">{!showVerification ? "전화번호 인증" : "인증번호 확인"}</CardTitle>
          <p className="text-gray-600 mt-2">
            {!showVerification
              ? "전화번호로 간편하게 로그인하세요"
              : `${phoneNumber}으로 발송된 인증번호를 입력해주세요`}
          </p>
        </CardHeader>

        <CardContent>
          {!showVerification ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  전화번호
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="010-1234-5678"
                    className="pl-10"
                    maxLength={13}
                    disabled={phoneLoading}
                  />
                </div>
              </div>

              {(error || phoneError) && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-700 text-sm">{error || phoneError}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={phoneLoading || cooldown > 0 || !validatePhone(phoneNumber)}
                >
                  {phoneLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      인증번호 발송 중...
                    </div>
                  ) : cooldown > 0 ? (
                    `${cooldown}초 후 재시도`
                  ) : (
                    <div className="flex items-center justify-center">
                      인증번호 받기
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </Button>

                <Button type="button" variant="outline" className="w-full" onClick={handleBackToLogin}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  다른 방법으로 로그인
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <Label htmlFor="code" className="text-sm font-medium">
                  인증번호 (6자리)
                </Label>
                <Input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="mt-1 text-center text-lg tracking-widest"
                  disabled={phoneLoading}
                />
              </div>

              {smsSent && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className="text-green-700 text-sm">인증번호가 발송되었습니다.</p>
                </div>
              )}

              {(error || phoneError) && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-700 text-sm">{error || phoneError}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button type="submit" className="w-full" disabled={verificationCode.length !== 6 || phoneLoading}>
                  {phoneLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      로그인 중...
                    </div>
                  ) : (
                    "로그인"
                  )}
                </Button>

                <Button type="button" variant="outline" className="w-full" onClick={handleBackToPhone}>
                  전화번호 다시 입력
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  인증번호가 오지 않나요?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => sendVerificationCode(phoneNumber)}
                    disabled={cooldown > 0 || phoneLoading}
                  >
                    {cooldown > 0 ? `${cooldown}초 후 재발송` : "다시 발송"}
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* reCAPTCHA 컨테이너 */}
          <div id="recaptcha-container"></div>
        </CardContent>
      </Card>
    </div>
  )
}
