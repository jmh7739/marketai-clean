#!/bin/bash

echo "🚀 MarketAI Vercel 배포 시작..."

# 1. 의존성 설치
echo "📦 의존성 설치 중..."
npm install

# 2. 빌드 테스트
echo "🔨 빌드 테스트 중..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 빌드 실패! 오류를 확인하세요."
    exit 1
fi

# 3. Vercel CLI 설치 (없는 경우)
if ! command -v vercel &> /dev/null; then
    echo "📥 Vercel CLI 설치 중..."
    npm install -g vercel
fi

# 4. Vercel 로그인 (필요한 경우)
echo "🔐 Vercel 로그인 확인..."
vercel whoami

# 5. 프로젝트 배포
echo "🌐 Vercel에 배포 중..."
vercel --prod

# 6. 도메인 설정 (marketai.co.kr)
echo "🔗 도메인 설정 중..."
vercel domains add marketai.co.kr
vercel alias set your-vercel-url.vercel.app marketai.co.kr

echo "✅ 배포 완료!"
echo "🌍 사이트 주소: https://marketai.co.kr"
echo "🔧 Vercel 대시보드: https://vercel.com/dashboard"
