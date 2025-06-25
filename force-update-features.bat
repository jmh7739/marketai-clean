@echo off
echo 🔄 강제 업데이트 시작...

REM 개발 서버 완전 종료
echo 서버 종료 중...
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 >nul

REM 캐시 완전 삭제
echo 캐시 완전 삭제 중...
if exist .next rmdir /s /q .next >nul 2>&1
if exist node_modules\.cache rmdir /s /q node_modules\.cache >nul 2>&1
if exist .turbo rmdir /s /q .turbo >nul 2>&1

REM TypeScript 캐시 삭제
echo TypeScript 캐시 삭제 중...
if exist tsconfig.tsbuildinfo del tsconfig.tsbuildinfo >nul 2>&1

echo.
echo 브라우저에서 Ctrl+Shift+R (강제 새로고침) 하세요!
echo.

REM 개발 서버 재시작
echo 개발 서버 재시작 중...
start /b npm run dev

echo.
echo ✅ 강제 업데이트 완료!
echo.
echo 📋 확인사항:
echo 1. 브라우저에서 Ctrl+Shift+R (강제 새로고침)
echo 2. /sell 페이지 접속
echo 3. 배송 정보 설정 섹션에 이모지와 색상 확인
echo 4. 무료배송 체크박스 작동 확인
echo.
echo 🌐 http://localhost:3000/sell
echo.
pause
