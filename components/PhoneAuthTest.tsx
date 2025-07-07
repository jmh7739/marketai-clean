"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Loader2, Phone, MessageSquare, User, CheckCircle, XCircle, ArrowLeft, RotateCcw } from "lucide-react"
import { usePhoneAuth, type AuthStep } from "@/hooks/usePhoneAuth"

// 단계별 진행률
const getStepProgress = (step: AuthStep): number => {
  switch (step) {
    case "phone":
      return 25
    case "verification":
      return 50
    case "profile":
      return 75
    case "complete":
      return 100
    default:
      return 0
  }
}

// 단계별 제목
const getStepTitle = (step: AuthStep): string => {
  switch (step) {
    case "phone":
      return "전화번호 입력"
    case "verification":
      return "인증 코드 확인"
    case "profile":
      return "프로필 설정"
    case "complete":
      return "인증 완료"
    default:
      return "전화번호 인증"
  }
}

// 단계별 아이콘
const getStepIcon = (step: AuthStep) => {
  switch (step) {
    case "phone":
      return <Phone className="h-5 w-5" />
    case "verification":
      return <MessageSquare className="h-5 w-5" />
    case "profile":
      return <User className="h-5 w-5" />
    case "complete":
      return <CheckCircle className="h-5 w-5" />
    default:
      return <Phone className="h-5 w-5" />
  }
}

export default function PhoneAuthTest() {
  const {
    step,
    phoneNumber,
    verificationCode,
    userName,
    userEmail,
    loading,
    error,
    user,
    initializeRecaptcha,
    sendSMS,
    verifyCode,
    saveUserProfile,
    resetAuth,
    goBack,
    setError,
    formatPhoneNumber,
  } = usePhoneAuth()

  // 로컬 상태
  const [phoneInput, setPhoneInput] = useState("")
  const [codeInput, setCodeInput] = useState("")
  const [nameInput, setNameInput] = useState("")
  const [emailInput, setEmailInput] = useState("")
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false)

  // reCAPTCHA 초기화
  useEffect(() => {
    if (step === "phone" && !recaptchaInitialized) {
      const initRecaptcha = async () => {
        try {
          // DOM이 준비될 때까지 대기
          await new Promise((resolve) => setTimeout(resolve, 100))

          const success = await initializeRecaptcha("recaptcha-container")
          setRecaptchaInitialized(success)

          if (!success) {
            setError("reCAPTCHA 초기화에 실패했습니다. 페이지를 새로고침해주세요.")
          }
        } catch (error) {
          console.error("reCAPTCHA 초기화 오류:", error)
          setError("reCAPTCHA 초기화 중 오류가 발생했습니다.")
        }
      }

      initRecaptcha()
    }
  }, [step, recaptchaInitialized, initializeRecaptcha, setError])

  // 전화번호 입력 처리
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneInput.trim()) {
      setError("전화번호를 입력해주세요.")
      return
    }

    if (!recaptchaInitialized) {
      setError("reCAPTCHA가 초기화되지 않았습니다. 페이지를 새로고침해주세요.")
      return
    }

    await sendSMS(phoneInput)
  }

  // 인증 코드 확인 처리
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!codeInput.trim()) {
      setError("인증 코드를 입력해주세요.")
      return
    }

    if (codeInput.length !== 6) {
      setError("인증 코드는 6자리입니다.")
      return
    }

    await verifyCode(codeInput)
  }

  // 프로필 저장 처리
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nameInput.trim()) {
      setError("이름을 입력해주세요.")
      return
    }

    await saveUserProfile(nameInput, emailInput)
  }

  // 다시 시작
  const handleRestart = () => {
    resetAuth()
    setPhoneInput("")
    setCodeInput("")
    setNameInput("")
    setEmailInput("")
    setRecaptchaInitialized(false)
  }

  // 전화번호 포맷팅
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhoneInput(value)

    // 실시간 포맷팅 미리보기
    if (value.length > 3) {
      const formatted = formatPhoneNumber(value)
      // 포맷팅된 결과를 보여주기 위한 로직 (선택사항)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {getStepIcon(step)}
          {getStepTitle(step)}
        </CardTitle>
        <CardDescription>
          {step === "phone" && "전화번호를 입력하여 SMS 인증을 시작하세요"}
          {step === "verification" && "전송된 6자리 인증 코드를 입력하세요"}
          {step === "profile" && "기본 프로필 정보를 입력하세요"}
          {step === "complete" && "전화번호 인증이 완료되었습니다"}
        </CardDescription>

        {/* 진행률 표시 */}
        <div className="mt-4">
          <Progress value={getStepProgress(step)} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">{getStepProgress(step)}% 완료</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 오류 메시지 */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 단계별 UI */}
        {step === "phone" && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                전화번호
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="010-1234-5678"
                value={phoneInput}
                onChange={handlePhoneInputChange}
                disabled={loading}
                className="text-center"
              />
              <p className="text-xs text-muted-foreground mt-1">
                한국 전화번호를 입력하세요 (자동으로 +82 형식으로 변환됩니다)
              </p>
            </div>

            {/* reCAPTCHA 컨테이너 */}
            <div id="recaptcha-container" className="flex justify-center min-h-[78px]"></div>

            {!recaptchaInitialized && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>reCAPTCHA를 초기화하는 중...</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading || !recaptchaInitialized}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  SMS 전송 중...
                </>
              ) : (
                "인증 코드 전송"
              )}
            </Button>
          </form>
        )}

        {step === "verification" && (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-2">
                인증 코드
              </label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={loading}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">{phoneNumber}로 전송된 6자리 코드를 입력하세요</p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={loading}
                className="flex-1 bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                이전
              </Button>
              <Button type="submit" className="flex-1" disabled={loading || codeInput.length !== 6}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    확인 중...
                  </>
                ) : (
                  "코드 확인"
                )}
              </Button>
            </div>
          </form>
        )}

        {step === "profile" && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                이메일 (선택사항)
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={loading}
              />
            </div>

            <Separator />

            <div className="text-sm text-muted-foreground">
              <p>
                <strong>전화번호:</strong> {phoneNumber}
              </p>
              <p>
                <strong>Firebase UID:</strong> {user?.uid}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={loading}
                className="flex-1 bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                이전
              </Button>
              <Button type="submit" className="flex-1" disabled={loading || !nameInput.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  "프로필 저장"
                )}
              </Button>
            </div>
          </form>
        )}

        {step === "complete" && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-600">인증 완료!</h3>
              <p className="text-muted-foreground">전화번호 인증이 성공적으로 완료되었습니다.</p>
            </div>

            <div className="bg-muted p-4 rounded-lg text-left">
              <h4 className="font-medium mb-2">사용자 정보</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>이름:</strong> {userName}
                </p>
                <p>
                  <strong>전화번호:</strong> {phoneNumber}
                </p>
                {userEmail && (
                  <p>
                    <strong>이메일:</strong> {userEmail}
                  </p>
                )}
                <p>
                  <strong>Firebase UID:</strong> {user?.uid}
                </p>
              </div>
            </div>

            <Button onClick={handleRestart} variant="outline" className="w-full bg-transparent">
              <RotateCcw className="mr-2 h-4 w-4" />
              다시 테스트하기
            </Button>
          </div>
        )}

        {/* 현재 상태 정보 (개발용) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">개발 정보</h4>
            <div className="text-xs space-y-1">
              <p>
                <strong>현재 단계:</strong> {step}
              </p>
              <p>
                <strong>로딩 상태:</strong> {loading ? "예" : "아니오"}
              </p>
              <p>
                <strong>reCAPTCHA 초기화:</strong> {recaptchaInitialized ? "완료" : "대기 중"}
              </p>
              {phoneNumber && (
                <p>
                  <strong>전화번호:</strong> {phoneNumber}
                </p>
              )}
              {user && (
                <p>
                  <strong>Firebase UID:</strong> {user.uid}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
