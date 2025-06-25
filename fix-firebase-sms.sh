#!/bin/bash

echo "🔧 Firebase SMS 문제 해결 중..."

# Firebase 프로젝트 설정 확인
echo "1. Firebase 프로젝트 설정 확인"
echo "   - Firebase Console > Authentication > Sign-in method"
echo "   - Phone 인증 활성화 확인"
echo "   - reCAPTCHA 설정 확인"

# 환경변수 확인
echo "2. 환경변수 확인"
if [ -f ".env.local" ]; then
    echo "   ✅ .env.local 파일 존재"
    if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY" .env.local; then
        echo "   ✅ Firebase API Key 설정됨"
    else
        echo "   ❌ Firebase API Key 누락"
    fi
else
    echo "   ❌ .env.local 파일 없음"
fi

# Firebase SDK 버전 확인
echo "3. Firebase SDK 버전 확인"
npm list firebase

echo ""
echo "🚨 Firebase SMS 문제 해결 방법:"
echo "1. Firebase Console에서 Blaze 플랜 확인"
echo "2. Authentication > Settings > Authorized domains에 localhost:3000 추가"
echo "3. reCAPTCHA 설정을 'invisible'에서 'normal'로 변경"
echo "4. 테스트 전화번호 설정: Authentication > Sign-in method > Phone > Test phone numbers"
echo ""
echo "📱 임시 해결책: 이메일 가입 사용"
echo "   URL: http://localhost:3000/auth/email-signup"
echo ""
echo "🔑 관리자 로그인"
echo "   URL: http://localhost:3000/admin/login"
echo "   계정: admin@marketai.co.kr / MarketAI2024!@#"
