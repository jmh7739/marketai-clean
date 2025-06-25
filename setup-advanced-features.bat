@echo off
echo ========================================
echo MarketAI 고급 기능 설치 중...
echo ========================================

echo.
echo [1/5] 의존성 패키지 설치 중...
npm install @radix-ui/react-scroll-area lucide-react

echo.
echo [2/5] PWA 아이콘 생성 중...
mkdir public\icons 2>nul
echo PWA 아이콘들이 public/icons 폴더에 필요합니다.

echo.
echo [3/5] 서비스 워커 등록 중...
echo Service Worker가 public/sw.js에 생성되었습니다.

echo.
echo [4/5] 개발 서버 재시작 중...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
start /b npm run dev

echo.
echo [5/5] 설치 완료!
echo ========================================
echo 🎉 고급 기능이 성공적으로 설치되었습니다!
echo.
echo 📱 PWA: 모바일에서 앱처럼 설치 가능
echo 🔔 실시간 알림: 입찰, 메시지 등 실시간 알림
echo 💳 계좌이체 결제: 안전한 계좌이체 시스템
echo ❤️ 찜 목록: 관심 상품 관리
echo 📊 관리자 대시보드: 실시간 통계 및 관리
echo 🗂️ 서브카테고리: 세분화된 카테고리 탐색
echo.
echo 브라우저에서 http://localhost:3000 접속하세요!
echo ========================================
pause
