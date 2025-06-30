"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Phone, Shield, ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePhoneAuth } from "@/hooks/usePhoneAuth"
import { useAuth } from "@/contexts/AuthContext"
import { generateId, saveUser, setCurrentUser } from "@/lib/utils"
import SafeLink from "@/components/SafeLink"
import type { User } from "@/types"

export default function PhoneAuthPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [step, setStep] = useState<"phone" | "code">("phone")
  const [success, setSuccess] = useState("")

  const router = useRouter()
  const { login } = useAuth()
  const { sendVerificationCode, verifyCode, resetState, loading, error, isCodeSent } = usePhoneAuth()

  // Clean up on unmount
  useEffect(() => {
    return () => {
      resetState()
    }
  }, [resetState])

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneNumber.trim()) {
      return
    }

    try {
      await sendVerificationCode(phoneNumber)
      setStep("code")
      setSuccess("인증번호가 발송되었습니다.")
    } catch (error) {
      console.error("Failed to send verification code:", error)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationCode.trim()) {
      return
    }

    try {
      const firebaseUser = await verifyCode(verificationCode)

      // 새 사용자 생성
      const newUser: User = {
        id: generateId(),
        name: firebaseUser.displayName || `사용자${Date.now()}`,
        email: firebaseUser.email || "",
        phone: firebaseUser.phoneNumber || phoneNumber,
        phoneNumber: firebaseUser.phoneNumber || phoneNumber,
        createdAt: new Date().toISOString(),
        isVerified: true,
        verified: true,
        joinDate: new Date().toISOString(),
        rating: 0,
        totalSales: 0,
        totalPurchases: 0,
      }

      // 사용자 저장 및 로그인
      saveUser(newUser)
      setCurrentUser(newUser)
      login(newUser)

      setSuccess("인증이 완료되었습니다!")

      // 홈으로 리다이렉트
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error) {
      console.error("Failed to verify code:", error)
    }
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            {step === "phone" ? (
              <Phone className="w-6 h-6 text-green-600" />
            ) : (
              <Shield className="w-6 h-6 text-green-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">{step === "phone" ? "전화번호 인증" : "인증번호 확인"}</CardTitle>
          <p className="text-gray-600 mt-2">
            {step === "phone"
              ? "안전한 거래를 위해 전화번호를 인증해주세요"
              : `${phoneNumber}로 발송된 인증번호를 입력해주세요`}
          </p>
        </CardHeader>

        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                  전화번호
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="010-1234-5678"
                    className="pl-10"
                    maxLength={13}
                    disabled={loading}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">국가번호 없이 입력하세요 (예: 010-1234-5678)</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading || !phoneNumber.trim()}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    인증번호 발송 중...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    인증번호 받기
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                )}
              </Button>

              {/* reCAPTCHA container */}
              <div id="recaptcha-container" className="flex justify-center mt-4"></div>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <Label htmlFor="verificationCode" className="text-sm font-medium">
                  인증번호
                </Label>
                <div className="relative mt-1">
                  <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="6자리 인증번호"
                    className="pl-10 text-center text-lg tracking-widest"
                    maxLength={6}
                    disabled={loading}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">SMS로 받은 6자리 숫자를 입력하세요</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={loading || !verificationCode.trim()}>
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      인증 중...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      인증 완료
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setStep("phone")
                    setVerificationCode("")
                    setSuccess("")
                    resetState()
                  }}
                  disabled={loading}
                >
                  다시 시도
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              다른 방법으로 로그인하시겠어요?{" "}
              <SafeLink href="/auth/login" className="text-blue-600 hover:underline font-medium">
                이메일로 로그인
              </SafeLink>
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">안전한 인증</h4>
                <p className="text-sm text-blue-700">
                  SMS 인증을 통해 계정을 안전하게 보호하고 신뢰할 수 있는 거래 환경을 제공합니다.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
