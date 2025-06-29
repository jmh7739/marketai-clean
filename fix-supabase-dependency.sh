#!/bin/bash

echo "🔧 Supabase 의존성 설치 중..."

# Supabase 관련 패키지 설치
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-nextjs
npm install @supabase/auth-helpers-react

echo "✅ Supabase 패키지 설치 완료!"

# Firebase 패키지도 확인
echo "🔥 Firebase 패키지 확인 중..."
npm install firebase

echo "📦 추가 유용한 패키지들 설치 중..."
npm install @types/node
npm install typescript

echo "🚀 모든 의존성 설치 완료!"
echo "이제 'npm run dev'로 개발 서버를 시작하세요."
