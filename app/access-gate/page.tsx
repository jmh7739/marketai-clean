"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Eye, EyeOff, Shield, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ALLOWED_PASSWORDS = ["marketai2024!", "admin123!@#", "test2024", "beta-access"]

const ALLOWED_IPS = [
  // 여기에 허용할 IP 주소들을 추가하세요
  "127.0.0.1",
  "::1",
]

export default function AccessGate() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // 비밀번호 확인
      if (!ALLOWED_PASSWORDS.includes(password)) {
        setError("잘못된 비밀번호입니다.")
        setIsLoading(false)
        return
      }

      // 세션에 액세스 토큰 저장
      sessionStorage.setItem("access_granted", "true")
      sessionStorage.setItem("access_time", new Date().toISOString())

      // 쿠키에도 저장 (24시간 유효)
      document.cookie = `access_granted=true; max-age=86400; path=/; secure; samesite=strict`

      // 메인 페이지로 리다이렉트
      router.push("/")
    } catch (error) {
      setError("접근 권한 확인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">MarketAI</CardTitle>
          <p className="text-gray-600 mt-2">베타 테스트 접근</p>
        </CardHeader>

        <CardContent>
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Lock className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-yellow-800 text-sm">
                <p className="font-medium">제한된 접근</p>
                <p className="mt-1">현재 베타 테스트 중입니다. 승인된 사용자만 접근 가능합니다.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">접근 비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="pr-10"
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

            <Button type="submit" className="w-full" disabled={isLoading || !password}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  확인 중...
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  접근하기
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-gray-500">접근 권한이 필요하시면 관리자에게 문의하세요</p>
            <p className="text-xs text-gray-400 mt-1">© 2024 MarketAI. All rights reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
