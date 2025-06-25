#!/bin/bash

echo "🚀 고급 기능 의존성 설치 중..."

# Recharts (차트 라이브러리)
npm install recharts

# Slider 컴포넌트
npm install @radix-ui/react-slider

# Avatar 컴포넌트  
npm install @radix-ui/react-avatar

# PWA 관련
npm install next-pwa
npm install workbox-webpack-plugin

echo "✅ 고급 기능 의존성 설치 완료!"
echo ""
echo "📱 PWA 설정:"
echo "1. public/icons/ 폴더에 아이콘 파일들 추가"
echo "2. next.config.js에 PWA 설정 추가"
echo ""
echo "🎯 사용 가능한 새 기능:"
echo "- 📊 관리자 대시보드 (/admin)"
echo "- 👥 사용자 관리 (/admin/users)"  
echo "- 🚨 신고 관리 (/admin/reports)"
echo "- 🤖 AI 추천 시스템"
echo "- 🔍 고급 검색 필터"
echo "- ⭐ 리뷰 시스템"
echo "- 📱 PWA 모바일 앱"
