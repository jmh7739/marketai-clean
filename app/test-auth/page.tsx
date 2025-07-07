"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, RefreshCw, Database, Smartphone, User } from "lucide-react"
import { testConnections, debugEnvironmentVariables, type ConnectionTestResult } from "@/lib/auth-test"
import PhoneAuthTest from "@/components/PhoneAuthTest"

export default function TestAuthPage() {
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    try {
      const result = await testConnections()
      setTestResult(result)
      console.log("연결 테스트 결과:", result)
    } catch (error) {
      console.error("Test failed:", error)
      setTestResult({
        firebase: {
          connected: false,
          error: "테스트 실행 중 오류가 발생했습니다.",
        },
        supabase: {
          connected: false,
          error: "테스트 실행 중 오류가 발생했습니다.",
        },
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const debugEnvVars = () => {
    const envStatus = debugEnvironmentVariables()
    console.log("환경 변수 상태:", envStatus)
    setShowDebug(true)
  }

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusBadge = (success: boolean) => {
    return <Badge variant={success ? "default" : "destructive"}>{success ? "연결됨" : "실패"}</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">사용자 시스템 테스트</h1>
        <p className="text-muted-foreground">Firebase와 Supabase 연결을 확인하고 사용자 시스템을 테스트합니다.</p>
      </div>

      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connection">연결 테스트</TabsTrigger>
          <TabsTrigger value="phone-auth">사용자 생성 테스트</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-6">
          {/* 연결 상태 테스트 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                연결 상태 테스트
              </CardTitle>
              <CardDescription>Firebase와 Supabase 연결 상태를 확인하고 기본 기능을 테스트합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runTests} disabled={isLoading} className="w-full mb-4">
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    연결 테스트 실행
                  </>
                ) : (
                  "연결 테스트 실행"
                )}
              </Button>

              {testResult && (
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Firebase 결과 */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Firebase 연결 테스트
                        {getStatusBadge(testResult.firebase.connected)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {testResult.firebase.connected ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Firebase 설정이 올바르게 구성되었습니다.
                          </div>
                          <div>
                            <strong>프로젝트 ID:</strong> {testResult.firebase.projectId}
                          </div>
                          <div>
                            <strong>인증 도메인:</strong> {testResult.firebase.authDomain}
                          </div>
                        </div>
                      ) : (
                        <Alert variant="destructive">
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>오류:</strong> {testResult.firebase.error}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {/* Supabase 결과 */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Supabase 연결 테스트
                        {getStatusBadge(testResult.supabase.connected)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {testResult.supabase.connected ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Supabase 연결이 정상적으로 작동합니다.
                          </div>
                          <div>
                            <strong>URL:</strong> {testResult.supabase.url}
                          </div>
                        </div>
                      ) : (
                        <Alert variant="destructive">
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>오류:</strong> {testResult.supabase.error}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 다음 단계 안내 */}
          {testResult && (
            <Card>
              <CardHeader>
                <CardTitle>다음 단계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!testResult.firebase.connected && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Firebase 설정을 확인하세요. 환경 변수와 프로젝트 설정을 점검해주세요.
                    </AlertDescription>
                  </Alert>
                )}

                {!testResult.supabase.connected && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Supabase 연결을 확인하세요. users 테이블이 존재하고 RLS 정책이 올바르게 설정되어 있는지
                      확인해주세요.
                    </AlertDescription>
                  </Alert>
                )}

                {testResult.firebase.connected && testResult.supabase.connected && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      모든 연결이 정상입니다! 이제 전화 인증 기능을 테스트할 수 있습니다.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* 디버그 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>디버그 도구</CardTitle>
              <CardDescription>개발자를 위한 상세한 디버그 정보를 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={debugEnvVars} className="mb-4 bg-transparent">
                환경 변수 상태 확인
              </Button>

              {showDebug && (
                <Alert>
                  <AlertDescription>
                    브라우저 개발자 도구의 Console 탭에서 상세한 환경 변수 정보를 확인하세요.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phone-auth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                사용자 생성 테스트
              </CardTitle>
              <CardDescription>실제 전화번호 인증을 통해 사용자 생성 프로세스를 테스트합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <PhoneAuthTest />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 테스트 데이터 */}
      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle>테스트 데이터</CardTitle>
            <CardDescription>연결 테스트 결과의 상세 정보입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
              {JSON.stringify(
                {
                  firebaseUid: "test-1751354751319",
                  email: "test@example.com",
                  phone: "+821012345678",
                  name: "테스트 사용자",
                },
                null,
                2,
              )}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
