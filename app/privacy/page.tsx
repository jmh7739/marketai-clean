"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, Trash2 } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">개인정보처리방침</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">최종 수정일: 2024년 1월 15일</Badge>
            <Badge variant="outline">시행일: 2024년 1월 20일</Badge>
          </div>
          <p className="text-gray-600 mt-2">
            MarketAI는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고자 다음과 같은 처리방침을 두고
            있습니다.
          </p>
        </div>

        <div className="space-y-6">
          {/* 제1조 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                제1조 (개인정보의 처리목적)
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>MarketAI는 다음의 목적을 위하여 개인정보를 처리합니다:</p>

              <div className="mt-4 space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">1. 회원가입 및 관리</h4>
                  <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
                    <li>회원자격 유지·관리, 서비스 부정이용 방지</li>
                    <li>각종 고지·통지, 고충처리 등을 목적으로 개인정보를 처리합니다</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">2. 재화 또는 서비스 제공</h4>
                  <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                    <li>물품배송, 서비스 제공, 계약서·청구서 발송</li>
                    <li>콘텐츠 제공, 맞춤서비스 제공</li>
                    <li>본인인증, 연령인증, 요금결제·정산 등을 목적으로 개인정보를 처리합니다</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">3. 고충처리</h4>
                  <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
                    <li>민원인의 신원 확인, 민원사항 확인</li>
                    <li>사실조사를 위한 연락·통지, 처리결과 통보 등을 목적으로 개인정보를 처리합니다</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 제2조 */}
          <Card>
            <CardHeader>
              <CardTitle>제2조 (개인정보의 처리 및 보유기간)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left">처리목적</th>
                      <th className="border border-gray-300 p-3 text-left">보유기간</th>
                      <th className="border border-gray-300 p-3 text-left">근거</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">회원가입 및 관리</td>
                      <td className="border border-gray-300 p-3">회원탈퇴 시까지</td>
                      <td className="border border-gray-300 p-3">이용자의 동의</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">재화 또는 서비스 제공</td>
                      <td className="border border-gray-300 p-3">재화·서비스 공급완료 및 요금결제·정산 완료시까지</td>
                      <td className="border border-gray-300 p-3">계약의 이행</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">전자상거래 기록</td>
                      <td className="border border-gray-300 p-3">5년</td>
                      <td className="border border-gray-300 p-3">전자상거래법</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">소비자 불만 또는 분쟁처리</td>
                      <td className="border border-gray-300 p-3">3년</td>
                      <td className="border border-gray-300 p-3">전자상거래법</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 제3조 */}
          <Card>
            <CardHeader>
              <CardTitle>제3조 (개인정보의 제3자 제공)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold">
                  ⚠️ MarketAI는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
                </p>
              </div>

              <p className="mt-4">다만, 아래의 경우에는 예외로 합니다:</p>
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li>이용자들이 사전에 동의한 경우</li>
                <li>
                  법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
                </li>
                <li>
                  통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정 개인을 알아볼 수 없는 형태로 가공하여
                  제공하는 경우
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* 제4조 */}
          <Card>
            <CardHeader>
              <CardTitle>제4조 (개인정보처리의 위탁)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>MarketAI는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>

              <div className="mt-4 space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">결제 처리 업무</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      <strong>수탁업체:</strong> 토스페이먼츠, 카카오페이
                    </li>
                    <li>
                      <strong>위탁업무:</strong> 결제 처리 및 정산
                    </li>
                    <li>
                      <strong>보유기간:</strong> 위탁계약 종료시까지
                    </li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">배송 업무</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      <strong>수탁업체:</strong> CJ대한통운, 롯데택배
                    </li>
                    <li>
                      <strong>위탁업무:</strong> 상품 배송
                    </li>
                    <li>
                      <strong>보유기간:</strong> 배송 완료시까지
                    </li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">고객지원 업무</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      <strong>수탁업체:</strong> 채널톡
                    </li>
                    <li>
                      <strong>위탁업무:</strong> 고객상담 및 CS
                    </li>
                    <li>
                      <strong>보유기간:</strong> 위탁계약 종료시까지
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 제5조 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                제5조 (개인정보의 안전성 확보조치)
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>MarketAI는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🔐 기술적 조치</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>개인정보처리시스템 등의 접근권한 관리</li>
                    <li>접근통제시스템 설치</li>
                    <li>고유식별정보 등의 암호화</li>
                    <li>보안프로그램 설치 및 갱신</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">👥 관리적 조치</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>개인정보 취급직원의 최소화</li>
                    <li>개인정보 취급직원에 대한 교육</li>
                    <li>개인정보처리시스템 접근기록 보관</li>
                    <li>개인정보취급방침 수립 및 시행</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 제6조 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                제6조 (개인정보 자동 수집 장치의 설치·운영 및 거부)
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">쿠키(Cookie)란?</h4>
                  <p className="text-sm text-gray-600">
                    웹사이트를 운영하는데 이용되는 서버가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의
                    PC 컴퓨터내의 하드디스크에 저장되기도 합니다.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">쿠키 사용 목적</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태 파악</li>
                    <li>인기 검색어, 보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공</li>
                    <li>개인화되고 맞춤화된 서비스, 내용, 광고 제공</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">쿠키 설정 거부 방법</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 웹브라우저에서 옵션을 설정함으로써 모든
                    쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수도 있습니다.
                  </p>
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Chrome:</strong> 설정 → 개인정보 및 보안 → 쿠키 및 기타 사이트 데이터
                    </p>
                    <p>
                      <strong>Firefox:</strong> 옵션 → 개인 정보 및 보안 → 쿠키 및 사이트 데이터
                    </p>
                    <p>
                      <strong>Safari:</strong> 환경설정 → 개인정보 → 쿠키 및 웹사이트 데이터
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 제7조 */}
          <Card>
            <CardHeader>
              <CardTitle>제7조 (정보주체의 권리·의무 및 행사방법)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">📋 열람권</h4>
                  <p className="text-sm text-gray-600">
                    개인정보 처리현황, 처리목적, 처리방법, 처리기간, 제3자 제공현황 등을 확인할 수 있습니다.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">✏️ 정정·삭제권</h4>
                  <p className="text-sm text-gray-600">개인정보의 오류에 대한 정정이나 삭제를 요구할 수 있습니다.</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">⏸️ 처리정지권</h4>
                  <p className="text-sm text-gray-600">개인정보의 처리를 정지하도록 요구할 수 있습니다.</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">🚫 손해배상청구권</h4>
                  <p className="text-sm text-gray-600">
                    개인정보 침해로 인한 정신적 피해에 대해 손해배상을 청구할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">권리 행사 방법</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>📧 이메일: privacy@marketai.com</li>
                  <li>📞 전화: 1588-1234</li>
                  <li>🌐 웹사이트: 마이페이지 → 개인정보 관리</li>
                  <li>📮 우편: 서울시 강남구 테헤란로 123, MarketAI 개인정보보호팀</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 제8조 */}
          <Card>
            <CardHeader>
              <CardTitle>제8조 (개인정보 보호책임자)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">개인정보 보호책임자</h4>
                  <ul className="text-sm space-y-2">
                    <li>
                      <strong>성명:</strong> 김개인
                    </li>
                    <li>
                      <strong>직책:</strong> 개인정보보호팀장
                    </li>
                    <li>
                      <strong>연락처:</strong> 02-1234-5678
                    </li>
                    <li>
                      <strong>이메일:</strong> privacy@marketai.com
                    </li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">개인정보 보호담당자</h4>
                  <ul className="text-sm space-y-2">
                    <li>
                      <strong>성명:</strong> 이보호
                    </li>
                    <li>
                      <strong>직책:</strong> 개인정보보호팀 대리
                    </li>
                    <li>
                      <strong>연락처:</strong> 02-1234-5679
                    </li>
                    <li>
                      <strong>이메일:</strong> privacy-support@marketai.com
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  정보주체께서는 MarketAI의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리,
                  피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. MarketAI는
                  정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 제9조 */}
          <Card>
            <CardHeader>
              <CardTitle>제9조 (개인정보 처리방침 변경)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는
                  경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </li>
                <li>본 방침은 2024년 1월 20일부터 시행됩니다.</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* 연락처 */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">개인정보 관련 문의</h3>
            <p className="text-gray-600 mb-4">개인정보 처리방침에 대한 문의사항이 있으시면 언제든 연락주세요</p>
            <div className="flex justify-center space-x-4 text-sm">
              <span>📞 1588-1234</span>
              <span>📧 privacy@marketai.com</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
