#!/bin/bash

echo "🔄 강제 개발 서버 재시작..."

# 모든 Node.js 프로세스 종료
echo "⏹️ 모든 개발 서버 프로세스 종료 중..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "node" 2>/dev/null || true

# 잠시 대기
sleep 3

# 캐시 완전 정리
echo "🧹 모든 캐시 정리 중..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .swc

# 브라우저 캐시도 정리하라고 안내
echo "🌐 브라우저에서 Ctrl+Shift+R (또는 Cmd+Shift+R)로 하드 리프레시 하세요!"

# 개발 서버 재시작
echo "🚀 개발 서버 재시작 중..."
npm run dev
