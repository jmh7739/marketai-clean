#!/bin/bash

echo "⚡ ESLint 건너뛰고 바로 시작..."

# 서버 종료
pkill -f "next dev" 2>/dev/null || true

# 캐시 정리
rm -rf .next

# 개발 서버 시작 (ESLint 무시)
echo "🚀 개발 서버 시작 중..."
npm run dev

echo "✅ 서버가 시작되었습니다!"
echo "🌐 브라우저에서 http://localhost:3000 을 열어보세요."
