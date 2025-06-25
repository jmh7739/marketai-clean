#!/bin/bash

echo "🔧 의존성 충돌 해결 중..."

# 현재 서버 종료
echo "⏹️ 개발 서버 종료 중..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# node_modules와 package-lock.json 삭제
echo "🧹 기존 의존성 정리 중..."
rm -rf node_modules
rm -rf package-lock.json

# npm 캐시 정리
echo "🧹 npm 캐시 정리 중..."
npm cache clean --force

# legacy-peer-deps 플래그로 설치
echo "📦 의존성 재설치 중 (legacy-peer-deps 사용)..."
npm install --legacy-peer-deps

# 필요한 패키지들 개별 설치
echo "📦 Radix UI 패키지 설치 중..."
npm install --legacy-peer-deps @radix-ui/react-slot @radix-ui/react-checkbox @radix-ui/react-label @radix-ui/react-select

# 유틸리티 패키지 설치
echo "📦 유틸리티 패키지 설치 중..."
npm install --legacy-peer-deps class-variance-authority clsx tailwind-merge lucide-react tailwindcss-animate

echo "✅ 의존성 설치 완료!"

# TypeScript 컴파일 체크
echo "🔍 TypeScript 에러 체크 중..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript 컴파일 성공!"
    echo "🚀 개발 서버 시작 중..."
    npm run dev
else
    echo "⚠️ TypeScript 에러가 있을 수 있습니다."
    echo "🔧 수동으로 npm run dev를 실행해주세요."
fi
