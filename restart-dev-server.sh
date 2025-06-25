#!/bin/bash

echo "🔄 개발 서버 재시작 중..."

# 기존 프로세스 종료
echo "⏹️ 기존 서버 프로세스 종료 중..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# 잠시 대기
sleep 2

# 캐시 정리
echo "🧹 캐시 정리 중..."
rm -rf .next
rm -rf node_modules/.cache

# TypeScript 컴파일 체크
echo "🔍 TypeScript 에러 체크 중..."
npx tsc --noEmit

# 개발 서버 시작
echo "🚀 개발 서버 시작 중..."
npm run dev
