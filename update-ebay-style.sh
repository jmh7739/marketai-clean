#!/bin/bash

echo "🎯 이베이 스타일 경매 시스템 업데이트 완료!"

# 개발 서버 재시작
echo "🔄 개발 서버 재시작 중..."
pkill -f "next dev" 2>/dev/null || true
rm -rf .next

echo "✅ 변경사항:"
echo "   - 헤더에서 카테고리 네비게이션 제거"
echo "   - 이베이 스타일 자동 입찰 시스템 구현"
echo "   - 프록시 입찰 기능 추가"
echo "   - 자동/수동 입찰 선택 가능"
echo ""
echo "🔧 자동 입찰 시스템 특징:"
echo "   - 최대 입찰가 설정시 자동으로 재입찰"
echo "   - 다른 입찰자보다 최소 단위만큼 높게 입찰"
echo "   - 최대 입찰가 내에서만 작동"
echo "   - 실시간 입찰 상태 표시"
echo ""
echo "🚀 개발 서버 시작 중..."
npm run dev

echo ""
echo "🎉 이베이 스타일 경매 시스템이 완성되었습니다!"
echo "🌐 http://localhost:3000/product/1 에서 확인하세요."
