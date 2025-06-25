@echo off
echo 🔧 로컬 빌드 오류 수정 중...

echo 1. Next.js 캐시 삭제 중...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 2. 노드 모듈 재설치 중...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock

echo 3. 의존성 재설치 중...
npm install

echo 4. TypeScript 캐시 삭제 중...
if exist .tsbuildinfo del .tsbuildinfo
npx tsc --build --clean

echo 5. 개발 서버 시작 중...
npm run dev

echo ✅ 수정 완료! 브라우저에서 http://localhost:3000/auth/signup 접속하세요
pause
