#!/bin/bash

echo "🔥 Firebase 완전 초기화 시작..."

# 1. 개발 서버 중지
echo "1. 개발 서버 중지 중..."
pkill -f "next dev" 2>/dev/null || true

# 2. 캐시 완전 삭제
echo "2. 캐시 완전 삭제 중..."
rm -rf .next
rm -rf node_modules/.cache
npm cache clean --force

# 3. Firebase 재설정
echo "3. Firebase 재설정..."
echo "Firebase Console에서 다음을 확인하세요:"
echo "   ✅ Authentication > Sign-in method > Phone 활성화"
echo "   ✅ Authentication > Settings > Authorized domains:"
echo "      - localhost"
echo "      - 127.0.0.1"
echo "   ✅ Authentication > Sign-in method > Phone > Test phone numbers:"
echo "      - +82 10-1234-5678 → 123456"

# 4. 환경변수 확인
echo "4. 환경변수 확인..."
if [ -f ".env.local" ]; then
    echo "   ✅ .env.local 존재"
else
    echo "   ❌ .env.local 파일이 없습니다!"
    echo "   Firebase 설정을 .env.local에 추가하세요"
fi

# 5. 개발 서버 재시작
echo "5. 개발 서버 재시작..."
npm run dev &

echo ""
echo "🎯 테스트 방법:"
echo "1. http://localhost:3000/auth/signup 접속"
echo "2. 기본 정보 입력 후 다음 단계"
echo "3. 전화번호에 '010-1234-5678' 입력"
echo "4. 인증번호 발송 클릭"
echo "5. 인증번호에 '123456' 입력"
echo "6. 회원가입 완료!"
echo ""
echo "🚨 실제 번호 테스트 시 SMS 요금이 발생할 수 있습니다."
