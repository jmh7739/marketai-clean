"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Gavel, ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { generateId, saveUser, getUsers, setCurrentUser } from "@/lib/utils"
// Firebase 관련 헬퍼를 단일 모듈에서 가져오도록 경로 수정
import { setupRecaptcha, sendPhoneVerification, verifyPhoneCode, checkFirebaseConnection } from "@/lib/firebase"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [verificationCode, setVerificationCode] = useState("")
  const [sentCode, setSentCode] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const router = useRouter()
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null)
  const [confirmationResult, setConfirmationResult] = useState<any>(null)

  // 카운트다운 타이머
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("") // 입력 시 에러 메시지 제거

    // 전화번호가 변경되면 인증 상태 초기화
    if (name === "phone") {
      setIsCodeSent(false)
      setIsPhoneVerified(false)
      setVerificationCode("")
      setSentCode("")
    }
  }

  const handleAgreementChange = (key: keyof typeof agreements) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const validatePhoneNumber = () => {
    if (!formData.phone.trim()) {
      setError("전화번호를 입력해주세요.")
      return false
    }

    const phoneRegex = /^010-\d{4}-\d{4}$/
    if (!phoneRegex.test(formData.phone)) {
      setError("전화번호는 010-0000-0000 형식으로 입력해주세요.")
      return false
    }

    // 중복 확인
    const existingUsers = getUsers()
    if (existingUsers.some((user) => user.phone === formData.phone)) {
      setError("이미 사용중인 전화번호입니다.")
      return false
    }

    return true
  }

  const handleSendCode = async () => {
    if (!validatePhoneNumber()) {
      setError("전화번호는 010-0000-0000 형식으로 입력해주세요.")
      return
    }

    // 중복 확인
    const existingUsers = getUsers()
    if (existingUsers.some((user) => user.phone === formData.phone)) {
      setError("이미 사용중인 전화번호입니다.")
      return
    }

    // Firebase 가 사용 가능한지 먼저 확인
    const { isAvailable } = checkFirebaseConnection()
    if (!isAvailable) {
      setError("⚠️ SMS 인증 기능이 아직 설정되지 않았습니다.\nFirebase Phone Auth를 활성화한 뒤 다시 시도해주세요.")
      return
    }

    setSendingCode(true)
    setError("")

    try {
      // reCAPTCHA 설정
      if (!recaptchaVerifier) {
        const verifier = await setupRecaptcha("recaptcha-container")
        if (!verifier) {
          throw new Error("reCAPTCHA 설정에 실패했습니다.")
        }
        setRecaptchaVerifier(verifier)

        // 실제 Firebase SMS 발송
        const confirmationResult = await sendPhoneVerification(formData.phone, verifier)
        setConfirmationResult(confirmationResult)
        setIsCodeSent(true)
        setCountdown(180) // 3분 카운트다운

        console.log("실제 SMS가 발송되었습니다!")
      }
    } catch (error: any) {
      console.error("SMS 발송 오류:", error)
      setError(error.message || "SMS 발송에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    const { isAvailable } = checkFirebaseConnection()
    if (!isAvailable) {
      setError("Firebase 설정이 완료되지 않았습니다.")
      return
    }

    if (!verificationCode || verificationCode.length !== 6) {
      setError("6자리 인증번호를 입력해주세요.")
      return
    }

    if (!confirmationResult) {
      setError("먼저 인증번호를 요청해주세요.")
      return
    }

    setVerifyingCode(true)
    setError("")

    try {
      // 실제 Firebase 인증번호 확인
      const result = await verifyPhoneCode(confirmationResult, verificationCode)
      console.log("전화번호 인증 성공:", result)

      setIsPhoneVerified(true)
      setError("")
      alert("전화번호 인증이 완료되었습니다!")
    } catch (error: any) {
      console.error("인증번호 확인 오류:", error)
      setError("인증번호가 올바르지 않습니다.")
    } finally {
      setVerifyingCode(false)
    }
  }

  const validateForm = () => {
    // 필수 필드 검증
    if (!formData.username.trim()) {
      setError("아이디를 입력해주세요.")
      return false
    }

    if (formData.username.length < 4) {
      setError("아이디는 4자 이상이어야 합니다.")
      return false
    }

    if (!formData.email.trim()) {
      setError("이메일을 입력해주세요.")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("올바른 이메일 형식을 입력해주세요.")
      return false
    }

    if (!isPhoneVerified) {
      setError("전화번호 인증을 완료해주세요.")
      return false
    }

    if (!formData.password) {
      setError("비밀번호를 입력해주세요.")
      return false
    }

    if (formData.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return false
    }

    // 필수 약관 동의 확인
    if (!agreements.terms || !agreements.privacy) {
      setError("필수 약관에 동의해주세요.")
      return false
    }

    // 중복 확인
    const existingUsers = getUsers()
    if (existingUsers.some((user) => user.email === formData.email)) {
      setError("이미 사용중인 이메일입니다.")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      // 새 사용자 생성
      const newUser = {
        id: generateId(),
        name: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password, // 실제 서비스에서는 해시화 필요
        avatar: "",
        joinDate: new Date().toISOString(),
        verified: true, // 전화번호 인증 완료
        rating: 5.0,
        totalSales: 0,
        totalPurchases: 0,
        preferences: [],
      }

      // 사용자 저장
      saveUser(newUser)
      setCurrentUser(newUser)

      setSuccess(true)

      // 3초 후 홈으로 이동
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error: any) {
      console.error("회원가입 오류:", error)
      setError("회원가입에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // 성공 페이지
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">회원가입 완료!</h2>
              <p className="text-gray-600 mb-4">
                환영합니다! {formData.username}님
                <br />
                전화번호 인증이 완료되었습니다.
                <br />
                MarketAI에 성공적으로 가입되었습니다.
              </p>
              <p className="text-sm text-gray-500">잠시 후 홈페이지로 이동합니다...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 및 헤더 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-5 w-5" />
            <span>홈으로 돌아가기</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
              <Gavel className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">MarketAI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">MarketAI에 가입하여 경매에 참여하세요</p>
        </div>

        {/* 회원가입 폼 */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">계정 만들기</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 아이디 */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  아이디 *
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="4자 이상의 아이디를 입력하세요"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  disabled={loading}
                />
              </div>

              {/* 이메일 */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  이메일 *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  disabled={loading}
                />
              </div>

              {/* 전화번호 + 인증번호 받기 */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  전화번호 *
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="010-1234-5678"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="flex-1"
                    disabled={loading || isPhoneVerified}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendCode}
                    disabled={sendingCode || !formData.phone || countdown > 0 || isPhoneVerified}
                    className="whitespace-nowrap bg-transparent"
                  >
                    {sendingCode
                      ? "발송중..."
                      : countdown > 0
                        ? `${formatTime(countdown)}`
                        : isPhoneVerified
                          ? "인증완료"
                          : "인증번호"}
                  </Button>
                </div>
                {isPhoneVerified && (
                  <p className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    전화번호 인증이 완료되었습니다.
                  </p>
                )}
              </div>

              {/* reCAPTCHA 컨테이너 */}
              <div id="recaptcha-container" className="flex justify-center mt-4"></div>

              {/* 인증번호 입력 (인증번호 발송 후에만 표시) */}
              {isCodeSent && !isPhoneVerified && (
                <div className="space-y-2">
                  <label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
                    인증번호 *
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="6자리 인증번호"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                      className="flex-1"
                      disabled={verifyingCode}
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={verifyingCode || verificationCode.length !== 6}
                      className="whitespace-nowrap"
                    >
                      {verifyingCode ? "확인중..." : "인증확인"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">{formData.phone}로 발송된 6자리 인증번호를 입력하세요.</p>
                </div>
              )}

              {/* 비밀번호 */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  비밀번호 *
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="6자 이상의 비밀번호"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  비밀번호 확인 *
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-600">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>

              {/* 약관 동의 */}
              <div className="space-y-3 pt-4 border-t">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreements.terms}
                      onChange={() => handleAgreementChange("terms")}
                      className="rounded border-gray-300"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700">
                      <span className="text-red-500">*</span> 서비스 이용약관에 동의합니다
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreements.privacy}
                      onChange={() => handleAgreementChange("privacy")}
                      className="rounded border-gray-300"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700">
                      <span className="text-red-500">*</span> 개인정보 처리방침에 동의합니다
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreements.marketing}
                      onChange={() => handleAgreementChange("marketing")}
                      className="rounded border-gray-300"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700">마케팅 정보 수신에 동의합니다 (선택)</span>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !isPhoneVerified}>
                {loading ? "가입 중..." : "회원가입"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  로그인
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 추가 정보 */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>회원가입 시 MarketAI의 서비스 약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.</p>
        </div>
      </div>
    </div>
  )
}
