@echo off
echo 헤더와 사이드바 복구 중...

echo 개발 서버 종료 중...
taskkill /f /im node.exe 2>nul

echo 캐시 삭제 중...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 의존성 재설치 중...
npm install

echo 개발 서버 시작 중...
start npm run dev

echo 복구 완료! 브라우저에서 Ctrl+Shift+R로 새로고침하세요.
pause
