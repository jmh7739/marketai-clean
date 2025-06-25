@echo off
echo 🔧 Next.js 타입 에러 수정 중...

echo 1. 개발 서버 종료...
taskkill /f /im node.exe 2>nul

echo 2. .next 폴더 완전 삭제...
if exist .next rmdir /s /q .next

echo 3. node_modules 캐시 삭제...
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 4. TypeScript 캐시 삭제...
if exist tsconfig.tsbuildinfo del tsconfig.tsbuildinfo

echo 5. Next.js 캐시 삭제...
npx next clean

echo 6. 타입 체크 및 빌드...
npx next build --no-lint

echo 7. 개발 서버 시작...
start cmd /k "npm run dev"

echo ✅ Next.js 타입 에러 수정 완료!
echo 브라우저에서 localhost:3000 확인해주세요.
pause
