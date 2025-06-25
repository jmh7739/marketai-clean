#!/bin/bash

echo "🔍 문제 진단 및 수정..."

# 현재 상태 확인
echo "📋 현재 상태:"
echo "Node.js 버전: $(node --version)"
echo "npm 버전: $(npm --version)"

# package.json 확인
if [ -f "package.json" ]; then
    echo "✅ package.json 존재"
else
    echo "❌ package.json 없음"
fi

# node_modules 확인
if [ -d "node_modules" ]; then
    echo "📁 node_modules 존재 - 삭제 중..."
    rm -rf node_modules
fi

# package-lock.json 확인
if [ -f "package-lock.json" ]; then
    echo "🔒 package-lock.json 존재 - 삭제 중..."
    rm -rf package-lock.json
fi

# npm 캐시 정리
echo "🧹 npm 캐시 정리..."
npm cache clean --force

# 새로 설치
echo "📦 새로 설치 중..."
npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    echo "✅ 설치 성공!"
    echo "🚀 npm run dev를 실행하세요."
else
    echo "❌ 설치 실패 - 수동으로 해결 필요"
fi
