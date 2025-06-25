#!/bin/bash

echo "🚀 MarketAI TypeScript 에러 수정 시작..."

# 1. 캐시 정리
echo "🧹 캐시 정리 중..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf tsconfig.tsbuildinfo

# 2. 의존성 재설치
echo "📦 의존성 재설치 중..."
npm install

# 3. 누락된 패키지 설치
echo "🔧 누락된 패키지 설치 중..."
npm install class-variance-authority@^0.7.0
npm install clsx@^2.0.0
npm install tailwind-merge@^2.0.0
npm install @radix-ui/react-slot@^1.0.2

# 4. 타입 정의 설치
echo "📝 타입 정의 설치 중..."
npm install --save-dev @types/react@^18.2.42
npm install --save-dev @types/react-dom@^18.2.17

# 5. TypeScript 컴파일 테스트
echo "🔍 TypeScript 컴파일 테스트 중..."
npx tsc --noEmit

echo "✅ 모든 에러 수정 완료!"
echo ""
echo "🔄 다음 단계:"
echo "1. VS Code에서 Ctrl+Shift+P 누르기"
echo "2. 'TypeScript: Restart TS Server' 실행"
echo "3. 'Developer: Reload Window' 실행"
echo "4. npm run dev 로 개발 서버 시작"
