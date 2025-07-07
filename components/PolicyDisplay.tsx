"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, TrendingUp, Users } from "lucide-react"
import { SERVICE_POLICIES } from "@/lib/service-policies"

export default function PolicyDisplay() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">MarketAI 서비스 정책</h1>
        <p className="text-gray-600">안전하고 투명한 경매 플랫폼을 위한 운영 정책</p>
      </div>

      <Tabs defaultValue="fees" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fees">수수료 정책</TabsTrigger>
          <TabsTrigger value="rules">운영 규칙</TabsTrigger>
          <TabsTrigger value="support">고객 지원</TabsTrigger>
          <TabsTrigger value="growth">성장 전략</TabsTrigger>
        </TabsList>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                수수료 구조
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600 mb-4">
                  * 판매자가 수수료를 부담하며, 낙찰 후 정산시 차감됩니다
                </div>
                {[
                  { range: "1만원 미만", rate: "15%" },
                  { range: "1만원 이상 3만원 미만", rate: "12%" },
                  { range: "3만원 이상 5만원 미만", rate: "10%" },
                  { range: "5만원 이상 10만원 미만", rate: "8%" },
                  { range: "10만원 이상 20만원 미만", rate: "7%" },
                  { range: "20만원 이상 30만원 미만", rate: "6%" },
                  { range: "30만원 이상 50만원 미만", rate: "5.5%" },
                  { range: "50만원 이상 100만원 미만", rate: "5%" },
                  { range: "100만원 이상 200만원 미만", rate: "4.5%" },
                  { range: "200만원 이상 500만원 미만", rate: "4%" },
                  { range: "500만원 이상 1000만원 미만", rate: "3.5%" },
                  { range: "1000만원 이상", rate: "3%" },
                ].map((tier, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{tier.range}</span>
                    <Badge variant="secondary">{tier.rate}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  금지 품목
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {SERVICE_POLICIES.PROHIBITED_ITEMS.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  사기 방지 대책
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">AI 기반 사기 탐지</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• 이상 거래 패턴 자동 탐지</li>
                      <li>• 이미지 중복 검사</li>
                      <li>• 가격 이상치 탐지</li>
                      <li>• 사용자 행동 분석</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">제재 단계</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• 1단계: 경고 (3회시 정지)</li>
                      <li>• 2단계: 7일 정지</li>
                      <li>• 3단계: 영구 정지</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                고객 지원 체계
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">이메일 지원</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>이메일: support@marketai.com</p>
                    <p>접수: 24시간</p>
                    <p>응답: 평일 24시간, 주말 48시간 이내</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">FAQ 자동 해결</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>일반 문의 85% 즉시 해결</p>
                    <p>주 1회 업데이트</p>
                    <p>24시간 이용 가능</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Phase 1 (첫 달)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>목표 가입자</span>
                    <Badge>100명</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>목표 거래</span>
                    <Badge>50건</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">주요 전략</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• 지인 네트워크 활용</li>
                      <li>• 소셜미디어 홍보</li>
                      <li>• 커뮤니티 마케팅</li>
                      <li>• 초기 사용자 인센티브</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phase 2 (2-3개월)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>목표 가입자</span>
                    <Badge>500명</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>목표 거래</span>
                    <Badge>200건</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">주요 전략</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• 추천인 제도</li>
                      <li>• 인플루언서 협업</li>
                      <li>• 온라인 광고</li>
                      <li>• 언론 보도</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
