"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePhoneAuth } from "@/hooks/usePhoneAuth"
import { saveUser, setCurrentUser, generateId } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@/types"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { sendVerificationCode, verifyCode, resetState, loading, error, isCodeSent } = usePhoneAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreePrivacy: false,
  })
  const [verificationCode, setVerificationCode] = useState("")
  const [step, setStep] = useState<"phone" | "code" | "info">("phone")

  // Clean up on unmount
  useEffect(() => {
    return () => {
      resetState()
    }
  }, [resetState])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.phoneNumber.trim()) {
      toast({
        title: "입력 오류",
        description: "전화번호를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      await sendVerificationCode(formData.phoneNumber)
      setStep("code")
      toast({
        title: "인증번호 발송",
        description: "입력하신 번호로 인증번호를 발송했습니다.",
      })
    } catch (error) {
      console.error("Failed to send verification code:", error)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationCode.trim()) {
      toast({
        title: "입력 오류",
        description: "인증번호를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      await verifyCode(verificationCode)
      setStep("info")
      toast({
        title: "인증 완료",
        description: "전화번호 인증이 완료되었습니다.",
      })
    } catch (error) {
      console.error("Failed to verify code:", error)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast({
        title: "입력 오류",
        description: "모든 필수 정보를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "입력 오류",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      toast({
        title: "약관 동의",
        description: "필수 약관에 동의해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      const newUser: User = {
        id: generateId(),
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        phone: formData.phoneNumber,
        createdAt: new Date().toISOString(),
        verified: true,
        joinDate: new Date().toISOString(),
        rating: 0,
        totalSales: 0,
        totalPurchases: 0,
      }

      saveUser(newUser)
      setCurrentUser(newUser)

      toast({
        title: "회원가입 완료",
        description: "MarketAI에 오신 것을 환영합니다!",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "오류",
        description: "회원가입 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">회원가입</CardTitle>
          <CardDescription className="text-center">
            {step === "phone" && "전화번호를 입력해주세요"}
            {step === "code" && "인증번호를 입력해주세요"}
            {step === "info" && "기본 정보를 입력해주세요"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "phone" && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <Label htmlFor="phoneNumber">전화번호</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">국가번호 없이 입력하세요 (예: 010-1234-5678)</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "발송 중..." : "인증번호 받기"}
              </Button>

              {/* reCAPTCHA container */}
              <div id="recaptcha-container" className="flex justify-center"></div>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <Label htmlFor="verificationCode">인증번호</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="6자리 인증번호"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{formData.phoneNumber}로 발송된 인증번호를 입력하세요</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "인증 중..." : "인증번호 확인"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setStep("phone")
                    setVerificationCode("")
                    resetState()
                  }}
                >
                  다시 시도
                </Button>
              </div>
            </form>
          )}

          {step === "info" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="8자리 이상"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="비밀번호 재입력"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleCheckboxChange("agreeTerms", checked as boolean)}
                  />
                  <Label htmlFor="agreeTerms" className="text-sm">
                    <span className="text-red-500">*</span>{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      이용약관
                    </Link>
                    에 동의합니다
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onCheckedChange={(checked) => handleCheckboxChange("agreePrivacy", checked as boolean)}
                  />
                  <Label htmlFor="agreePrivacy" className="text-sm">
                    <span className="text-red-500">*</span>{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      개인정보처리방침
                    </Link>
                    에 동의합니다
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                회원가입 완료
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
