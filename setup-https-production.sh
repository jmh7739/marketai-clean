#!/bin/bash

echo "🚀 MarketAI 프로덕션 환경 설정 시작..."

# 1. 의존성 설치
echo "📦 의존성 설치 중..."
npm install

# 2. 빌드 테스트
echo "🔨 프로덕션 빌드 테스트..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 빌드 성공!"
else
    echo "❌ 빌드 실패. 오류를 확인하세요."
    exit 1
fi

# 3. 환경 변수 체크
echo "🔍 환경 변수 확인..."
if [ -z "$NEXT_PUBLIC_FIREBASE_API_KEY" ]; then
    echo "⚠️  Firebase 환경 변수가 설정되지 않았습니다."
    echo "Vercel 대시보드에서 다음 환경 변수를 설정하세요:"
    echo "- NEXT_PUBLIC_FIREBASE_API_KEY"
    echo "- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    echo "- NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    echo "- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    echo "- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    echo "- NEXT_PUBLIC_FIREBASE_APP_ID"
fi

# 4. Git 커밋 및 푸시
echo "📤 Git 커밋 및 푸시..."
git add .
git commit -m "Production ready: Complete MarketAI platform with HTTPS and real database"
git push origin main

# 5. Vercel 배포
echo "🚀 Vercel 배포 시작..."
if command -v vercel &> /dev/null; then
    vercel --prod
    echo "✅ 배포 완료!"
    echo "🌐 https://marketai.co.kr 에서 확인하세요!"
else
    echo "⚠️  Vercel CLI가 설치되지 않았습니다."
    echo "npm install -g vercel 로 설치 후 다시 실행하세요."
fi

echo "🎉 MarketAI 프로덕션 설정 완료!"
