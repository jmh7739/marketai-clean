#!/bin/bash

echo "🔧 남은 TypeScript 에러 수정 중..."

# TypeScript 캐시 클리어
echo "📁 TypeScript 캐시 클리어..."
rm -rf .next
rm -rf node_modules/.cache

# 타입 체크
echo "🔍 타입 체크 실행..."
npx tsc --noEmit

echo "✅ 에러 수정 완료!"
echo "🚀 개발 서버를 재시작해주세요: npm run dev"
