@echo off
echo 🚀 MarketAI Vercel 배포 시작...

REM 1. 의존성 설치
echo 📦 의존성 설치 중...
npm install

REM 2. 빌드 테스트
echo 🔨 빌드 테스트 중...
npm run build

if %errorlevel% neq 0 (
    echo ❌ 빌드 실패! 오류를 확인하세요.
    pause
    exit /b 1
)

REM 3. Vercel CLI 설치 확인
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo 📥 Vercel CLI 설치 중...
    npm install -g vercel
)

REM 4. Vercel 로그인 확인
echo 🔐 Vercel 로그인 확인...
vercel whoami

REM 5. 프로젝트 배포
echo 🌐 Vercel에 배포 중...
vercel --prod

echo ✅ 배포 완료!
echo 🌍 사이트 주소: https://marketai.co.kr
echo 🔧 Vercel 대시보드: https://vercel.com/dashboard
pause
