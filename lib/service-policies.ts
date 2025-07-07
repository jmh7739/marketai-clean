// 서비스 운영 정책 설정
export const SERVICE_POLICIES = {
  // 금지 품목
  PROHIBITED_ITEMS: [
    "담배, 주류",
    "의약품, 의료기기",
    "무기류, 도검류",
    "성인용품",
    "동물, 식물",
    "위조품, 복제품",
    "개인정보 관련 물품",
    "불법 소프트웨어",
    "티켓 암표",
    "현금, 상품권 (일부 제외)",
  ],

  // 분쟁 해결 프로세스
  DISPUTE_RESOLUTION: {
    reportingPeriod: 7, // 신고 가능 기간 (일)
    investigationPeriod: 3, // 조사 기간 (일)
    autoRefundPeriod: 10, // 자동 환불 기간 (일)
    steps: [
      "1. 분쟁 신고 접수",
      "2. 양측 의견 수렴 (3일)",
      "3. 증거 자료 검토",
      "4. 중재 결정 통보",
      "5. 환불/정산 처리",
    ],
  },

  // 환불/취소 정책
  REFUND_POLICY: {
    beforePayment: "즉시 취소 가능",
    afterPayment: "배송 전까지 취소 가능",
    afterDelivery: "상품 하자시에만 환불 가능",
    refundFee: 0.02, // 환불 수수료 2%
    processingDays: 3, // 환불 처리 기간
  },

  // 사기 방지 대책
  FRAUD_PREVENTION: {
    suspiciousActivity: [
      "동일 상품 반복 등록",
      "비정상적 고가 입찰",
      "짧은 시간 내 다수 거래",
      "허위 정보 등록",
      "의심스러운 결제 패턴",
      "동일 IP에서 다중 계정 생성",
    ],
    penalties: {
      warning: "경고 (3회시 정지)",
      suspension: "7일 정지",
      ban: "영구 정지",
    },
    autoDetection: ["AI 기반 이상 거래 탐지", "이미지 중복 검사", "가격 이상치 탐지", "사용자 행동 패턴 분석"],
  },
}

// 고객 지원 체계를 이메일 중심으로 변경
export const CUSTOMER_SUPPORT = {
  channels: [
    {
      type: "이메일",
      email: "support@marketai.com",
      hours: "24시간 접수",
      responseTime: "평일 24시간 이내, 주말 48시간 이내",
      description: "모든 문의사항 처리",
    },
    {
      type: "FAQ",
      coverage: "일반적인 문의 85% 해결",
      updateFrequency: "주 1회 업데이트",
      description: "자주 묻는 질문 자동 해결",
    },
  ],

  escalation: [
    "1차: FAQ 자동 검색",
    "2차: 이메일 문의 접수",
    "3차: 담당자 배정",
    "4차: 전문팀 에스컬레이션 (고액/복잡 사안)",
  ],

  emailCategories: ["거래 분쟁", "결제 문제", "계정 문제", "기술적 오류", "정책 문의", "기타 문의"],
}
