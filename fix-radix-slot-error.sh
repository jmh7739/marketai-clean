#!/bin/bash

echo "🔧 @radix-ui/react-slot 에러 수정 중..."

# 현재 서버 종료
echo "⏹️ 개발 서버 종료 중..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# 잠시 대기
sleep 2

# 누락된 패키지 설치
echo "📦 누락된 Radix UI 패키지 설치 중..."
npm install @radix-ui/react-slot@^1.0.2

# 다른 필요한 패키지들도 함께 설치
echo "📦 추가 필요 패키지 설치 중..."
npm install class-variance-authority@^0.7.0
npm install clsx@^2.1.0
npm install tailwind-merge@^2.2.0

# 캐시 정리
echo "🧹 캐시 정리 중..."
rm -rf .next
rm -rf node_modules/.cache

# TypeScript 컴파일 체크
echo "🔍 TypeScript 에러 체크 중..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript 컴파일 성공!"
    echo "🚀 개발 서버 시작 중..."
    npm run dev
else
    echo "❌ TypeScript 에러가 있습니다."
    echo "🔧 수동으로 npm run dev를 실행해주세요."
fi
