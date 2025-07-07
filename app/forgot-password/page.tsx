"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Gavel, ArrowLeft, AlertCircle, CheckCircle, Mail } from "lucide-react"
import Link from "next/link"
import { resetPassword } from "@/lib/supabase"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (error: any) {
      console.error("비밀번호 재설정 오류:", error)
      setError(error.message || "비밀번호 재설정에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">이메일을 확인하세요</h2>
              <p className="text-gray-600 mb-4">
                비밀번호 재설정 링크를 <strong>{email}</strong>로 보내드렸습니다.
                <br />
                이메일을 확인하여 비밀번호를 재설정해주세요.
              </p>
              <div className="flex flex-col space-y-2">
                <Link href="/login">
                  <Button className="w-full">로그인 페이지로 돌아가기</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSuccess(false)
                    setEmail("")
                  }}
                  className="w-full bg-transparent"
                >
                  다른 이메일로 재시도
                </Button>
              </div>
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
          <Link href="/login" className="inline-flex items-center space-x-2 mb-4 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-5 w-5" />
            <span>로그인으로 돌아가기</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
              <Gavel className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">MarketAI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">비밀번호 찾기</h1>
          <p className="text-gray-600">가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다</p>
        </div>

        {/* 비밀번호 재설정 폼 */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center flex items-center justify-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>이메일 입력</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  이메일 주소
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="가입하신 이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || !email}>
                {loading ? "전송 중..." : "비밀번호 재설정 링크 보내기"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                계정이 기억나셨나요?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  로그인
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 추가 정보 */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>이메일이 도착하지 않으면 스팸 폴더를 확인해주세요.</p>
        </div>
      </div>
    </div>
  )
}
