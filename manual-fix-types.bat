@echo off
echo 📋 수동으로 Next.js 타입 에러 해결하기

echo.
echo 1단계: 개발 서버 종료
echo Ctrl+C를 눌러서 npm run dev 종료

echo.
echo 2단계: 캐시 삭제
echo rmdir /s /q .next
echo rmdir /s /q node_modules\.cache

echo.
echo 3단계: 타입 생성
echo npm run build

echo.
echo 4단계: 개발 서버 재시작
echo npm run dev

echo.
echo 5단계: VS Code 재시작
echo VS Code를 완전히 종료 후 다시 시작

pause
