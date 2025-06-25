#!/bin/bash

echo "🔧 Admin Context 오류 수정 중..."

# Next.js 캐시 정리
rm -rf .next
echo "✅ .next 폴더 삭제 완료"

# 타입스크립트 캐시 정리
npx tsc --build --clean
echo "✅ TypeScript 캐시 정리 완료"

# 의존성 재설치
npm install
echo "✅ 의존성 재설치 완료"

# 개발 서버 재시작
echo "🚀 개발 서버 시작 중..."
npm run dev

echo "✨ Admin Context 수정 완료!"
echo "📱 http://localhost:3000/admin/login 에서 테스트하세요"
