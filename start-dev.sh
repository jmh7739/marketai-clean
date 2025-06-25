#!/bin/bash

echo "🚀 MarketAI 개발 서버 시작..."

# TypeScript 에러 체크
echo "🔍 TypeScript 에러 체크 중..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript 컴파일 성공!"
    echo "🌐 개발 서버 시작 중..."
    npm run dev
else
    echo "❌ TypeScript 에러가 있습니다. 먼저 수정해주세요."
    echo "🔧 에러 수정을 위해 fix-all-errors.sh 를 실행하세요."
fi
