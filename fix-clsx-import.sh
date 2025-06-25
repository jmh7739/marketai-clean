#!/bin/bash

echo "🔧 clsx import 에러 수정 중..."

# clsx 패키지 재설치
echo "📦 clsx 패키지 재설치 중..."
npm uninstall clsx
npm install clsx@^2.0.0

# tailwind-merge도 함께 재설치
echo "📦 tailwind-merge 패키지 재설치 중..."
npm uninstall tailwind-merge
npm install tailwind-merge@^2.0.0

echo "✅ clsx import 에러 수정 완료!"
echo "🔄 TypeScript 서버를 재시작해주세요:"
echo "   VS Code에서 Ctrl+Shift+P -> 'TypeScript: Restart TS Server'"
