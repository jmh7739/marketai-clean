#!/bin/bash

echo "🔄 강제 업데이트 시작..."

# 개발 서버 완전 종료
echo "서버 종료 중..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "node" 2>/dev/null || true
sleep 3

# 캐시 완전 삭제
echo "캐시 완전 삭제 중..."
rm -rf .next 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .turbo 2>/dev/null || true

# TypeScript 캐시 삭제
echo "TypeScript 캐시 삭제 중..."
rm -rf tsconfig.tsbuildinfo 2>/dev/null || true

# 브라우저 캐시 무시하고 새로고침 안내
echo "브라우저에서 Ctrl+Shift+R (강제 새로고침) 하세요!"

# 개발 서버 재시작
echo "개발 서버 재시작 중..."
npm run dev &

echo ""
echo "✅ 강제 업데이트 완료!"
echo ""
echo "📋 확인사항:"
echo "1. 브라우저에서 Ctrl+Shift+R (강제 새로고침)"
echo "2. /sell 페이지 접속"
echo "3. 배송 정보 설정 섹션에 이모지와 색상 확인"
echo "4. 무료배송 체크박스 작동 확인"
echo ""
echo "🌐 http://localhost:3000/sell"
