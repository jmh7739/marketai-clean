#!/bin/bash

echo "⚡ 간단 재시작..."

# 서버 종료
pkill -f "next dev" 2>/dev/null || true

# 캐시만 정리
rm -rf .next

# 바로 재시작
npm run dev
