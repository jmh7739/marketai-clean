#!/bin/bash

echo "🔐 전화인증 시스템 의존성 설치 중..."

# Radix UI 컴포넌트 설치
npm install @radix-ui/react-dropdown-menu

echo "✅ 의존성 설치 완료!"
echo ""
echo "🚀 전화인증 시스템이 준비되었습니다!"
echo ""
echo "📱 사용 방법:"
echo "1. /auth/phone - 전화번호 입력"
echo "2. /auth/verify - 인증번호 확인 (개발용: 1234)"
echo "3. /auth/profile - 프로필 설정"
echo ""
echo "💡 개발 모드에서는 실제 SMS가 발송되지 않습니다."
echo "   인증번호 1234를 사용하세요!"
