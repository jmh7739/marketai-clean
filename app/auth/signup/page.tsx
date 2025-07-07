"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Loader2, User, Mail, Phone, CheckCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/firebase"
import { updateUser, getUserByFirebaseUid } from "@/lib/supabase-client"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const step = searchParams.get("step") || "info"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
      // 기존 사용자 정보가 있다면 폼에 채우기
      loadUserProfile(user.uid)
    } else {
      // 인증되지 않은 사용자는 전화번호 인증 페이지로 리다이렉트
      router.push("/auth/phone")
    }
  }, [router])

  // 사용자 프로필 로드
  const loadUserProfile = async (firebaseUid: string) => {
    try {
      const result = await getUserByFirebaseUid(firebaseUid)
      if (result.success && result.user) {
        setFormData({
          name: result.user.name || "",
          email: result.user.email || "",
        })
      }
    } catch (error) {
      console.error("사용자 프로필 로드 실패:", error)
    }
  }

  // 폼 데이터 업데이트
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 이메일 형식 검증
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 프로필 정보 저장
  const handleSaveProfile = async () => {
    if (!currentUser) {
      setError("사용자 인증 정보가 없습니다.")
      return
    }

    if (!formData.name.trim()) {
      setError("이름을 입력해주세요.")
      return
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      setError("올바른 이메일 주소를 입력해주세요.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await updateUser(currentUser.uid, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        updated_at: new Date().toISOString(),
      })

      if (result.success) {
        console.log("프로필 정보 저장 성공")
        router.push("/auth/signup?step=complete")
      } else {
        setError(result.error || "프로필 저장에 실패했습니다.")
      }
    } catch (error) {
      console.error("프로필 저장 실패:", error)
      setError("프로필 저장 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // 회원가입 완료
  const handleComplete = () => {
    router.push("/")
  }

  // 진행률 계산
  const getProgress = () => {
    switch (step) {
      case "phone":
        return 33
      case "profile":
        return 66
      case "complete":
        return 100
      default:
        return 0
    }
  }

  // 단계별 아이콘
  const getStepIcon = () => {
    switch (step) {
      case "phone":
        return <Phone className="w-6 h-6 text-blue-600" />
      case "profile":
        return <User className="w-6 h-6 text-blue-600" />
      case "complete":
        return <CheckCircle className="w-6 h-6 text-green-600" />
      default:
        return <Mail className="w-6 h-6 text-blue-600" />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {getStepIcon()}
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === "profile" && "프로필 설정"}
            {step === "complete" && "회원가입 완료"}
          </CardTitle>
          <CardDescription>
            {step === "profile" && "마지막 단계입니다. 기본 정보를 입력해주세요."}
            {step === "complete" && "MarketAI에 오신 것을 환영합니다!"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 진행률 표시 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>진행률</span>
              <span>{getProgress()}%</span>
            </div>
            <Progress value={getProgress()} className="w-full" />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "profile" && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    이름 *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    이메일 *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={!formData.name.trim() || !formData.email.trim() || loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  "프로필 저장"
                )}
              </Button>
            </>
          )}

          {step === "complete" && (
            <>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">회원가입이 완료되었습니다!</h3>
                  <p className="text-gray-600 mt-2">이제 MarketAI의 모든 서비스를 이용하실 수 있습니다.</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-gray-900">다음 단계:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 관심 있는 경매 상품 둘러보기</li>
                  <li>• 판매할 상품 등록하기</li>
                  <li>• 프로필 사진 및 추가 정보 설정</li>
                </ul>
              </div>

              <Button onClick={handleComplete} className="w-full" size="lg">
                MarketAI 시작하기
              </Button>
            </>
          )}

          <div className="text-center text-xs text-gray-500">
            <p>회원가입을 진행하시면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
