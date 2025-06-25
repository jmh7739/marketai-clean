#!/bin/bash

echo "🎯 MarketAI 최종 설정 완료!"

# 개발 서버 재시작
echo "🔄 개발 서버 재시작 중..."
pkill -f "next dev" 2>/dev/null || true
rm -rf .next

# 최종 확인
echo "✅ 추가된 페이지들:"
echo "   - /category/[slug] - 카테고리별 상품 목록"
echo "   - /search - 검색 결과 페이지"
echo "   - /my-account - 사용자 계정 관리"
echo "   - /live-auctions - 실시간 경매 페이지"
echo ""
echo "✅ 추가된 컴포넌트들:"
echo "   - LiveAuctionWidget - 실시간 경매 위젯"
echo "   - TrendingKeywords - 실시간 인기 검색어"
echo ""
echo "🚀 개발 서버 시작 중..."
npm run dev

echo ""
echo "🎉 MarketAI 플랫폼이 완성되었습니다!"
echo "🌐 http://localhost:3000 에서 확인하세요."
