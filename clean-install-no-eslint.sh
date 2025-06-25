#!/bin/bash

echo "🧹 완전 정리 및 ESLint 없이 설치..."

# 모든 프로세스 종료
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# 완전 정리
rm -rf node_modules
rm -rf package-lock.json
rm -rf .next
rm -rf .swc

# npm 캐시 정리
npm cache clean --force

# .npmrc 설정
echo "legacy-peer-deps=true" > .npmrc

# 기본 패키지 설치
echo "📦 기본 Next.js 패키지 설치 중..."
npm install next@14.0.4 react@^18.2.0 react-dom@^18.2.0

# TypeScript 설치
echo "📦 TypeScript 설치 중..."
npm install --save-dev typescript @types/react @types/react-dom @types/node

# Tailwind CSS 설치
echo "📦 Tailwind CSS 설치 중..."
npm install --save-dev tailwindcss postcss autoprefixer

# UI 라이브러리 설치
echo "📦 UI 라이브러리 설치 중..."
npm install @radix-ui/react-slot @radix-ui/react-checkbox @radix-ui/react-label @radix-ui/react-select

# 유틸리티 라이브러리 설치
echo "📦 유틸리티 라이브러리 설치 중..."
npm install class-variance-authority clsx tailwind-merge lucide-react tailwindcss-animate

echo "✅ 설치 완료! ESLint는 제외했습니다."
echo "🚀 이제 npm run dev를 실행하세요."
