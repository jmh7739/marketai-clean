@echo off
echo 🔧 MarketAI 프로젝트 구조 정리 중...

echo.
echo 1. 현재 구조 확인 중...
if exist "apps\web" (
    echo ✅ Monorepo 구조 감지됨 (apps/web)
    
    echo.
    echo 2. apps/web의 파일들을 루트로 이동 중...
    
    REM apps/web의 모든 파일을 루트로 복사
    if exist "apps\web\package.json" copy "apps\web\package.json" "package.json" /Y
    if exist "apps\web\next.config.js" copy "apps\web\next.config.js" "next.config.js" /Y
    if exist "apps\web\tailwind.config.js" copy "apps\web\tailwind.config.js" "tailwind.config.js" /Y
    if exist "apps\web\tsconfig.json" copy "apps\web\tsconfig.json" "tsconfig.json" /Y
    if exist "apps\web\postcss.config.js" copy "apps\web\postcss.config.js" "postcss.config.js" /Y
    
    REM 폴더 구조 복사
    if exist "apps\web\app" (
        echo 📁 app 폴더 복사 중...
        xcopy "apps\web\app" "app" /E /I /Y
    )
    
    if exist "apps\web\components" (
        echo 📁 components 폴더 복사 중...
        xcopy "apps\web\components" "components" /E /I /Y
    )
    
    if exist "apps\web\lib" (
        echo 📁 lib 폴더 복사 중...
        xcopy "apps\web\lib" "lib" /E /I /Y
    )
    
    if exist "apps\web\types" (
        echo 📁 types 폴더 복사 중...
        xcopy "apps\web\types" "types" /E /I /Y
    )
    
    if exist "apps\web\contexts" (
        echo 📁 contexts 폴더 복사 중...
        xcopy "apps\web\contexts" "contexts" /E /I /Y
    )
    
    if exist "apps\web\hooks" (
        echo 📁 hooks 폴더 복사 중...
        xcopy "apps\web\hooks" "hooks" /E /I /Y
    )
    
    if exist "apps\web\pages" (
        echo 📁 pages 폴더 복사 중...
        xcopy "apps\web\pages" "pages" /E /I /Y
    )
    
    if exist "apps\web\public" (
        echo 📁 public 폴더 복사 중...
        xcopy "apps\web\public" "public" /E /I /Y
    )
    
    echo.
    echo 3. 불필요한 monorepo 구조 제거 중...
    rmdir /s /q "apps" 2>nul
    
) else (
    echo ✅ 단일 프로젝트 구조 감지됨
)

echo.
echo 4. 캐시 및 빌드 파일 정리 중...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"

echo.
echo 5. 의존성 재설치 중...
call npm install

echo.
echo 6. Next.js 타입 생성 중...
call npm run build

echo.
echo 🎉 프로젝트 구조 정리 완료!
echo 💡 이제 루트 디렉토리에서 'npm run dev'를 실행하세요.

pause
