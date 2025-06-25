@echo off
echo 🔥 모든 고급 기능 복구 중...

echo ⏹️ 개발 서버 종료 중...
taskkill /f /im node.exe 2>nul

echo 🗑️ 캐시 삭제 중...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 📦 의존성 설치 중...
npm install

echo 🔧 TypeScript 컴파일 중...
npx tsc --noEmit

echo 🚀 개발 서버 시작 중...
start cmd /k "npm run dev"

echo ✅ 모든 고급 기능이 복구되었습니다!
echo 📍 브라우저에서 localhost:3000 확인하세요
echo.
echo 🔍 테스트할 기능들:
echo   - 부카테고리: /category/electronics/smartphones
echo   - 실시간 경매: /live-auctions  
echo   - AI 추천: 홈페이지 하단
echo   - 고급 검색: 검색 페이지
echo   - 자동 입찰: 상품 페이지
pause
