"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle, ArrowRight, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import SafeLink from "@/components/SafeLink"
import { useAuth } from "@/contexts/AuthContext"
import { usePhoneAuth } from "@/hooks/usePhoneAuth"

export default function SignupPage() {
  const [step, setStep] = useState<"info" | "verify">("info")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === "phone") {
      value = formatPhoneNumber(value as string)
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
    clearError()
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/
    return phoneRegex.test(phone)
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("이름을 입력해주세요")
      return false
    }
    if (!formData.email.trim()) {
      setError("이메일을 입력해주세요")
      return false
    }
    if (!validatePhone(formData.phone)) {
      setError("올바른 전화번호를 입력해주세요 (010-XXXX-XXXX)")
      return false
    }
    if (formData.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다")
      return false
    }
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      setError("필수 약관에 동의해주세요")
      return false
    }
    return true
  }

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    // 전화번호 인증 시작
    const result = await sendVerificationCode(formData.phone)
    if (result.success) {
      setStep("verify")
    }
  }

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await verifyCode()
    if (result.success && result.user) {
      try {
        // 사용자 데이터 저장 (로컬스토리지)
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const newUser = {
          id: result.user.uid,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          avatar: "",
          createdAt: new Date().toISOString(),
          isVerified: true, // Firebase 인증 완료
          role: "user" as const,
          status: "active" as const,
          lastLoginAt: new Date().toISOString(),
          preferences: {
            notifications: true,
            marketing: formData.agreeMarketing,
            language: "ko",
          },
        }

        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))

        // 로그인 처리
        login(newUser)
        router.push(redirectTo)
      } catch (error) {
        setError("회원가입 처리 중 오류가 발생했습니다.")
      }
    }
  }

  const handleBackToInfo = () => {
    setStep("info")
    setError("")
    clearError()
    setVerificationCode("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {step === "info" && <User className="w-6 h-6 text-blue-600" />}
            {step === "verify" && <Phone className="w-6 h-6 text-blue-600" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === "info" && "MarketAI 회원가입"}
            {step === "verify" && "전화번호 인증"}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {step === "info" && "새로운 계정을 만들어 경매에 참여하세요"}
            {step === "verify" && `${formData.phone}으로 발송된 인증번호를 입력해주세요`}
          </p>

          {/* 진행 단계 표시 */}
          <div className="flex justify-center mt-4 space-x-2">
            <div className={`w-3 h-3 rounded-full ${step === "info" ? "bg-blue-600" : "bg-gray-300"}`} />
            <div className={`w-3 h-3 rounded-full ${step === "verify" ? "bg-blue-600" : "bg-gray-300"}`} />
          </div>
        </CardHeader>

        <CardContent>
          {step === "info" && (
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              {/* 이름 */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  이름 *
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="홍길동"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  이메일 *
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="example@email.com"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* 전화번호 */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  전화번호 *
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="010-1234-5678"
                    className="pl-10"
                    maxLength={13}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">SMS 인증을 위해 정확한 번호를 입력해주세요</p>
              </div>

              {/* 비밀번호 */}
              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  비밀번호 *
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="6자 이상 입력하세요"
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  비밀번호 확인 *
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="비밀번호를 다시 입력하세요"
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeTerms", checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="agreeTerms" className="text-sm cursor-pointer">
                    <SafeLink href="/terms" className="text-blue-600 hover:underline">
                      이용약관
                    </SafeLink>
                    에 동의합니다 *
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onCheckedChange={(checked) => handleInputChange("agreePrivacy", checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="agreePrivacy" className="text-sm cursor-pointer">
                    <SafeLink href="/privacy" className="text-blue-600 hover:underline">
                      개인정보처리방침
                    </SafeLink>
                    에 동의합니다 *
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onCheckedChange={(checked) => handleInputChange("agreeMarketing", checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="agreeMarketing" className="text-sm cursor-pointer">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </Label>
                </div>
              </div>

              {(error || phoneError) && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-700 text-sm">{error || phoneError}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || phoneLoading || cooldown > 0}>
                {phoneLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    인증번호 발송 중...
                  </div>
                ) : cooldown > 0 ? (
                  `${cooldown}초 후 재시도`
                ) : (
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    전화번호 인증하기
                  </div>
                )}
              </Button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>{formData.name}</strong>님의 전화번호
                </p>
                <p className="text-lg font-semibold text-blue-800 mt-1">{formData.phone}</p>
                <p className="text-xs text-blue-600 mt-1">위 번호로 인증번호를 발송했습니다</p>
              </div>

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
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {formData.phone}으로 발송된 6자리 숫자를 입력하세요
                </p>
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
                      회원가입 중...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      회원가입 완료
                    </div>
                  )}
                </Button>

                <Button type="button" variant="outline" className="w-full" onClick={handleBackToInfo}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  정보 다시 입력
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  인증번호가 오지 않나요?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => sendVerificationCode(formData.phone)}
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

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <SafeLink href="/auth/login" className="text-blue-600 hover:underline font-medium">
                로그인하기
              </SafeLink>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
