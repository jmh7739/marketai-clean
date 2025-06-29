// eBay 참고한 플랫폼 정책들
export const EBAY_INSPIRED_POLICIES = {
  // 실시간 알림 (eBay 방식)
  notifications: {
    bidding: {
      immediate: true, // 즉시 알림
      outbidAlert: true, // 상회 입찰 시 즉시 알림
      endingSoon: [24, 1], // 24시간, 1시간 전 알림
      watchlistUpdates: true, // 관심상품 업데이트
    },
    delivery: ["push", "email"], // 푸시 + 이메일
    frequency: "immediate", // 즉시 발송
    quietHours: { start: 22, end: 8 }, // 22시-8시 조용한 시간
  },

  // 이미지 처리 (eBay 표준)
  imageProcessing: {
    watermark: false, // 워터마크 없음 (eBay 방식)
    exifRemoval: true, // 개인정보 보호
    autoCompress: true, // 자동 압축
    maxDimension: 1600, // 최대 1600px
    quality: 85, // 85% 품질
    formats: ["jpg", "png", "webp"],
    thumbnails: [75, 150, 300, 600], // 다양한 썸네일 크기
  },

  // 검색 기능 (eBay 수준)
  search: {
    autocomplete: true, // 자동완성
    typoTolerance: true, // 오타 허용
    synonyms: true, // 유의어 검색
    recentSearches: 10, // 최근 검색어 10개
    popularSearches: true, // 인기 검색어
    savedSearches: 20, // 저장된 검색 20개
    searchSuggestions: true, // 검색 제안
  },

  // 모바일 최적화 (eBay 앱 수준)
  mobile: {
    pushNotifications: true, // 앱 푸시 알림
    oneClickBidding: true, // 원클릭 입찰
    touchGestures: {
      swipeToNext: true, // 스와이프로 다음 상품
      pinchToZoom: true, // 핀치 줌
      pullToRefresh: true, // 당겨서 새로고침
    },
    quickActions: ["bid", "watch", "share"], // 빠른 액션
    offlineMode: true, // 오프라인 모드
  },

  // 성능 최적화 (eBay 표준)
  performance: {
    cdn: true, // CDN 사용
    lazyLoading: true, // 지연 로딩
    infiniteScroll: true, // 무한 스크롤
    caching: {
      images: "1_year",
      api: "5_minutes",
      static: "1_month",
    },
    compression: {
      gzip: true,
      brotli: true,
    },
    bundleSplitting: true, // 코드 분할
  },

  // 신뢰도 시스템 (eBay 방식)
  trustSystem: {
    feedbackScore: true, // 평점 시스템
    verifiedBadges: ["phone", "email", "address", "payment"], // 인증 배지
    sellerRating: {
      criteria: ["accuracy", "communication", "shipping", "overall"],
      scale: 5, // 5점 만점
    },
    buyerProtection: {
      moneyBackGuarantee: true, // 환불 보장
      disputeResolution: true, // 분쟁 해결
      fraudProtection: true, // 사기 보호
    },
  },

  // 카테고리 시스템 (eBay 수준)
  categories: {
    maxDepth: 4, // 최대 4단계
    autoSuggestion: true, // 자동 제안
    customCategories: true, // 커스텀 카테고리
    categoryInsights: true, // 카테고리 인사이트
    trendingCategories: true, // 트렌딩 카테고리
  },

  // 경매 기능 (eBay 고급 기능)
  auction: {
    reservePrice: true, // 최소 낙찰가
    buyItNow: true, // 즉시구매
    bestOffer: true, // 가격 제안
    scheduledListing: true, // 예약 등록
    bulkListing: true, // 대량 등록
    listingUpgrades: {
      featured: true, // 추천 상품
      bold: true, // 굵은 제목
      highlight: true, // 하이라이트
      gallery: true, // 갤러리 플러스
    },
  },
}

// eBay 기반 추가 논의 사항들
export const ADDITIONAL_DISCUSSIONS = {
  // 1. 고급 경매 기능
  advancedAuction: {
    reservePrice: "최소 낙찰가 설정 기능 추가?",
    bestOffer: "가격 제안 기능 (경매 외 협상)?",
    scheduledListing: "예약 등록 기능 (특정 시간에 자동 시작)?",
    bulkListing: "대량 상품 등록 도구?",
    listingUpgrades: "유료 상품 노출 강화 옵션?",
  },

  // 2. 결제 시스템 고도화
  paymentSystem: {
    installment: "할부 결제 지원?",
    escrowService: "고액 거래용 전문 에스크로?",
    internationalPayment: "해외 결제 지원?",
    cryptoPayment: "암호화폐 결제 지원?",
    paymentPlan: "분할 결제 옵션?",
  },

  // 3. 글로벌 확장
  globalization: {
    multiCurrency: "다중 통화 지원?",
    multiLanguage: "다국어 지원 범위?",
    internationalShipping: "국제 배송 시스템?",
    localizedPolicies: "국가별 정책 차별화?",
    crossBorderTrade: "국경간 거래 지원?",
  },

  // 4. 고급 보안
  advancedSecurity: {
    twoFactorAuth: "2단계 인증 도입?",
    biometricAuth: "생체 인증 지원?",
    deviceFingerprinting: "디바이스 지문 인식?",
    fraudDetectionAI: "AI 기반 사기 탐지?",
    blockchainVerification: "블록체인 기반 인증?",
  },

  // 5. 데이터 분석
  analytics: {
    priceHistory: "가격 히스토리 차트?",
    marketTrends: "시장 트렌드 분석?",
    demandForecasting: "수요 예측 기능?",
    competitorAnalysis: "경쟁 상품 분석?",
    userBehaviorAnalysis: "사용자 행동 분석?",
  },
}

// 법적 검토 사항 (eBay 참고)
export const LEGAL_CONSIDERATIONS = {
  // 전자상거래법 준수
  ecommerceLaw: {
    requiredInfo: "사업자 정보, 이용약관, 개인정보처리방침 필수",
    coolingOffPeriod: "7일 청약철회권 (단, 경매는 예외 가능)",
    disputeResolution: "소비자분쟁조정위원회 연계 필수",
    advertising: "과대광고 금지, 표시광고법 준수",
  },

  // 개인정보보호법
  privacyLaw: {
    dataMinimization: "최소한의 개인정보만 수집",
    consentManagement: "동의 철회 기능 제공",
    dataPortability: "개인정보 이동권 보장",
    rightToBeForgotten: "삭제권 보장",
  },

  // 금융 관련 법규
  financialRegulation: {
    escrowLicense: "에스크로 업무 등록 필요할 수 있음",
    antiMoneyLaundering: "자금세탁방지법 준수",
    foreignExchange: "외환거래법 (해외 진출 시)",
    taxation: "부가가치세법, 소득세법 준수",
  },

  // 지적재산권
  intellectualProperty: {
    copyrightProtection: "저작권 침해 신고 시스템",
    trademarkProtection: "상표권 보호 정책",
    counterfeitPrevention: "위조품 판매 방지",
    dmcaCompliance: "DMCA 준수 (해외 진출 시)",
  },

  // 경쟁법
  competitionLaw: {
    fairTrading: "공정거래법 준수",
    marketDominance: "시장지배적 지위 남용 금지",
    priceFixing: "가격 담합 방지",
    exclusiveDealing: "독점 거래 제한",
  },
}

// 권장 구현 순서
export const IMPLEMENTATION_PRIORITY = {
  phase1: {
    notifications: "실시간 알림 시스템",
    imageProcessing: "이미지 최적화",
    search: "검색 기능 고도화",
    mobile: "모바일 UX 개선",
  },
  phase2: {
    trustSystem: "신뢰도 시스템",
    advancedAuction: "고급 경매 기능",
    analytics: "데이터 분석",
    security: "보안 강화",
  },
  phase3: {
    globalization: "글로벌 확장",
    paymentSystem: "결제 시스템 고도화",
    ai: "AI 기능 추가",
    blockchain: "블록체인 도입",
  },
}
