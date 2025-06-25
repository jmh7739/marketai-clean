#!/bin/bash

echo "🔧 Next.js 빌드 오류 해결 중..."

# .next 폴더 삭제
echo "📁 .next 폴더 삭제 중..."
rm -rf .next

# node_modules 캐시 정리
echo "🧹 Node.js 캐시 정리 중..."
npm cache clean --force

# 의존성 재설치
echo "📦 의존성 재설치 중..."
rm -rf node_modules
rm package-lock.json
npm install

# TypeScript 캐시 정리
echo "🔍 TypeScript 캐시 정리 중..."
npx tsc --build --clean

# 개발 서버 재시작
echo "🚀 개발 서버 시작 중..."
npm run dev

echo "✅ 빌드 오류 해결 완료!"
