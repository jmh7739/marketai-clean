// 사업자 등록 없이 사용 가능한 인증 제공자들
export const authProviders = {
  // 1. Google (Firebase) - 사업자 등록 불필요
  google: {
    name: "Google",
    icon: "🔍",
    available: true,
    businessRequired: false,
    limits: "일일 사용자 수 제한 있음",
  },

  // 2. 이메일/비밀번호 - 완전 무료
  email: {
    name: "이메일",
    icon: "📧",
    available: true,
    businessRequired: false,
    limits: "무제한",
  },

  // 3. GitHub - 완전 무료 (개발자 대상)
  github: {
    name: "GitHub",
    icon: "🐙",
    available: true,
    businessRequired: false,
    limits: "무제한",
  },

  // 4. 네이버 - 개인 서비스 가능
  naver: {
    name: "네이버",
    icon: "🟢",
    available: true,
    businessRequired: false,
    limits: "월 1만명까지",
  },
}
