"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import SafeLink from "@/components/SafeLink"
import { useAuth } from "@/contexts/AuthContext"

export default function SignupPage() {
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

  const redirectTo = searchParams.get("redirect") || "/"

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
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
    if (!formData.phone.trim()) {
      setError("전화번호를 입력해주세요")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      // 더미 회원가입 (실제로는 서버 API 호출)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const user = {
        id: `user_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        isVerified: false,
        createdAt: new Date(),
      }

      login(user)
      router.push(redirectTo)
    } catch (error) {
      setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.")
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
          <p className="text-gray-600 mt-2">새로운 계정을 만들어 경매에 참여하세요</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  disabled={isLoading}
                />
              </div>
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
                <Label htmlFor="agreeTerms" className="text-sm">
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
                <Label htmlFor="agreePrivacy" className="text-sm">
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
                <Label htmlFor="agreeMarketing" className="text-sm">
                  마케팅 정보 수신에 동의합니다 (선택)
                </Label>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  회원가입 중...
                </div>
              ) : (
                "회원가입"
              )}
            </Button>
          </form>

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
