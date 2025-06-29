// 리스크 관리 및 대응 방안
export const RISK_MANAGEMENT = {
  // 사기 거래 대응
  FRAUD_DETECTION: {
    automaticFlags: [
      "신규 계정의 고가 상품 등록",
      "동일 IP에서 다중 계정 생성",
      "비정상적인 입찰 패턴",
      "허위 이미지 사용 (AI 검증)",
    ],

    manualReview: ["50만원 이상 거래", "신고가 접수된 사용자", "평점이 낮은 사용자"],

    preventionMeasures: ["본인인증 강화", "거래 이력 점수제", "에스크로 서비스 의무화", "실시간 모니터링"],
  },

  // 시스템 장애 대응
  SYSTEM_RELIABILITY: {
    backupStrategy: "실시간 백업 + 일간 백업",
    uptimeTarget: "99.9%",
    responseTime: "평균 2초 이내",

    emergencyPlan: [
      "1단계: 자동 알림 발송",
      "2단계: 백업 서버 전환",
      "3단계: 사용자 공지",
      "4단계: 복구 작업",
      "5단계: 사후 분석",
    ],
  },

  // 법적 이슈 대응
  LEGAL_COMPLIANCE: {
    userAgreement: "이용약관 정기 업데이트",
    privacyPolicy: "개인정보처리방침 준수",
    consumerProtection: "소비자보호법 가이드라인 준수",

    disputeResolution: ["내부 조정 우선", "소비자분쟁조정위원회 연계", "법적 대응 (최후 수단)"],
  },
}
