#!/bin/bash

echo "🔧 패키지 에러 수정 중..."

# 모든 프로세스 종료
echo "⏹️ 개발 서버 종료 중..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# 완전 정리
echo "🧹 완전 정리 중..."
rm -rf node_modules
rm -rf package-lock.json
rm -rf .next
rm -rf .swc

# npm 캐시 정리
echo "🧹 npm 캐시 정리 중..."
npm cache clean --force

# 새로운 package.json으로 설치
echo "📦 새로운 의존성 설치 중..."
npm install --legacy-peer-deps

echo "✅ 패키지 에러 수정 완료!"
echo "🚀 이제 npm run dev를 실행하세요."
