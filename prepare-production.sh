#!/bin/bash

echo "🚀 MarketAI 프로덕션 배포 준비 중..."

# 1. 의존성 설치
echo "📦 의존성 설치 중..."
npm install

# 2. TypeScript 타입 체크
echo "🔍 TypeScript 타입 체크 중..."
npx tsc --noEmit

# 3. ESLint 검사
echo "🔧 코드 품질 검사 중..."
npm run lint

# 4. 프로덕션 빌드
echo "🏗️ 프로덕션 빌드 중..."
npm run build

# 5. 환경 변수 체크
echo "🔐 환경 변수 확인 중..."
if [ ! -f .env.local ]; then
    echo "⚠️ .env.local 파일이 없습니다. Firebase 설정을 확인해주세요."
    echo "필요한 환경 변수:"
    echo "- NEXT_PUBLIC_FIREBASE_API_KEY"
    echo "- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    echo "- NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    echo "- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    echo "- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    echo "- NEXT_PUBLIC_FIREBASE_APP_ID"
fi

echo "✅ 프로덕션 배포 준비 완료!"
echo ""
echo "🌐 배포 명령어:"
echo "- Vercel: vercel --prod"
echo "- Netlify: npm run build && netlify deploy --prod"
echo "- 기타: npm start"
echo ""
echo "🔗 도메인 연결 후 Firebase 설정에서 승인된 도메인을 추가해주세요."
