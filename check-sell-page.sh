#!/bin/bash

echo "🔍 sell 페이지 확인 중..."

# sell 페이지 파일 존재 확인
if [ -f "app/sell/page.tsx" ]; then
    echo "✅ app/sell/page.tsx 파일 존재"
    
    # 배송 관련 코드 확인
    if grep -q "courierDelivery" app/sell/page.tsx; then
        echo "✅ 배송 관련 코드 발견"
    else
        echo "❌ 배송 관련 코드 없음"
    fi
    
    if grep -q "택배 배송" app/sell/page.tsx; then
        echo "✅ 택배 배송 텍스트 발견"
    else
        echo "❌ 택배 배송 텍스트 없음"
    fi
else
    echo "❌ app/sell/page.tsx 파일 없음"
fi

echo ""
echo "🔄 개발 서버를 재시작하세요:"
echo "1. Ctrl+C로 서버 종료"
echo "2. npm run dev로 재시작"
echo "3. 브라우저에서 Ctrl+Shift+R로 하드 리프레시"
