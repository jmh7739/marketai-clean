"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"

export default function PhoneAuthPage() {
  const [phone, setPhone] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()
  const { loading, error, sendVerificationCode } = useFirebaseAuth()

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/
    return phoneRegex.test(phone)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePhone(phone)) {
      return
    }

    if (!agreedToTerms) {
      alert("서비스 이용약관에 동의해주세요.")
      return
    }

    const result = await sendVerificationCode(phone)

    if (result.success) {
      // 전화번호를 세션에 저장
      sessionStorage.setItem("verification_phone", phone)
      router.push("/auth/verify")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">전화번호 인증</CardTitle>
          <p className="text-gray-600 mt-2">안전한 거래를 위해 전화번호 인증이 필요합니다</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                전화번호
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                maxLength={13}
                className="mt-1"
                disabled={loading}
              />
              {!validatePhone(phone) && phone.length > 0 && (
                <p className="text-red-500 text-sm mt-1">올바른 전화번호를 입력해주세요</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                <span className="text-blue-600">서비스 이용약관</span> 및{" "}
                <span className="text-blue-600">개인정보 처리방침</span>에 동의합니다.
              </label>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={!validatePhone(phone) || !agreedToTerms || loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  인증번호 발송 중...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  인증번호 받기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>
          </form>

          {/* reCAPTCHA 컨테이너 */}
          <div id="recaptcha-container"></div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🔐 Firebase 인증</h4>
            <p className="text-sm text-blue-700">
              Google Firebase를 통해 안전하게 인증번호가 발송됩니다.
              <br />
              SMS 요금은 무료이며, 개인정보는 안전하게 보호됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
