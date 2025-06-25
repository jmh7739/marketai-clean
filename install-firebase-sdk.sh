#!/bin/bash
echo "🔥 Firebase SDK 설치 중..."

# Firebase SDK 설치
npm install firebase

# 추가 필요한 패키지들
npm install @firebase/auth @firebase/firestore

echo "✅ Firebase SDK 설치 완료!"
echo "이제 .env.local 파일에 Firebase 설정을 입력하세요."
