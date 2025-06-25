"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Camera, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

export default function ProfilePage() {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [phone, setPhone] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  useEffect(() => {
    // 인증 확인
    const phoneVerified = sessionStorage.getItem("phone_verified")
    const savedPhone = sessionStorage.getItem("verification_phone")

    if (!phoneVerified || !savedPhone) {
      router.push("/auth/phone")
      return
    }

    setPhone(savedPhone)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("이름을 입력해주세요")
      return
    }

    if (name.trim().length < 2) {
      setError("이름은 2글자 이상 입력해주세요")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 사용자 객체 생성
      const user = {
        id: `user_${Date.now()}`,
        phone,
        name: name.trim(),
        isVerified: true,
        createdAt: new Date(),
      }

      // 로그인 처리
      login(user)

      // 세션 정리
      sessionStorage.removeItem("verification_phone")
      sessionStorage.removeItem("phone_verified")

      // 메인 페이지로 이동
      router.push("/")
    } catch (error) {
      setError("프로필 설정 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold">프로필 설정</CardTitle>
          <p className="text-gray-600 mt-2">마지막 단계입니다! 기본 정보를 입력해주세요</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 프로필 이미지 (추후 구현) */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <Button type="button" variant="outline" size="sm" disabled>
                프로필 사진 (추후 추가)
              </Button>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                인증된 전화번호
              </Label>
              <Input id="phone" type="text" value={phone} disabled className="mt-1 bg-gray-50" />
              <div className="flex items-center mt-1">
                <Check className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">인증 완료</span>
              </div>
            </div>

            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                이름 *
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError("")
                }}
                placeholder="실명을 입력해주세요"
                maxLength={20}
                className="mt-1"
                disabled={isLoading}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={!name.trim() || isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  계정 생성 중...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Check className="w-4 h-4 mr-2" />
                  가입 완료
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🎉 거의 완료!</h4>
            <p className="text-sm text-blue-700">가입이 완료되면 MarketAI의 모든 기능을 이용하실 수 있습니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
