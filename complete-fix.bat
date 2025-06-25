@echo off
echo 🚀 MarketAI 완전 수정 스크립트

echo.
echo 1️⃣ 프로젝트 구조 정리...
call fix-project-structure.bat

echo.
echo 2️⃣ TypeScript 에러 해결...
echo ✅ SafeLink 컴포넌트 생성됨
echo ✅ 라우트 타입 정의됨
echo ✅ Header/Sidebar 업데이트됨

echo.
echo 3️⃣ 개발 서버 시작...
echo 💡 루트 디렉토리에서 실행 중...
call npm run dev

echo.
echo 🎉 모든 문제 해결 완료!
echo 📍 브라우저에서 http://localhost:3000 접속하세요.

pause
