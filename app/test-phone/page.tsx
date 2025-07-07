"use client"

import { useState } from "react"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TestPhonePage() {
  const [phone, setPhone] = useState("010-3185-5620")
  const [code, setCode] = useState("")
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const [message, setMessage] = useState("")

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      ;(window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        callback: () => console.log("reCAPTCHA solved"),
      })
    }
  }

  const sendCode = async () => {
    try {
      setupRecaptcha()
      const formattedPhone = "+8210" + phone.replace(/[^0-9]/g, "").substring(3)
      console.log("Sending to:", formattedPhone)

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, (window as any).recaptchaVerifier)
      setConfirmationResult(confirmation)
      setMessage("인증번호가 발송되었습니다!")
    } catch (error: any) {
      console.error("Error:", error)
      setMessage(`오류: ${error.message}`)
    }
  }

  const verifyCode = async () => {
    try {
      if (confirmationResult) {
        await confirmationResult.confirm(code)
        setMessage("인증 성공!")
      }
    } catch (error: any) {
      setMessage(`인증 실패: ${error.message}`)
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">전화번호 인증 테스트</h1>

      <div className="space-y-4">
        <div>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" />
          <Button onClick={sendCode} className="mt-2 w-full">
            인증번호 발송
          </Button>
        </div>

        <div id="recaptcha-container"></div>

        {confirmationResult && (
          <div>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="인증번호 6자리" maxLength={6} />
            <Button onClick={verifyCode} className="mt-2 w-full">
              인증 확인
            </Button>
          </div>
        )}

        {message && <div className="p-3 bg-blue-50 border border-blue-200 rounded">{message}</div>}
      </div>
    </div>
  )
}
