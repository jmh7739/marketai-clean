#!/bin/bash

echo "🔄 완전 초기화 및 재설치 시작..."

# 1. 모든 파일 삭제
rm -rf .next
rm -rf node_modules
rm -rf .turbo
rm -rf out
rm -rf dist
rm -f package-lock.json
rm -f yarn.lock

# 2. npm 캐시 완전 정리
npm cache clean --force

# 3. 의존성 재설치
echo "📦 의존성 설치 중..."
npm install

# 4. 개발 서버 시작
echo "🚀 개발 서버 시작..."
npm run dev
