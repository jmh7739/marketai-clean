@echo off
echo 홈페이지 레이아웃 수정 중...

echo 개발 서버 종료 중...
taskkill /f /im node.exe 2>nul

echo 캐시 삭제 중...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo TypeScript 캐시 삭제 중...
if exist tsconfig.tsbuildinfo del tsconfig.tsbuildinfo

echo 개발 서버 재시작 중...
start cmd /k "npm run dev"

echo 레이아웃 수정 완료!
echo 브라우저에서 Ctrl+Shift+R로 강제 새로고침하세요.
pause
