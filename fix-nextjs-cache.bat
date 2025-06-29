@echo off
echo 🧹 Next.js 캐시 완전 정리 중...

REM Next.js 캐시 디렉토리 삭제
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist .turbo rmdir /s /q .turbo

REM npm 캐시 정리
echo 📦 npm 캐시 정리 중...
npm cache clean --force

REM 의존성 재설치
echo 🔄 의존성 재설치 중...
npm install

REM 개발 서버 시작
echo 🚀 개발 서버 시작 중...
npm run dev
