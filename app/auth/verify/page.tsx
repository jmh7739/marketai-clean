"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, ArrowLeft, RotateCcw, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import { useAuth } from "@/contexts/AuthContext"

export default function VerifyPage() {
  const [code, setCode] = useState("")
  const [phone, setPhone] = useState("")
  const [timeLeft, setTimeLeft] = useState(180) // 3분
  const [canResend, setCanResend] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const { loading, error, sendVerificationCode, verifyCode, confirmationResult } = useFirebaseAuth()
  const { login } = useAuth()

  useEffect(() => {
    const savedPhone = sessionStorage.getItem("verification_phone")
    if (!savedPhone) {
      router.push("/auth/phone")
      return
    }
    setPhone(savedPhone)

    // 인증번호 요청이 없으면 전화번호 입력 페이지로
    if (!confirmationResult) {
      router.push("/auth/phone")
      return
    }

    // 타이머 시작
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // 30초 후 재전송 가능
    const resendTimer = setTimeout(() => {
      setCanResend(true)
    }, 30000)

    return () => {
      clearInterval(timer)
      clearTimeout(resendTimer)
    }
  }, [router, confirmationResult])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "").slice(0, 6)
    setCode(value)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (code.length !== 6) {
      return
    }

    const result = await verifyCode(code)

    if (result.success && result.user) {
      setSuccess(true)

      // 사용자 정보 생성
      const user = {
        id: result.user.uid,
        phone: phone,
        name: "", // 프로필 설정에서 입력
        email: result.user.email || "",
        createdAt: new Date().toISOString(),
      }

      // 인증 성공 처리
      login(user)

      // 프로필 설정 페이지로 이동
      setTimeout(() => {
        router.push("/auth/profile")
      }, 1500)
    } else {
      setAttempts((prev) => prev + 1)
      if (attempts >= 4) {
        setTimeout(() => {
          router.push("/auth/phone")
        }, 2000)
      }
      setCode("")
    }
  }

  const handleResend = async () => {
    setCanResend(false)
    setTimeLeft(180)
    setCode("")
    setAttempts(0)

    await sendVerificationCode(phone)

    // 타이머 재시작
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    setTimeout(() => {
      setCanResend(true)
    }, 30000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">인증 완료!</h2>
            <p className="text-green-700">전화번호 인증이 성공적으로 완료되었습니다.</p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-sm text-green-600 mt-2">프로필 설정 페이지로 이동 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">인증번호 확인</CardTitle>
          <p className="text-gray-600 mt-2">{phone}로 발송된 인증번호를 입력해주세요</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <Label htmlFor="code" className="text-sm font-medium">
                인증번호 6자리
              </Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="123456"
                maxLength={6}
                className="mt-1 text-center text-2xl font-mono tracking-widest"
                disabled={loading || timeLeft === 0}
              />
            </div>

            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">
                  남은 시간: <span className="font-mono font-bold text-red-500">{formatTime(timeLeft)}</span>
                </p>
              ) : (
                <p className="text-sm text-red-500">인증 시간이 만료되었습니다</p>
              )}
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-700 text-sm">
                  {error} {attempts > 0 && `(${5 - attempts}회 남음)`}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button type="submit" className="w-full" disabled={code.length !== 6 || loading || timeLeft === 0}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    인증 확인 중...
                  </div>
                ) : (
                  "인증 완료"
                )}
              </Button>

              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => router.push("/auth/phone")} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  이전
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={!canResend || loading}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  재전송
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📱 인증번호 확인</h4>
            <p className="text-sm text-blue-700">
              SMS로 발송된 6자리 인증번호를 입력해주세요.
              <br />
              인증번호가 오지 않으면 재전송을 눌러주세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
