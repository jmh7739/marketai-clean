#!/bin/bash

echo "🚀 MarketAI 필수 의존성 설치 중..."

cd apps/web

# 보안 관련
npm install isomorphic-dompurify

# Firebase 관련
npm install firebase

# 이미지 처리
npm install sharp

# 유틸리티
npm install uuid
npm install @types/uuid

# 개발 도구
npm install --save-dev @types/dompurify

# 기존 의존성 설치
npm install @radix-ui/react-select @radix-ui/react-label class-variance-authority

echo "✅ 의존성 설치 완료!"
echo "🔧 Firebase 프로젝트 설정을 진행해주세요:"
echo "1. https://console.firebase.google.com 접속"
echo "2. 새 프로젝트 생성"
echo "3. Authentication > Sign-in method > Phone 활성화"
echo "4. Firestore Database 생성"
echo "5. Storage 활성화"
echo "6. 프로젝트 설정에서 웹 앱 추가 후 config 복사"
