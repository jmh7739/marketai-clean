@echo off
echo 🔄 수동 업데이트 가이드
echo.
echo 다음 명령어를 하나씩 실행하세요:
echo.
echo 1. 서버 종료:
echo    taskkill /f /im node.exe
echo.
echo 2. 캐시 삭제:
echo    rmdir /s /q .next
echo    rmdir /s /q node_modules\.cache
echo.
echo 3. 서버 재시작:
echo    npm run dev
echo.
echo 4. 브라우저에서 Ctrl+Shift+R 새로고침
echo.
pause
