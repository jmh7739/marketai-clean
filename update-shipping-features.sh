#!/bin/bash

echo "🚚 배송 기능 업데이트 확인 중..."

# 개발 서버 재시작
echo "개발 서버 재시작 중..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# 캐시 클리어
echo "캐시 클리어 중..."
rm -rf .next 2>/dev/null || true
npm run build 2>/dev/null || true

# 개발 서버 시작
echo "개발 서버 시작 중..."
npm run dev &

echo "✅ 업데이트 완료!"
echo ""
echo "📋 확인해야 할 기능들:"
echo "1. /sell 페이지 접속"
echo "2. 배송 정보 설정 섹션 확인"
echo "3. 무료배송 체크박스 작동 확인"
echo "4. 택배사 선택 드롭다운 확인"
echo "5. 조건부 무료배송 설정 확인"
echo "6. 배송비 미리보기 확인"
echo ""
echo "🌐 브라우저에서 http://localhost:3000/sell 접속하세요!"
