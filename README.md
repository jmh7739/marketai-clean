# 🏪 MarketAI - 스마트 경매 플랫폼

실시간 경매와 AI 추천 시스템을 갖춘 차세대 온라인 마켓플레이스

## ✨ 주요 기능

- 🔥 **실시간 경매 시스템**
- 🤖 **AI 기반 상품 추천**
- 📱 **반응형 모바일 최적화**
- 🔐 **Firebase 인증 시스템**
- 💳 **안전한 결제 시스템**
- 📊 **실시간 통계 대시보드**

## 🚀 빠른 시작

### 1. 프로젝트 클론
\`\`\`bash
git clone https://github.com/your-username/marketai.git
cd marketai
\`\`\`

### 2. 의존성 설치
\`\`\`bash
npm install
\`\`\`

### 3. 환경 변수 설정
\`\`\`bash
cp .env.example .env.local
# .env.local 파일을 편집하여 Firebase 설정 추가
\`\`\`

### 4. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

### 5. 브라우저에서 확인
\`\`\`
http://localhost:3000
\`\`\`

## 🔧 프로덕션 배포

### 자동 배포 준비
\`\`\`bash
chmod +x prepare-production.sh
./prepare-production.sh
\`\`\`

### Vercel 배포
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

### 환경 변수 설정 (프로덕션)
Vercel 대시보드에서 다음 환경 변수를 설정하세요:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 📁 프로젝트 구조

\`\`\`
marketai/
├── app/                    # Next.js 13+ App Router
│   ├── page.tsx           # 메인 페이지
│   ├── search/            # 검색 관련 페이지
│   ├── category/          # 카테고리 페이지
│   ├── live-auctions/     # 실시간 경매
│   ├── ending-soon/       # 마감임박 경매
│   └── auth/              # 인증 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── Hero.tsx          # 히어로 섹션
│   ├── Header.tsx        # 헤더
│   └── Footer.tsx        # 푸터
├── lib/                  # 유틸리티 함수
│   ├── firebase.ts       # Firebase 설정
│   └── utils.ts          # 공통 유틸리티
├── types/                # TypeScript 타입 정의
└── public/               # 정적 파일
\`\`\`

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Deployment**: Vercel
- **Icons**: Lucide React

## 🔥 Firebase 설정

### 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Authentication 활성화 (이메일/비밀번호, 전화번호)
3. Firestore Database 생성
4. Storage 활성화

### 2. 웹 앱 등록
1. 프로젝트 설정에서 웹 앱 추가
2. 설정 정보를 `.env.local`에 추가

### 3. 보안 규칙 설정
\`\`\`javascript
// Firestore 규칙
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

## 📱 주요 페이지

- **홈페이지** (`/`) - 메인 대시보드
- **검색** (`/search`) - 상품 검색
- **카테고리** (`/category/[slug]`) - 카테고리별 상품
- **실시간 경매** (`/live-auctions`) - 진행 중인 경매
- **마감임박** (`/ending-soon`) - 곧 종료되는 경매
- **상품 등록** (`/sell`) - 새 상품 등록
- **로그인/회원가입** (`/auth/*`) - 사용자 인증

## 🎨 디자인 시스템

- **Primary Color**: Blue (#3B82F6)
- **Secondary Color**: Gray (#6B7280)
- **Success Color**: Green (#10B981)
- **Warning Color**: Orange (#F59E0B)
- **Error Color**: Red (#EF4444)

## 🔒 보안 기능

- Firebase Authentication
- CSRF 보호
- XSS 방지
- 안전한 결제 처리
- 데이터 암호화

## 📊 성능 최적화

- Next.js Image 최적화
- 코드 스플리팅
- 서버 사이드 렌더링
- 정적 생성 (ISG)
- CDN 캐싱

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 있거나 질문이 있으시면:
- GitHub Issues 생성
- 이메일: support@marketai.co.kr
- 문서: [docs.marketai.co.kr](https://docs.marketai.co.kr)

---

**MarketAI** - 스마트한 경매, 더 나은 거래 🚀
"Deploy fix" 
