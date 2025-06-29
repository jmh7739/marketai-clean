#!/bin/bash

echo "🔧 Supabase 의존성 설치 중..."

# Supabase 관련 패키지 설치
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-nextjs
npm install @supabase/auth-helpers-react

# Firebase 패키지 확인 및 설치
npm install firebase

# 기타 필요한 패키지들
npm install @radix-ui/react-slot
npm install class-variance-authority
npm install clsx
npm install tailwind-merge

echo "✅ 모든 의존성 설치 완료!"
echo "🚀 이제 npm run dev로 개발 서버를 시작하세요."

# 개발 서버 시작 (선택사항)
# npm run dev
