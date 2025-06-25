#!/bin/bash

echo "🔥 Firebase Authentication 설치 중..."

# Firebase SDK 설치
npm install firebase

echo "✅ Firebase 설치 완료!"
echo ""
echo "🔧 다음 단계:"
echo "1. Firebase 콘솔에서 프로젝트 생성"
echo "2. Authentication > Sign-in method > Phone 활성화"
echo "3. .env.local 파일에 Firebase 설정 추가"
echo ""
echo "📋 Firebase 설정 방법:"
echo "1. https://console.firebase.google.com 접속"
echo "2. 새 프로젝트 생성"
echo "3. Authentication > 시작하기"
echo "4. Sign-in method > Phone > 사용 설정"
echo "5. 프로젝트 설정 > 일반 > 웹 앱 추가"
echo "6. 설정 정보를 .env.local에 복사"
echo ""
echo "🎯 준비 완료 후 npm run dev로 테스트하세요!"
