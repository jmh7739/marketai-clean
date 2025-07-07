"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Gavel, ArrowLeft, AlertCircle, Eye, EyeOff, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUsers, setCurrentUser } from "@/lib/utils"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("") // 입력 시 에러 메시지 제거
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // 사용자 확인
      const users = getUsers()
      const user = users.find(
        (u) => (u.name === formData.username || u.email === formData.username) && u.password === formData.password,
      )

      if (!user) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.")
        return
      }

      // 로그인 성공
      setCurrentUser(user)
      router.push("/")
    } catch (error: any) {
      console.error("로그인 오류:", error)
      setError("로그인에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인</h1>
          <p className="text-gray-600">계정에 로그인하여 경매에 참여하세요</p>
        </div>

        {/* 로그인 폼 */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center flex items-center justify-center space-x-2">
              <LogIn className="h-5 w-5" />
              <span>계정 로그인</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  아이디 또는 이메일
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="아이디 또는 이메일을 입력하세요"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  비밀번호
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                비밀번호를 잊으셨나요?
              </Link>

              <p className="text-sm text-gray-600">
                아직 계정이 없으신가요?{" "}
                <Link href="/signup" className="text-primary font-medium hover:underline">
                  회원가입
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 추가 정보 */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>로그인하시면 MarketAI의 서비스 약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.</p>
        </div>
      </div>
    </div>
  )
}
