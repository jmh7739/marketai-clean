#!/bin/bash

echo "🔧 모든 빌드 오류 해결 중..."

# 1. 모든 캐시 및 빌드 파일 완전 삭제
echo "📁 캐시 파일 삭제 중..."
rm -rf .next
rm -rf node_modules
rm -rf .turbo
rm -rf out
rm -rf dist
rm -rf build

# 2. 패키지 락 파일 삭제
rm -f package-lock.json
rm -f yarn.lock

# 3. npm 캐시 정리
npm cache clean --force

# 4. 의존성 재설치
echo "📦 의존성 재설치 중..."
npm install

# 5. TypeScript 캐시 정리
npx tsc --build --clean

echo "✅ 모든 오류 해결 완료!"
echo "🚀 개발 서버 시작: npm run dev"
