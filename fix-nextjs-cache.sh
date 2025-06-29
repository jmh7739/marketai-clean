#!/bin/bash

echo "🧹 Next.js 캐시 완전 정리 중..."

# Next.js 캐시 디렉토리 삭제
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

# npm/yarn 캐시도 정리
if command -v yarn &> /dev/null; then
    echo "📦 Yarn 캐시 정리 중..."
    yarn cache clean
else
    echo "📦 npm 캐시 정리 중..."
    npm cache clean --force
fi

# 의존성 재설치
echo "🔄 의존성 재설치 중..."
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

# 개발 서버 시작
echo "🚀 개발 서버 시작 중..."
if command -v yarn &> /dev/null; then
    yarn dev
else
    npm run dev
fi
