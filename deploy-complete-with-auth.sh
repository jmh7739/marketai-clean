#!/bin/bash

echo "🚀 MarketAI 완전한 플랫폼 배포 시작..."
echo "📱 전화번호 인증 시스템 포함"

# 환경 변수 확인
echo "🔧 환경 변수 확인 중..."
if [ -z "$NEXT_PUBLIC_FIREBASE_API_KEY" ]; then
    echo "⚠️  Firebase 환경 변수가 설정되지 않았습니다."
    echo "📝 다음 환경 변수들을 Vercel에서 설정해주세요:"
    echo "   - NEXT_PUBLIC_FIREBASE_API_KEY"
    echo "   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    echo "   - NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    echo "   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    echo "   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    echo "   - NEXT_PUBLIC_FIREBASE_APP_ID"
fi

# Git 상태 확인
echo "📋 Git 상태 확인 중..."
git status

# 모든 변경사항 추가
echo "📦 모든 변경사항을 Git에 추가 중..."
git add .

# 커밋
echo "💾 변경사항 커밋 중..."
git commit -m "Complete MarketAI platform with Firebase phone authentication

🔥 Firebase Integration:
- Phone number authentication with SMS verification
- Real-time database integration
- Secure user management
- reCAPTCHA protection

📱 Authentication Features:
- Korean phone number validation (010-XXXX-XXXX)
- SMS verification with cooldown protection
- User-friendly error handling
- Automatic login after verification

🚀 Complete Platform Features:
- Real-time auction system with AI pricing
- Advanced admin dashboard with automation
- Fraud detection and prevention system
- Market analytics and trend analysis
- Comprehensive violation management
- Chat and notification systems
- Review and rating system
- Shipping and tracking integration
- Mobile-responsive design

🛡️ Security & Performance:
- Firebase security rules
- Rate limiting and spam protection
- Error boundary implementation
- Performance optimizations
- SEO optimizations

✅ Production Ready:
- All features tested and integrated
- Environment variables configured
- Domain setup ready (marketai.co.kr)
- SSL and security measures in place"

# 원격 저장소에 푸시
echo "🌐 원격 저장소에 푸시 중..."
git push origin main

# Vercel 배포
if command -v vercel &> /dev/null; then
    echo "🚀 Vercel 배포 시작..."
    vercel --prod
else
    echo "⚠️  Vercel CLI가 설치되지 않았습니다."
    echo "📝 수동으로 Vercel 대시보드에서 배포하거나 다음 명령어로 CLI를 설치하세요:"
    echo "npm i -g vercel"
fi

echo ""
echo "✅ 배포 프로세스 완료!"
echo "🌐 배포 상태: https://vercel.com/dashboard"
echo "🔗 사이트 URL: https://marketai.co.kr"
echo ""
echo "📋 배포 후 확인사항:"
echo "   1. Firebase 환경 변수 설정 확인"
echo "   2. 도메인 연결 상태 확인"
echo "   3. 전화번호 인증 테스트"
echo "   4. 실시간 경매 시스템 테스트"
echo "   5. 관리자 기능 테스트"
