@echo off
echo 레이아웃과 헤더 업데이트 중...

echo 개발 서버 종료 중...
taskkill /f /im node.exe 2>nul

echo 캐시 삭제 중...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo TypeScript 서버 재시작...
timeout /t 2 /nobreak >nul

echo 개발 서버 시작 중...
start cmd /k "npm run dev"

echo 완료! 브라우저에서 Ctrl+Shift+R로 새로고침하세요.
pause
