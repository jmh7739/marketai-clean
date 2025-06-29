#!/bin/bash

echo "🔥 Firebase 인증 시스템 설치 중..."

# Firebase SDK 설치
npm install firebase

echo "✅ Firebase SDK 설치 완료"

echo "📋 Firebase 설정 가이드:"
echo "1. https://console.firebase.google.com 접속"
echo "2. 새 프로젝트 생성 또는 기존 프로젝트 선택"
echo "3. Authentication > Sign-in method > Phone 활성화"
echo "4. 프로젝트 설정에서 웹 앱 추가"
echo "5. 환경 변수 설정:"
echo ""
echo "NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key"
echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com"
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id"
echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com"
echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id"
echo "NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id"
echo ""
echo "🚀 설정 완료 후 SMS 인증이 정상 작동합니다!"
