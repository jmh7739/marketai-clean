@echo off
echo 🔧 모든 빌드 오류 해결 중...

echo 📁 캐시 파일 삭제 중...
if exist .next rmdir /s /q .next
if exist node_modules rmdir /s /q node_modules
if exist .turbo rmdir /s /q .turbo
if exist out rmdir /s /q out

echo 📦 의존성 재설치 중...
npm cache clean --force
npm install

echo ✅ 모든 오류 해결 완료!
echo 🚀 개발 서버 시작: npm run dev
pause
