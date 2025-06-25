#!/bin/bash

echo "🔧 Firebase 전화번호 인증 문제 해결 중..."

# 1. Firebase 관련 패키지 재설치
echo "📦 Firebase 패키지 재설치..."
npm uninstall firebase
npm install firebase@latest

# 2. 환경 변수 확인
echo "🔍 환경 변수 확인..."
if [ -f .env.local ]; then
    echo "✅ .env.local 파일 존재"
    grep "NEXT_PUBLIC_FIREBASE" .env.local || echo "❌ Firebase 환경 변수가 설정되지 않았습니다"
else
    echo "❌ .env.local 파일이 없습니다"
    echo "📝 .env.local 파일을 생성하고 Firebase 설정을 추가해주세요"
fi

# 3. Firebase 프로젝트 설정 확인 안내
echo ""
echo "🔥 Firebase Console에서 확인해야 할 사항:"
echo "1. Authentication > Sign-in method > Phone 활성화"
echo "2. Authentication > Settings > Authorized domains에 도메인 추가"
echo "3. 프로젝트 설정에서 SHA 인증서 지문 추가 (Android용)"
echo "4. reCAPTCHA 설정 확인"
echo ""

# 4. 개발 서버 재시작
echo "🔄 개발 서버 재시작..."
pkill -f "next dev" 2>/dev/null || true
sleep 2
npm run dev &

echo "✅ Firebase 전화번호 인증 설정 완료!"
echo "🌐 브라우저에서 http://localhost:3000/auth/signup 접속하여 테스트해주세요"
