"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, Mail, Send, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { usePhoneAuth } from "@/hooks/usePhoneAuth"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"
import TermsModal from "@/components/TermsModal"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const router = useRouter()

  const {
    verificationCode,
    setVerificationCode,
    sendVerificationCode,
    verifyCode,
    loading: phoneLoading,
    error: phoneError,
    cooldown,
    smsSent,
  } = usePhoneAuth()

  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요"
    }

    const phoneRegex = /^010-\d{4}-\d{4}$/
    if (!formData.phone) {
      newErrors.phone = "전화번호를 입력해주세요"
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "010-0000-0000 형식으로 입력해주세요"
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요"
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자리 이상 입력해주세요"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다"
    }

    if (!agreedToTerms) {
      newErrors.terms = "서비스 이용약관에 동의해주세요"
    }
    if (!agreedToPrivacy) {
      newErrors.privacy = "개인정보 처리방침에 동의해주세요"
    }

    if (!phoneVerified) {
      newErrors.phone = "전화번호 인증을 완료해주세요"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "phone") {
      value = formatPhoneNumber(value)
      setPhoneVerified(false) // 전화번호 변경시 인증 초기화
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSendSMS = async () => {
    if (!formData.phone) {
      setErrors({ phone: "전화번호를 입력해주세요" })
      return
    }
    const phoneRegex = /^010-\d{4}-\d{4}$/
    if (!phoneRegex.test(formData.phone)) {
      setErrors({ phone: "010-0000-0000 형식으로 입력해주세요" })
      return
    }
    await sendVerificationCode(formData.phone)
  }

  const handleVerifyCode = async () => {
    const result = await verifyCode()
    if (result.success) {
      setPhoneVerified(true)
      setErrors((prev) => ({ ...prev, phone: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // 이메일로 계정 생성
      const emailResult = await createUserWithEmailAndPassword(auth, formData.email, formData.password)

      // 프로필 업데이트
      await updateProfile(emailResult.user, {
        displayName: formData.name,
      })

      // 사용자 데이터 저장
      const userData = {
        uid: emailResult.user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        phoneVerified: true,
        emailVerified: emailResult.user.emailVerified,
        createdAt: new Date().toISOString(),
        role: "user",
      }

      sessionStorage.setItem("user_data", JSON.stringify(userData))
      router.push("/")
    } catch (error: any) {
      console.error("Signup error:", error)
      setErrors({ general: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">MarketAI 회원가입</CardTitle>
          <p className="text-gray-600 mt-2">모든 정보를 입력하고 전화번호 인증을 완료해주세요</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 기본 정보 */}
            <div>
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="실명을 입력해주세요"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">이메일 *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="example@email.com"
                  className="pl-10"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* 전화번호 인증 섹션 */}
            <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <Label className="text-sm font-medium text-blue-800">전화번호 인증 *</Label>
                {phoneVerified && <CheckCircle className="w-4 h-4 text-green-600" />}
              </div>

              <div>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="010-0000-0000"
                      maxLength={13}
                      className="pl-10"
                      disabled={phoneVerified}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSendSMS}
                    disabled={phoneLoading || cooldown > 0 || phoneVerified}
                    className="whitespace-nowrap"
                  >
                    {phoneLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : cooldown > 0 ? (
                      `${cooldown}s`
                    ) : phoneVerified ? (
                      "인증완료"
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        발송
                      </>
                    )}
                  </Button>
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* SMS 발송 상태 */}
              {smsSent && !phoneVerified && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-green-800 text-sm">
                      <strong>{formData.phone}</strong>로 인증번호가 발송되었습니다
                    </p>
                  </div>
                </div>
              )}

              {/* 인증번호 입력 */}
              {smsSent && !phoneVerified && (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                      placeholder="인증번호 6자리"
                      className="text-center tracking-widest"
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={phoneLoading || verificationCode.length !== 6}
                      className="whitespace-nowrap"
                    >
                      {phoneLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        "인증"
                      )}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSendSMS}
                    disabled={cooldown > 0}
                    className="w-full text-xs"
                  >
                    {cooldown > 0 ? `재발송 (${cooldown}s)` : "인증번호 재발송"}
                  </Button>
                </div>
              )}

              {/* 인증 완료 */}
              {phoneVerified && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-green-800 text-sm font-medium">전화번호 인증이 완료되었습니다</p>
                  </div>
                </div>
              )}

              {/* 오류 메시지 */}
              {phoneError && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-700 text-sm">{phoneError}</p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="password">비밀번호 *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="영문, 숫자 포함 8자리 이상"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* 약관 동의 */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} />
                <label htmlFor="terms" className="text-sm cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    서비스 이용약관
                  </button>
                  에 동의합니다 (필수)
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

              <div className="flex items-start space-x-2">
                <Checkbox id="privacy" checked={agreedToPrivacy} onCheckedChange={setAgreedToPrivacy} />
                <label htmlFor="privacy" className="text-sm cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    개인정보 처리방침
                  </button>
                  에 동의합니다 (필수)
                </label>
              </div>
              {errors.privacy && <p className="text-red-500 text-sm">{errors.privacy}</p>}
            </div>

            {/* 일반 오류 */}
            {errors.general && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            {/* 회원가입 버튼 */}
            <Button type="submit" className="w-full" disabled={isLoading || !phoneVerified}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  회원가입 처리 중...
                </div>
              ) : (
                <>
                  회원가입 완료
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* reCAPTCHA 컨테이너 (숨김) */}
          <div id="recaptcha-container" className="hidden"></div>
        </CardContent>
      </Card>

      {/* 약관 모달들 */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} type="terms" />
      <TermsModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} type="privacy" />
    </div>
  )
}
