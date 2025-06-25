# MarketAI - AI-Powered Auction Platform

🚀 **실시간 경매 플랫폼** - AI 기반 상품 분석과 자동화된 경매 시스템

## ✨ 주요 기능

### 🎯 **핵심 경매 시스템**
- 실시간 입찰 시스템
- AI 기반 상품 분석 및 가격 추천
- 자동 재경매 시스템
- 즉시구매 옵션

### 🔐 **사용자 관리**
- 전화번호 인증 시스템
- 위반 관리 및 제재 시스템
- 사용자 평점 및 리뷰

### 🤖 **AI 및 자동화**
- 상품 이미지 자동 분석
- 사기 탐지 시스템
- 스팸 필터링
- 가격 이상 패턴 감지

### 📊 **관리 도구**
- 실시간 관리자 대시보드
- 시장 분석 및 트렌드
- 자동화 시스템 관리
- 사용자 신고 처리

### 💬 **소통 기능**
- 실시간 채팅 시스템
- 알림 시스템
- 고객 지원

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Deployment**: Vercel
- **State Management**: React Context API

## 🚀 배포 방법

### 1. 환경 변수 설정
\`\`\`bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_SITE_URL=https://marketai.co.kr
\`\`\`

### 2. 자동 배포
\`\`\`bash
npm run deploy
\`\`\`

### 3. 수동 배포
\`\`\`bash
git add .
git commit -m "Deploy MarketAI platform"
git push origin main
vercel --prod
\`\`\`

## 📱 주요 페이지

- **홈페이지** (`/`) - 메인 경매 목록
- **상품 등록** (`/sell`) - AI 기반 상품 등록
- **경매 상세** (`/product/[id]`) - 실시간 입찰
- **마이페이지** (`/my-account`) - 사용자 관리
- **관리자** (`/admin`) - 플랫폼 관리
- **채팅** (`/chat`) - 실시간 소통

## 🔒 보안 기능

- XSS 방지
- CSRF 보호
- 콘텐츠 보안 정책
- 사기 탐지 시스템
- 자동 스팸 필터링

## 📞 지원

- 이메일: support@marketai.co.kr
- 전화: 1588-1234
- 고객센터: 평일 09:00-18:00

## 📄 라이선스

MIT License - 자세한 내용은 LICENSE 파일을 참조하세요.

---

**MarketAI** - 더 스마트한 경매, 더 안전한 거래 🎯
