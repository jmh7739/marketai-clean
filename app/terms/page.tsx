"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">이용약관</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">최종 수정일: 2024년 1월 15일</Badge>
            <Badge variant="outline">시행일: 2024년 1월 20일</Badge>
          </div>
        </div>

        <div className="space-y-6">
          {/* 제1조 */}
          <Card>
            <CardHeader>
              <CardTitle>제1조 (목적)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                이 약관은 MarketAI(이하 "회사")가 제공하는 온라인 경매 서비스(이하 "서비스")의 이용과 관련하여 회사와
                이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </CardContent>
          </Card>

          {/* 제2조 */}
          <Card>
            <CardHeader>
              <CardTitle>제2조 (정의)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
              <ol className="list-decimal list-inside space-y-2 mt-4">
                <li>
                  <strong>"서비스"</strong>란 회사가 제공하는 온라인 경매 플랫폼을 의미합니다.
                </li>
                <li>
                  <strong>"이용자"</strong>란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
                </li>
                <li>
                  <strong>"회원"</strong>이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로
                  제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
                </li>
                <li>
                  <strong>"경매"</strong>란 회원이 등록한 상품에 대해 다른 회원들이 입찰하여 최고가 입찰자가 낙찰받는
                  거래방식을 말합니다.
                </li>
                <li>
                  <strong>"낙찰"</strong>이란 경매 종료 시점에서 최고가를 입찰한 회원이 해당 상품의 구매권을 획득하는
                  것을 말합니다.
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* 제3조 */}
          <Card>
            <CardHeader>
              <CardTitle>제3조 (약관의 효력 및 변경)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력을 발생합니다.</li>
                <li>
                  회사는 합리적인 사유가 발생할 경우에는 이 약관을 변경할 수 있으며, 약관이 변경되는 경우 변경된 약관의
                  내용과 시행일을 정하여, 그 시행일로부터 최소 7일 이전에 공지합니다.
                </li>
                <li>
                  회원은 변경된 약관에 동의하지 않을 경우 회원탈퇴를 요청할 수 있으며, 변경된 약관의 효력 발생일
                  이후에도 서비스를 계속 이용할 경우 약관의 변경사항에 동의한 것으로 간주됩니다.
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* 제4조 */}
          <Card>
            <CardHeader>
              <CardTitle>제4조 (회원가입)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  회원가입은 이용자가 약관의 내용에 대하여 동의를 하고 회원가입신청을 한 후 회사가 이러한 신청에 대하여
                  승낙함으로써 체결됩니다.
                </li>
                <li>
                  회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                    <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                    <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                    <li>만 14세 미만인 경우</li>
                  </ul>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* 제5조 */}
          <Card>
            <CardHeader>
              <CardTitle>제5조 (경매 참여)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  회원은 등록된 경매 상품에 대해 입찰할 수 있으며, 입찰은 현재 최고가보다 높은 금액으로만 가능합니다.
                </li>
                <li>입찰 후에는 취소할 수 없으며, 경매 종료 시 최고가 입찰자가 자동으로 낙찰됩니다.</li>
                <li>
                  낙찰자는 낙찰 후 24시간 이내에 결제를 완료해야 하며, 기한 내 결제하지 않을 경우 낙찰이 취소될 수
                  있습니다.
                </li>
                <li>허위 입찰이나 결제 의사가 없는 입찰은 금지되며, 이를 위반할 경우 회원자격이 제한될 수 있습니다.</li>
              </ol>
            </CardContent>
          </Card>

          {/* 제6조 */}
          <Card>
            <CardHeader>
              <CardTitle>제6조 (상품 등록 및 판매)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>회원은 본인 소유의 상품에 한하여 경매에 등록할 수 있습니다.</li>
                <li>
                  상품 등록 시 정확하고 상세한 정보를 제공해야 하며, 허위 정보 제공 시 등록이 거부되거나 삭제될 수
                  있습니다.
                </li>
                <li>
                  다음 각 호의 상품은 등록할 수 없습니다:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>법령에 의해 거래가 금지된 상품</li>
                    <li>타인의 지적재산권을 침해하는 상품</li>
                    <li>음란물, 도박 관련 상품</li>
                    <li>기타 공서양속에 반하는 상품</li>
                  </ul>
                </li>
                <li>판매자는 낙찰 후 구매자의 결제 확인 시 신속히 상품을 발송해야 합니다.</li>
              </ol>
            </CardContent>
          </Card>

          {/* 제7조 */}
          <Card>
            <CardHeader>
              <CardTitle>제7조 (수수료)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>구매자는 별도의 수수료를 지불하지 않습니다.</li>
                <li>판매자는 낙찰가의 5%를 수수료로 지불해야 합니다.</li>
                <li>수수료는 거래 완료 후 자동으로 정산되며, 판매 대금에서 차감됩니다.</li>
              </ol>
            </CardContent>
          </Card>

          {/* 제8조 */}
          <Card>
            <CardHeader>
              <CardTitle>제8조 (환불 및 교환)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  상품 수령 후 7일 이내에 상품이 설명과 다르거나 하자가 있는 경우 환불 또는 교환을 요청할 수 있습니다.
                </li>
                <li>단순 변심에 의한 환불은 원칙적으로 불가능하나, 판매자가 동의하는 경우 가능합니다.</li>
                <li>환불 시 배송비는 구매자가 부담하며, 상품에 하자가 있는 경우는 판매자가 부담합니다.</li>
              </ol>
            </CardContent>
          </Card>

          {/* 제9조 */}
          <Card>
            <CardHeader>
              <CardTitle>제9조 (개인정보보호)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다.</li>
                <li>개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.</li>
                <li>회사는 회원의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.</li>
              </ol>
            </CardContent>
          </Card>

          {/* 제10조 */}
          <Card>
            <CardHeader>
              <CardTitle>제10조 (책임의 한계)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에
                  관한 책임이 면제됩니다.
                </li>
                <li>
                  회사는 회원 간의 거래에서 발생하는 분쟁에 대해 개입하지 않으며, 이로 인한 손해에 대해 책임지지
                  않습니다.
                </li>
                <li>회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않습니다.</li>
              </ol>
            </CardContent>
          </Card>

          {/* 제11조 */}
          <Card>
            <CardHeader>
              <CardTitle>제11조 (분쟁해결)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>이 약관에 관하여 분쟁이 있을 때에는 대한민국 법을 적용합니다.</li>
                <li>
                  서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 회사의 본사 소재지를 관할하는 법원을 관할
                  법원으로 합니다.
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* 부칙 */}
          <Card>
            <CardHeader>
              <CardTitle>부칙</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>이 약관은 2024년 1월 20일부터 시행됩니다.</p>
            </CardContent>
          </Card>
        </div>

        {/* 연락처 */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">문의사항</h3>
            <p className="text-gray-600 mb-4">이용약관에 대한 문의사항이 있으시면 언제든 연락주세요</p>
            <div className="flex justify-center space-x-4 text-sm">
              <span>📞 1588-1234</span>
              <span>📧 legal@marketai.com</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
