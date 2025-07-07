"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { testFirebaseConnection, testPhoneAuth } from "@/lib/firebase-test"

export default function TestPage() {
  const [phoneNumber, setPhoneNumber] = useState("+82")
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const addTestResult = (result: any) => {
    setTestResults((prev) => [...prev, { ...result, timestamp: new Date().toLocaleTimeString() }])
  }

  const handleFirebaseTest = async () => {
    setLoading(true)
    const result = await testFirebaseConnection()
    addTestResult({ test: "Firebase 연결", ...result })
    setLoading(false)
  }

  const handlePhoneAuthTest = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      addTestResult({
        test: "전화번호 인증",
        success: false,
        error: "올바른 전화번호를 입력하세요",
      })
      return
    }

    setLoading(true)
    const result = await testPhoneAuth(phoneNumber)
    addTestResult({ test: "전화번호 인증", ...result })
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">MarketAI 시스템 테스트</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Firebase 연결 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>🔥 Firebase 연결 테스트</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleFirebaseTest} disabled={loading} className="w-full">
              {loading ? "테스트 중..." : "Firebase 연결 확인"}
            </Button>
          </CardContent>
        </Card>

        {/* 전화번호 인증 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>📱 전화번호 인증 테스트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="tel"
              placeholder="+82 10 1234 5678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button onClick={handlePhoneAuthTest} disabled={loading} className="w-full">
              {loading ? "발송 중..." : "인증번호 발송"}
            </Button>
            <div id="recaptcha-container"></div>
          </CardContent>
        </Card>
      </div>

      {/* 테스트 결과 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📊 테스트 결과</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">아직 테스트 결과가 없습니다.</p>
            ) : (
              testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border ${
                    result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <strong>{result.test}</strong>
                      <p className={result.success ? "text-green-700" : "text-red-700"}>
                        {result.success ? "✅ 성공" : "❌ 실패"}
                      </p>
                      {result.message && <p className="text-sm">{result.message}</p>}
                      {result.error && (
                        <p className="text-sm text-red-600">오류: {result.error.message || result.error}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* 다음 단계 안내 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🎯 다음 단계</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Firebase 연결 테스트 통과</li>
            <li>실제 휴대폰 번호로 인증번호 발송 테스트</li>
            <li>인증번호 입력 및 로그인 완료 테스트</li>
            <li>상품 등록 기능 테스트</li>
            <li>실시간 경매 기능 테스트</li>
            <li>베타 테스터 모집 시작</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
