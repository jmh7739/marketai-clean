#!/bin/bash

echo "🔧 로컬 빌드 오류 수정 중..."

# 1. Next.js 캐시 완전 삭제
echo "1. Next.js 캐시 삭제 중..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .next/cache

# 2. 노드 모듈 재설치
echo "2. 노드 모듈 재설치 중..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# 3. 의존성 재설치
echo "3. 의존성 재설치 중..."
npm install

# 4. TypeScript 캐시 삭제
echo "4. TypeScript 캐시 삭제 중..."
rm -rf .tsbuildinfo
npx tsc --build --clean

# 5. 개발 서버 재시작
echo "5. 개발 서버 시작 중..."
npm run dev

echo "✅ 수정 완료! 브라우저에서 http://localhost:3000/auth/signup 접속하세요"
