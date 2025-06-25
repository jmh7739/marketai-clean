#!/bin/bash

echo "📦 최소한의 패키지만 설치..."

# 정리
rm -rf node_modules package-lock.json .next
npm cache clean --force

# 기본 Next.js 패키지만 먼저 설치
npm install next@14.0.4 react@^18.2.0 react-dom@^18.2.0

# TypeScript 관련
npm install --save-dev typescript @types/react @types/react-dom @types/node

# Tailwind CSS
npm install --save-dev tailwindcss postcss autoprefixer

# ESLint (문제가 되는 패키지 제외)
npm install --save-dev eslint eslint-config-next@14.0.4

# 필수 UI 패키지들
npm install @radix-ui/react-slot @radix-ui/react-checkbox @radix-ui/react-label @radix-ui/react-select
npm install class-variance-authority clsx tailwind-merge lucide-react tailwindcss-animate

echo "✅ 최소 설치 완료!"
