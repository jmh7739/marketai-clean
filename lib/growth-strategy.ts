// 성장 전략 및 초기 런칭 계획
export const GROWTH_STRATEGY = {
  // 초기 사용자 확보 전략
  INITIAL_USER_ACQUISITION: {
    phase1: {
      duration: "1개월",
      target: "100명 가입, 50건 거래",
      methods: [
        "지인 네트워크 활용",
        "소셜미디어 홍보",
        "커뮤니티 마케팅 (당근마켓, 중고나라 등)",
        "초기 사용자 인센티브 (수수료 할인)",
      ],
    },

    phase2: {
      duration: "2-3개월",
      target: "500명 가입, 200건 거래",
      methods: [
        "추천인 제도 (추천인/피추천인 모두 혜택)",
        "인플루언서 협업",
        "구글/네이버 광고 (소액)",
        "언론 보도 (스타트업 매체)",
      ],
    },
  },

  // 바이럴 기능
  VIRAL_FEATURES: {
    referralProgram: {
      referrerReward: "추천인: 다음 거래 수수료 50% 할인",
      refereeReward: "신규 가입자: 첫 거래 수수료 무료",
      maxRewards: 10, // 최대 추천 혜택 횟수
    },

    socialSharing: ["경매 진행 상황 SNS 공유", "낙찰 성공 자랑하기", "특가 상품 친구에게 알리기"],

    gamification: ["거래 횟수별 등급 시스템", "연속 거래 보너스", "월간 베스트 셀러 선정"],
  },

  // 파트너십 전략
  PARTNERSHIPS: {
    logistics: ["CJ대한통운 - 배송비 할인", "로젠택배 - 픽업 서비스", "편의점택배 - 소형 상품"],

    payment: ["토스페이먼츠 - 간편결제", "카카오페이 - 젊은층 타겟", "네이버페이 - 중장년층 타겟"],

    authentication: ["NICE평가정보 - 본인인증", "KCB - 신용정보 연계"],
  },
}

// 데이터 분석 및 개선 계획
export const ANALYTICS_PLAN = {
  keyMetrics: [
    "DAU/MAU (일간/월간 활성 사용자)",
    "거래 성사율",
    "평균 거래 금액",
    "사용자 재방문율",
    "수수료 수익",
    "고객 만족도 (NPS)",
  ],

  improvementCycle: [
    "주간: 사용자 피드백 수집",
    "월간: 데이터 분석 및 개선점 도출",
    "분기: 주요 기능 업데이트",
    "반기: 전략 재검토",
  ],
}
