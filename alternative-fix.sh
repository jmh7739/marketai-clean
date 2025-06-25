#!/bin/bash

echo "🔄 대안 해결 방법..."

# 문제가 되는 패키지 제거
rm -rf node_modules package-lock.json

# .npmrc 설정
echo "legacy-peer-deps=true" > .npmrc
echo "registry=https://registry.npmjs.org/" >> .npmrc

# 기본 패키지부터 차례대로 설치
echo "📦 Next.js 설치 중..."
npm install next@14.0.4 react@^18.2.0 react-dom@^18.2.0

echo "📦 TypeScript 설치 중..."
npm install --save-dev typescript @types/react @types/react-dom @types/node

echo "📦 Tailwind 설치 중..."
npm install --save-dev tailwindcss postcss autoprefixer

echo "📦 ESLint 설치 중..."
npm install --save-dev eslint
# 문제가 되는 @next/eslint-config-next 대신 일반 eslint-config-next 사용
npm install --save-dev eslint-config-next@14.0.4

echo "📦 UI 패키지 설치 중..."
npm install @radix-ui/react-slot @radix-ui/react-checkbox @radix-ui/react-label @radix-ui/react-select
npm install class-variance-authority clsx tailwind-merge lucide-react tailwindcss-animate

echo "✅ 대안 설치 완료!"
