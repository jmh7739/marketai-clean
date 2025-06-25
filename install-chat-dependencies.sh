#!/bin/bash

echo "🚀 채팅 시스템 의존성 설치 중..."

# Socket.io 관련 패키지 설치
npm install socket.io socket.io-client

echo "✅ 채팅 시스템 의존성 설치 완료!"
echo ""
echo "📱 사용 방법:"
echo "1. ./install-chat-dependencies.sh 실행"
echo "2. npm run dev 로 서버 시작"
echo "3. /chat 페이지에서 채팅 테스트"
echo ""
echo "🎯 테스트 시나리오:"
echo "1. 상품 페이지에서 '판매자와 채팅하기' 클릭"
echo "2. 실시간 메시지 전송/수신 테스트"
echo "3. 타이핑 상태 표시 확인"
echo "4. 읽음 처리 확인"
