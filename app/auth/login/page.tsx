"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SafeLink from "@/components/SafeLink"
import { useAuth } from "@/contexts/AuthContext"
import { generateId } from "@/lib/utils"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const redirectTo = searchParams.get("redirect") || "/"

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!formData.email || !formData.password) {
        setError("이메일과 비밀번호를 모두 입력해주세요.")
        return
      }

      // 데모 계정 확인
      if (formData.email === "demo@marketai.co.kr" && formData.password === "demo123") {
        const userData = {
          id: "demo-user",
          name: "데모 사용자",
          email: formData.email,
          phone: "010-1234-5678",
          avatar: "",
          createdAt: new Date().toISOString(),
          isVerified: true,
          role: "user" as const,
          status: "active" as const,
          lastLoginAt: new Date().toISOString(),
          preferences: {
            notifications: true,
            marketing: false,
            language: "ko",
          },
        }

        login(userData)
        router.push(redirectTo)
      } else {
        // 일반 로그인 처리 (실제로는 서버 API 호출)
        const userData = {
          id: "user-" + generateId(),
          name: formData.email.split("@")[0],
          email: formData.email,
          phone: "",
          avatar: "",
          createdAt: new Date().toISOString(),
          isVerified: true,
          role: "user" as const,
          status: "active" as const,
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
    } catch (err) {
      setError("로그인에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
          <p className="text-gray-600 mt-2">MarketAI에 오신 것을 환영합니다</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                이메일
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
                  disabled={loading}
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="pl-10 pr-10"
                  disabled={loading}
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

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  로그인 중...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  로그인
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <SafeLink href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                비밀번호를 잊으셨나요?
              </SafeLink>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                아직 계정이 없으신가요?{" "}
                <SafeLink href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                  회원가입하기
                </SafeLink>
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 데모 계정</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>이메일: demo@marketai.co.kr</p>
              <p>비밀번호: demo123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
