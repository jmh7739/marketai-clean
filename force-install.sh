#!/bin/bash

echo "💪 강제 설치 모드..."

# 모든 것 정리
rm -rf node_modules package-lock.json
npm cache clean --force

# 강제 설치
echo "📦 --force 플래그로 설치 중..."
npm install --force

echo "✅ 강제 설치 완료!"
echo "🚀 npm run dev를 실행하세요."
