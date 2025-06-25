#!/bin/bash

echo "🎯 최소 작동 설정..."

# 필수 파일들만 확인하고 시작
echo "📋 필수 파일 확인 중..."

# package.json 확인
if [ ! -f "package.json" ]; then
    echo "❌ package.json 없음"
    exit 1
fi

# next.config.js 확인 및 생성
if [ ! -f "next.config.js" ]; then
    echo "⚙️ next.config.js 생성 중..."
    cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
EOF
fi

# .next 폴더 삭제
rm -rf .next

# 바로 시작
echo "🚀 개발 서버 시작..."
npm run dev
