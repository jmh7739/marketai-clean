#!/bin/bash

echo "🔧 빌드 문제 해결 중..."

# 캐시 및 빌드 파일 삭제
rm -rf .next
rm -rf node_modules/.cache
rm -rf out

# 의존성 재설치
npm install

# TypeScript 캐시 삭제
npx tsc --build --clean

# 개발 서버 재시작
echo "✅ 캐시 정리 완료. 개발 서버를 재시작하세요:"
echo "npm run dev"
