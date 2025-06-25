@echo off
echo Fixing import/export errors...

echo Restarting TypeScript server...
taskkill /f /im node.exe 2>nul

echo Clearing cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Starting development server...
start cmd /k "npm run dev"

echo Import/export errors fixed!
pause
