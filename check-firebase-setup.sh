#!/bin/bash

echo "🔍 Firebase 설정 확인 중..."
echo "=============================="

# 환경변수 확인
if [ -f ".env.local" ]; then
    echo "✅ .env.local 파일 존재"
    
    if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY" .env.local; then
        echo "✅ Firebase API Key 설정됨"
    else
        echo "❌ Firebase API Key 누락"
    fi
    
    if grep -q "NEXT_PUBLIC_FIREBASE_PROJECT_ID" .env.local; then
        echo "✅ Firebase Project ID 설정됨"
    else
        echo "❌ Firebase Project ID 누락"
    fi
else
    echo "❌ .env.local 파일이 없습니다"
fi

# Firebase 패키지 확인
if npm list firebase > /dev/null 2>&1; then
    echo "✅ Firebase SDK 설치됨"
else
    echo "❌ Firebase SDK 설치 필요"
    echo "   npm install firebase"
fi

echo ""
echo "🔧 다음 단계:"
echo "1. Firebase 콘솔에서 전화번호 인증 활성화"
echo "2. 승인된 도메인에 localhost:3000 추가"
echo "3. 개발 서버 재시작: npm run dev"
echo ""
echo "📱 테스트 방법:"
echo "1. /auth/signup 페이지 접속"
echo "2. 실제 전화번호 입력 (또는 테스트 번호)"
echo "3. reCAPTCHA 완료 후 인증번호 발송"
