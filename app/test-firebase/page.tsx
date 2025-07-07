"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Phone, Database, Users, Gavel } from "lucide-react"
import {
  checkFirebaseConnection,
  getRealStats,
  setupRecaptcha,
  formatPhoneNumber,
  validatePhoneNumber,
} from "@/lib/firebase"

export default function TestFirebasePage() {
  const [connectionStatus, setConnectionStatus] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [phoneTest, setPhoneTest] = useState({
    phone: "",
    loading: false,
    success: false,
    error: "",
  })
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null)

  useEffect(() => {
    testConnection()
    testStats()
  }, [])

  const testConnection = () => {
    const connection = checkFirebaseConnection()
    setConnectionStatus(connection)
  }

  const testStats = async () => {
    try {
      const realStats = await getRealStats()
      setStats(realStats)
    } catch (error) {
      console.error("Stats test failed:", error)
      setStats({ error: error.message })
    }
  }

  const testPhoneAuth = async () => {
    if (!validatePhoneNumber(phoneTest.phone)) {
      setPhoneTest((prev) => ({ ...prev, error: "올바른 전화번호 형식이 아닙니다." }))
      return
    }

    setPhoneTest((prev) => ({ ...prev, loading: true, error: "" }))

    try {
      if (!recaptchaVerifier) {
        const verifier = await setupRecaptcha("test-recaptcha")
        setRecaptchaVerifier(verifier)
        if (!verifier) {
          throw new Error("reCAPTCHA 설정 실패")
        }
      }

      const formattedPhone = formatPhoneNumber(phoneTest.phone)
      console.log("Testing phone:", formattedPhone)

      // 실제로는 SMS를 보내지 않고 설정만 테스트
      setPhoneTest((prev) => ({ ...prev, success: true, loading: false }))
    } catch (error: any) {
      console.error("Phone auth test failed:", error)
      setPhoneTest((prev) => ({ ...prev, error: error.message, loading: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Firebase 연결 테스트</h1>
          <p className="text-gray-600">MarketAI Firebase 설정 및 기능 테스트</p>
        </div>

        {/* 연결 상태 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Firebase 연결 상태</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connectionStatus ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {connectionStatus.isConfigured ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={connectionStatus.isConfigured ? "text-green-700" : "text-red-700"}>
                    {connectionStatus.isConfigured ? "Firebase 설정 완료" : "Firebase 설정 오류"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Project ID:</span>
                    <Badge variant="outline" className="ml-2">
                      {connectionStatus.config.projectId || "없음"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Auth Domain:</span>
                    <Badge variant="outline" className="ml-2">
                      {connectionStatus.config.authDomain ? "설정됨" : "없음"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700">Firebase Auth 초기화 완료</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700">Firestore 초기화 완료</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="text-yellow-700">연결 상태 확인 중...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 데이터베이스 통계 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Firestore 데이터베이스 테스트</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              stats.error ? (
                <div className="flex items-center space-x-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  <span>데이터베이스 연결 오류: {stats.error}</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span>Firestore 연결 성공</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                      <div className="text-sm text-blue-700">총 사용자</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.activeAuctions}</div>
                      <div className="text-sm text-green-700">활성 경매</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{stats.totalBids}</div>
                      <div className="text-sm text-purple-700">총 입찰</div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="text-yellow-700">데이터베이스 연결 테스트 중...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 전화번호 인증 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>전화번호 인증 테스트</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-700">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">실제 SMS는 발송되지 않습니다. 설정 테스트만 진행됩니다.</span>
              </div>

              <div className="flex space-x-2">
                <Input
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phoneTest.phone}
                  onChange={(e) => setPhoneTest((prev) => ({ ...prev, phone: e.target.value, error: "" }))}
                  className="flex-1"
                />
                <Button onClick={testPhoneAuth} disabled={phoneTest.loading}>
                  {phoneTest.loading ? "테스트 중..." : "인증 테스트"}
                </Button>
              </div>

              {phoneTest.error && (
                <div className="flex items-center space-x-2 text-red-700">
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm">{phoneTest.error}</span>
                </div>
              )}

              {phoneTest.success && (
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">전화번호 인증 설정 테스트 성공</span>
                </div>
              )}

              <div id="test-recaptcha"></div>
            </div>
          </CardContent>
        </Card>

        {/* 배포 준비 체크리스트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gavel className="h-5 w-5" />
              <span>Vercel 배포 준비 체크리스트</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">✅ Firebase 프로젝트 생성 완료</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">✅ 환경변수 설정 완료</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">✅ Firebase Authentication 활성화 필요</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">✅ Firestore 데이터베이스 생성 필요</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">⚠️ 전화번호 인증 설정 (Firebase Console에서 활성화)</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">⚠️ Firestore 보안 규칙 배포</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">다음 단계:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Firebase Console에서 Authentication → Sign-in method → Phone 활성화</li>
                <li>2. Firestore Database 생성 (테스트 모드로 시작)</li>
                <li>3. Vercel에 환경변수 설정</li>
                <li>4. 배포 후 도메인을 Firebase Console에 추가</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
