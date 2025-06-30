"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { usePhoneAuth } from "@/hooks/usePhoneAuth"
import { saveUser, setCurrentUser, generateId } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@/types"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { sendVerificationCode, verifyCode, loading, error } = usePhoneAuth()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  })
  const [verificationCode, setVerificationCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.phoneNumber) {
      toast({
        title: "오류",
        description: "전화번호를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      await sendVerificationCode(formData.phoneNumber)
      setCodeSent(true)
      toast({
        title: "인증번호 발송",
        description: "입력하신 전화번호로 인증번호를 발송했습니다.",
      })
    } catch (error) {
      toast({
        title: "오류",
        description: "인증번호 발송에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationCode) {
      toast({
        title: "오류",
        description: "인증번호를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      await verifyCode(verificationCode)
      setStep(2)
      toast({
        title: "인증 완료",
        description: "전화번호 인증이 완료되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류",
        description: "인증번호가 올바르지 않습니다.",
        variant: "destructive",
      })
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.email || !formData.name || !formData.password) {
      toast({
        title: "오류",
        description: "모든 필수 정보를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "오류",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      toast({
        title: "오류",
        description: "필수 약관에 동의해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      const newUser: User = {
        id: generateId(),
        email: formData.email,
        name: formData.name,
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
          <CardDescription className="text-center">MarketAI에서 경매를 시작해보세요</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <form onSubmit={codeSent ? handleVerifyCode : handleSendCode} className="space-y-4">
              <div>
                <Label htmlFor="phoneNumber">전화번호</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={codeSent}
                  required
                />
              </div>

              {codeSent && (
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
                </div>
              )}

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "처리중..." : codeSent ? "인증번호 확인" : "인증번호 발송"}
              </Button>

              <div id="recaptcha-container" />
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSignup} className="space-y-4">
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
                    <span className="text-red-500">*</span> 이용약관에 동의합니다
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onCheckedChange={(checked) => handleCheckboxChange("agreePrivacy", checked as boolean)}
                  />
                  <Label htmlFor="agreePrivacy" className="text-sm">
                    <span className="text-red-500">*</span> 개인정보처리방침에 동의합니다
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onCheckedChange={(checked) => handleCheckboxChange("agreeMarketing", checked as boolean)}
                  />
                  <Label htmlFor="agreeMarketing" className="text-sm">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                회원가입 완료
              </Button>
            </form>
          )}

          <div className="text-center">
            <span className="text-sm text-gray-600">이미 계정이 있으신가요? </span>
            <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
