Write-Host "🔄 강제 업데이트 시작..." -ForegroundColor Cyan

# 개발 서버 완전 종료
Write-Host "서버 종료 중..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# 캐시 완전 삭제
Write-Host "캐시 완전 삭제 중..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "node_modules\.cache") { Remove-Item -Recurse -Force "node_modules\.cache" }
if (Test-Path ".turbo") { Remove-Item -Recurse -Force ".turbo" }

# TypeScript 캐시 삭제
Write-Host "TypeScript 캐시 삭제 중..." -ForegroundColor Yellow
if (Test-Path "tsconfig.tsbuildinfo") { Remove-Item -Force "tsconfig.tsbuildinfo" }

Write-Host ""
Write-Host "브라우저에서 Ctrl+Shift+R (강제 새로고침) 하세요!" -ForegroundColor Green
Write-Host ""

# 개발 서버 재시작
Write-Host "개발 서버 재시작 중..." -ForegroundColor Yellow
Start-Process -NoNewWindow npm -ArgumentList "run", "dev"

Write-Host ""
Write-Host "✅ 강제 업데이트 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 확인사항:" -ForegroundColor Cyan
Write-Host "1. 브라우저에서 Ctrl+Shift+R (강제 새로고침)"
Write-Host "2. /sell 페이지 접속"
Write-Host "3. 배송 정보 설정 섹션에 이모지와 색상 확인"
Write-Host "4. 무료배송 체크박스 작동 확인"
Write-Host ""
Write-Host "🌐 http://localhost:3000/sell" -ForegroundColor Blue
Write-Host ""
Read-Host "계속하려면 Enter를 누르세요"
