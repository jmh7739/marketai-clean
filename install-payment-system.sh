#!/bin/bash

echo "💳 결제 시스템 의존성 설치 중..."

# Radix UI 컴포넌트들
npm install @radix-ui/react-separator
npm install @radix-ui/react-slider  
npm install @radix-ui/react-avatar

echo "✅ 결제 시스템 설치 완료!"
echo ""
echo "💡 개발용 모의 결제 시스템 특징:"
echo "- 🎯 실제 결제 없이 테스트 가능"
echo "- 💳 다양한 결제 방법 시뮬레이션"
echo "- 📊 결제 성공/실패 시나리오"
echo "- 📱 모바일 친화적 UI"
echo "- 🔒 보안 UI/UX 패턴 적용"
echo ""
echo "🚀 테스트 방법:"
echo "1. 상품 페이지에서 '즉시 구매' 클릭"
echo "2. /payment/[auctionId] 페이지 접속"
echo "3. 다양한 결제 방법 테스트"
echo "4. /my-account/payments에서 결제 내역 확인"
