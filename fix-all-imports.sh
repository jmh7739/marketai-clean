#!/bin/bash

echo "🚀 모든 import 에러 수정 시작..."

# 1. 캐시 정리
echo "🧹 캐시 정리 중..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf tsconfig.tsbuildinfo

# 2. node_modules 완전 삭제 후 재설치
echo "📦 의존성 완전 재설치 중..."
rm -rf node_modules
rm -rf package-lock.json
npm install

# 3. 특정 패키지 최신 버전으로 설치
echo "🔧 문제 패키지들 최신 버전으로 설치 중..."
npm install clsx@latest
npm install tailwind-merge@latest
npm install class-variance-authority@latest
npm install @radix-ui/react-slot@latest

# 4. TypeScript 타입 체크
echo "🔍 TypeScript 에러 체크 중..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ 모든 import 에러 수정 완료!"
else
    echo "⚠️  일부 에러가 남아있을 수 있습니다."
fi

echo ""
echo "🔄 다음 단계:"
echo "1. VS Code에서 Ctrl+Shift+P"
echo "2. 'TypeScript: Restart TS Server' 실행"
echo "3. 'Developer: Reload Window' 실행"
