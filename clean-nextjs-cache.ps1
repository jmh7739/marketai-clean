# Windows PowerShell용 Next.js 캐시 정리 스크립트

Write-Host "🧹 Next.js 캐시 완전 정리 중..." -ForegroundColor Green

# Next.js 캐시 디렉토리 삭제
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ .next 폴더 삭제 완료" -ForegroundColor Yellow
}

if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "✅ node_modules\.cache 폴더 삭제 완료" -ForegroundColor Yellow
}

if (Test-Path ".turbo") {
    Remove-Item -Recurse -Force ".turbo"
    Write-Host "✅ .turbo 폴더 삭제 완료" -ForegroundColor Yellow
}

# npm 캐시 정리
Write-Host "📦 npm 캐시 정리 중..." -ForegroundColor Green
npm cache clean --force

# 의존성 재설치
Write-Host "🔄 의존성 재설치 중..." -ForegroundColor Green
npm install

# 개발 서버 시작
Write-Host "🚀 개발 서버 시작 중..." -ForegroundColor Green
npm run dev
