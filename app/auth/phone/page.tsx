"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Phone, Shield } from "lucide-react"
import { usePhoneAuth } from "@/hooks/usePhoneAuth"
import { upsertUser } from "@/lib/supabase-client"

export default function PhoneAuthPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [step, setStep] = useState<"phone" | "verify">("phone")

  const { verificationCode, setVerificationCode, loading, error, smsSent, sendSMS, verifyCode } = usePhoneAuth()

  // 전화번호 형식 검증
  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/
    return phoneRegex.test(phone.replace(/[^0-9]/g, ""))
  }

  // SMS 전송 처리
  const handleSendSMS = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      return
    }

    try {
      await sendSMS(phoneNumber)
      setStep("verify")
    } catch (error) {
      console.error("SMS 전송 실패:", error)
    }
  }

  // 인증번호 확인 처리
  const handleVerifyCode = async () => {
    const result = await verifyCode()

    if (result.success && result.user) {
      try {
        // Supabase에 사용자 정보 저장
        const userResult = await upsertUser({
          firebase_uid: result.user.uid,
          phone: phoneNumber,
          phone_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (userResult.success) {
          console.log("사용자 정보 저장 성공")
          router.push("/auth/signup?step=profile")
        } else {
          console.error("사용자 정보 저장 실패:", userResult.error)
        }
      } catch (error) {
        console.error("사용자 정보 저장 중 오류:", error)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {step === "phone" ? (
              <Phone className="w-6 h-6 text-blue-600" />
            ) : (
              <Shield className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">{step === "phone" ? "전화번호 인증" : "인증번호 확인"}</CardTitle>
          <CardDescription>
            {step === "phone"
              ? "안전한 거래를 위해 전화번호 인증이 필요합니다"
              : `${phoneNumber}로 전송된 인증번호를 입력해주세요`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "phone" ? (
            <>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  전화번호
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-center text-lg"
                />
                <p className="text-xs text-gray-500 text-center">
                  하이픈(-) 없이 숫자만 입력하거나 하이픈을 포함하여 입력하세요
                </p>
              </div>

              <Button
                onClick={handleSendSMS}
                disabled={!isValidPhoneNumber(phoneNumber) || loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    인증번호 전송 중...
                  </>
                ) : (
                  "인증번호 전송"
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium text-gray-700">
                  인증번호 (6자리)
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep("phone")} className="flex-1">
                  이전
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6 || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      확인 중...
                    </>
                  ) : (
                    "인증 완료"
                  )}
                </Button>
              </div>

              <div className="text-center">
                <Button variant="link" onClick={handleSendSMS} disabled={loading} className="text-sm">
                  인증번호 재전송
                </Button>
              </div>
            </>
          )}

          {/* reCAPTCHA 컨테이너 */}
          <div id="recaptcha-container"></div>

          <div className="text-center text-xs text-gray-500">
            <p>인증번호가 오지 않나요?</p>
            <p>스팸 차단 설정을 확인하거나 잠시 후 다시 시도해주세요.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
