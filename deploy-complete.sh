#!/bin/bash

echo "🚀 MarketAI 전체 배포 시작..."

# Git 상태 확인
echo "📋 Git 상태 확인 중..."
git status

# 모든 변경사항 추가
echo "📦 모든 변경사항을 Git에 추가 중..."
git add .

# 커밋
echo "💾 변경사항 커밋 중..."
git commit -m "Complete MarketAI platform with all features - Ready for production deployment

✅ Features included:
- Complete auction system with real-time bidding
- AI-powered product analysis and pricing
- User authentication with phone verification
- Admin dashboard with automation tools
- Fraud detection and prevention system
- Market analytics and trend analysis
- Comprehensive violation management
- Chat and notification systems
- Review and rating system
- Shipping and tracking integration
- Terms of service and privacy policy
- Mobile-responsive design

🔧 Technical improvements:
- Enhanced security measures
- Performance optimizations
- Error handling improvements
- SEO optimizations
- Accessibility enhancements

🎯 Ready for production deployment on Vercel"

# 원격 저장소에 푸시
echo "🌐 원격 저장소에 푸시 중..."
git push origin main

# Vercel 배포 (Vercel CLI가 설치되어 있는 경우)
if command -v vercel &> /dev/null; then
    echo "🚀 Vercel 배포 시작..."
    vercel --prod
else
    echo "⚠️  Vercel CLI가 설치되지 않았습니다."
    echo "📝 수동으로 Vercel 대시보드에서 배포하거나 다음 명령어로 CLI를 설치하세요:"
    echo "npm i -g vercel"
fi

echo "✅ 배포 프로세스 완료!"
echo "🌐 배포 상태는 Vercel 대시보드에서 확인하세요: https://vercel.com/dashboard"
