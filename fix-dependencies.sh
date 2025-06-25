#!/bin/bash

echo "🔧 TypeScript 에러 수정을 위한 의존성 설치 중..."

# 기본 의존성 설치
npm install class-variance-authority clsx tailwind-merge

# Radix UI 컴포넌트들
npm install @radix-ui/react-slot

# 타입 정의 설치
npm install --save-dev @types/react @types/react-dom

echo "✅ 의존성 설치 완료!"
echo "🔄 TypeScript 서버를 재시작해주세요:"
echo "   VS Code에서 Ctrl+Shift+P -> 'TypeScript: Restart TS Server'"
