import { Shield, CheckCircle, Clock, AlertTriangle, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BuyerProtectionInfo() {
  const protectionFeatures = [
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "문제 해결 지원",
      description: "상품 미수령, 설명과 다른 경우 문제 해결 지원",
      coverage: "전 거래",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      title: "에스크로 보호",
      description: "구매확정 전까지 안전하게 자금 보관",
      coverage: "모든 거래",
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      title: "신고 기간",
      description: "상품 수령 후 30일 이내 문제 신고 가능",
      coverage: "30일 지원",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
      title: "분쟁 해결 센터",
      description: "당사자 간 대화를 통한 문제 해결",
      coverage: "48시간 지원",
    },
  ]

  const eligibleReasons = [
    { reason: "상품 미수령", description: "배송 완료 후에도 상품을 받지 못한 경우" },
    { reason: "설명과 크게 다름", description: "상품이 설명, 사진과 현저히 다른 경우" },
    { reason: "위조품", description: "정품이 아닌 가짜 상품인 경우" },
    { reason: "판매자 사기", description: "판매자의 의도적인 사기 행위" },
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-12 h-12 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">안전 거래 지원</h1>
        </div>
        <p className="text-lg text-gray-600">신뢰할 수 있는 거래를 위한 문제 해결 지원 서비스</p>
      </div>

      {/* 보호 기능들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {protectionFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                {feature.icon}
                <div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <span className="text-sm text-gray-500">{feature.coverage}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 지원 대상 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            지원 대상 사유
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {eligibleReasons.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">{item.reason}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 신고 절차 */}
      <Card>
        <CardHeader>
          <CardTitle>문제 신고 절차</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold">문제 신고</h4>
                <p className="text-sm text-gray-600">마이페이지 &gt; 구매내역에서 '문제 신고' 클릭</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold">증거 제출</h4>
                <p className="text-sm text-gray-600">사진, 메시지 등 관련 증거 자료 업로드</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold">당사자 간 대화</h4>
                <p className="text-sm text-gray-600">분쟁해결센터에서 48시간 동안 판매자와 직접 소통</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h4 className="font-semibold">해결 완료</h4>
                <p className="text-sm text-gray-600">합의 또는 관리자 중재를 통한 최종 해결</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주의사항 */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800">주의사항</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-orange-700">
            <li>• 구매확정 후에는 문제 해결 지원이 제한됩니다</li>
            <li>• 허위 신고 시 계정 제재를 받을 수 있습니다</li>
            <li>• 상품 수령 후 30일 이내에만 신고 가능합니다</li>
            <li>• 디지털 상품은 일부 지원 조건이 다를 수 있습니다</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
