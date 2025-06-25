#!/bin/bash

echo "🔧 TypeScript 에러 수정 중..."

# 필요한 의존성 설치
echo "📦 의존성 설치 중..."
npm install clsx tailwind-merge
npm install -D @types/node

# TypeScript 캐시 클리어
echo "🗑️ TypeScript 캐시 클리어 중..."
rm -rf .next
rm -rf node_modules/.cache

# 타입 체크
echo "🔍 타입 체크 중..."
npx tsc --noEmit

echo "✅ TypeScript 에러 수정 완료!"
echo "🚀 이제 npm run dev로 서버를 시작하세요!"
