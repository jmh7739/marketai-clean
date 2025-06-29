// 플랫폼 정책 설정 (보장 내용 제거)
export const PLATFORM_POLICIES = {
  // 1. 이미지 업로드 정책 (eBay 참고)
  imageUpload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFormats: ["jpg", "jpeg", "png", "webp"],
    maxImages: 8,
    autoCompress: true,
    thumbnailSizes: [75, 150, 300, 600], // eBay 표준
    compressionQuality: 85, // eBay 수준
    maxDimension: 1600, // eBay 표준
    removeExif: true, // 개인정보 보호
    watermark: false, // eBay 방식 (워터마크 없음)
  },

  // 2. 검색 및 필터링 (eBay 수준)
  search: {
    scope: ["title", "description", "brand", "category"],
    defaultSort: "ending_soon", // 마감임박순
    resultsPerPage: 24,
    useInfiniteScroll: true,
    filters: ["price_range", "location", "condition", "brand", "shipping_type"],
    autocomplete: true, // eBay 기능
    typoTolerance: true, // 오타 허용
    recentSearches: 10, // 최근 검색어
    popularSearches: true, // 인기 검색어
    savedSearches: 20, // 저장된 검색
  },

  // 3. 알림 시스템 (eBay 방식)
  notifications: {
    types: ["bid_placed", "outbid", "auction_won", "payment_due", "item_shipped", "item_delivered", "price_offer"],
    methods: ["push", "email"],
    retention: 30, // 30일 보관
    userConfigurable: true,
    immediate: true, // 즉시 알림
    endingSoonAlerts: [24, 1], // 24시간, 1시간 전
  },

  // 입찰 정책
  bidding: {
    minimumIncrement: 1000, // 1,000원 단위
    quickBidAmounts: [1000, 5000, 10000, 50000], // 빠른 입찰 버튼
    confirmationPopup: false, // 확인 팝업 없음
    cancellationAllowed: false, // 입찰 취소 불허
    maxBidsPerUser: 100, // 한 경매당 최대 입찰 횟수
    reservePrice: true, // 최소 낙찰가 기능
  },

  // 상품 등록
  listing: {
    registrationFee: 0, // 등록 수수료 없음
    requiredFields: ["title", "description", "category", "condition", "starting_price", "images"],
    titleMaxLength: 80,
    descriptionMaxLength: 5000,
    draftSaveDays: 30,
    priceOfferEnabled: true, // 가격 제안 기능
    buyItNowEnabled: true, // 즉시구매 기능
  },

  // 프로필 및 신뢰도 (eBay 방식)
  profile: {
    publicInfo: [
      "nickname",
      "join_date",
      "total_sales",
      "total_purchases",
      "rating",
      "verification_badges",
      "transaction_count",
    ],
    verificationBadges: ["phone", "email", "address", "payment"],
    ratingSystem: {
      scale: 5.0, // 5.0 만점
      criteria: ["accuracy", "communication", "shipping", "overall"],
      allowText: true,
      allowPhotos: true,
      maxLength: 500,
      editTimeLimit: 24 * 60 * 60 * 1000, // 24시간
    },
    transactionCount: true, // 거래 성사 횟수 표시
  },

  // 결제 시스템
  payment: {
    supportedBanks: ["KB국민", "신한", "우리", "하나", "NH농협", "IBK기업", "카카오뱅크", "토스뱅크"],
    paymentMethods: ["bank_transfer", "virtual_account", "card"],
    paymentDeadline: 24 * 60 * 60 * 1000, // 24시간
    maxRetries: 3,
    autoVerificationRate: 0.7, // 70% 자동 확인 목표
    partialPaymentAllowed: false,
  },

  // 수수료 정책
  fees: {
    showDuringListing: true,
    showDuringBidding: true,
    showDuringPayment: true,
    realTimeCalculator: true,
    vatForBusiness: true,
    settlementReportDetail: ["gross_amount", "fee_amount", "vat_amount", "net_amount", "transaction_date"],
  },

  // 보안 정책
  security: {
    password: {
      minLength: 8,
      requireSpecialChar: true,
      requireNumber: true,
      requireUppercase: false,
    },
    login: {
      maxFailAttempts: 5,
      lockoutDuration: 10 * 60 * 1000, // 10분
      sessionTimeout: 24 * 60 * 60 * 1000, // 24시간
      allowMultipleDevices: true,
    },
    newUserLimits: {
      enabled: false, // 신규 사용자 거래 제한 없음
      dailyLimit: null,
      monthlyLimit: null,
    },
  },

  // 제재 정책
  penalties: {
    bidCancellation: {
      firstOffense: "warning",
      secondOffense: "suspension_7_days",
      thirdOffense: "suspension_30_days",
      fourthOffense: "permanent_ban",
    },
    paymentDefault: {
      firstOffense: "warning",
      secondOffense: "suspension_14_days",
      thirdOffense: "permanent_ban",
    },
    fraudulentActivity: {
      firstOffense: "permanent_ban",
    },
    resetPeriod: 6 * 30 * 24 * 60 * 60 * 1000, // 6개월
  },

  // 개인정보 처리
  privacy: {
    dataRetention: {
      activeUser: "indefinite",
      inactiveUser: "3_years",
      deletedUser: "30_days",
    },
    cookiePolicy: {
      essential: true,
      analytics: "user_consent",
      marketing: "user_consent",
    },
    thirdPartySharing: {
      analytics: ["Google Analytics"],
      payment: ["토스페이먼츠"],
      shipping: ["CJ대한통운", "한진택배"],
    },
  },

  // UI/UX 설정
  design: {
    primaryColor: "#3B82F6", // 파란색 계열 유지
    darkModeSupported: true,
    fontFamily: "Pretendard, system-ui, sans-serif",
    iconLibrary: "lucide-react",
    breakpoints: {
      mobile: "768px",
      tablet: "1024px",
      desktop: "1280px",
    },
    touchTargetSize: "44px", // 모바일 터치 영역
  },

  // 5. 성능 설정 (eBay 수준)
  performance: {
    imageLazyLoading: true,
    cacheStrategy: {
      staticAssets: "1_year",
      apiResponses: "5_minutes",
      userSessions: "24_hours",
    },
    bundleSplitting: true,
    cdnEnabled: true,
    supportedBrowsers: ["Chrome >= 90", "Firefox >= 88", "Safari >= 14", "Edge >= 90"],
    preloadCriticalResources: true, // 중요 리소스 미리 로드
    serviceWorkerEnabled: true, // 오프라인 지원
    compressionEnabled: true, // Gzip/Brotli 압축
    minificationEnabled: true, // CSS/JS 압축
  },
}

// 카테고리 정책
export const CATEGORY_POLICY = {
  allowCustomCategory: true,
  customCategoryApproval: false, // 자동 승인
  maxCustomCategories: 10, // 사용자당 최대 커스텀 카테고리
  moderationRequired: false,
}

// 제재 처리 함수
export const applyPenalty = (userId: string, offense: string, count: number) => {
  const penalties = PLATFORM_POLICIES.penalties[offense as keyof typeof PLATFORM_POLICIES.penalties]

  if (!penalties) return null

  const penaltyKey =
    count === 1 ? "firstOffense" : count === 2 ? "secondOffense" : count === 3 ? "thirdOffense" : "fourthOffense"

  return penalties[penaltyKey as keyof typeof penalties] || penalties.fourthOffense
}
