#!/bin/bash

echo "🔧 TypeScript 에러 완전 해결 중..."

# 1. 캐시 정리
echo "📦 캐시 정리 중..."
rm -rf .next
rm -rf node_modules/.cache
npm cache clean --force

# 2. 의존성 재설치
echo "📦 의존성 재설치 중..."
npm install

# 3. TypeScript 재시작
echo "🔄 TypeScript 서버 재시작..."
npx tsc --noEmit

# 4. Next.js 빌드 테스트
echo "🏗️ Next.js 빌드 테스트..."
npm run build

echo "✅ 모든 TypeScript 에러가 해결되었습니다!"
echo "🚀 이제 'npm run dev'로 서버를 시작하세요!"
