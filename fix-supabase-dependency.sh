#!/bin/bash

echo "🔧 Supabase 의존성 설치 중..."

# Supabase 클라이언트 설치
npm install @supabase/supabase-js

# 추가 필요한 패키지들 설치
npm install @supabase/auth-helpers-nextjs
npm install @supabase/auth-helpers-react

echo "✅ Supabase 의존성 설치 완료!"
echo "🚀 이제 빌드가 성공할 것입니다."

# 개발 서버 재시작
echo "📱 개발 서버 재시작 중..."
npm run dev
