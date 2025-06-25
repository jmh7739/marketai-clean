@echo off
echo 🚀 완전한 인증 및 경매 시스템 설정 중...

echo.
echo 📦 필요한 패키지 설치 중...
npm install @radix-ui/react-dropdown-menu
npm install lucide-react
npm install class-variance-authority
npm install clsx
npm install tailwind-merge

echo.
echo 🔧 TypeScript 설정 업데이트 중...
echo {
echo   "compilerOptions": {
echo     "target": "es5",
echo     "lib": ["dom", "dom.iterable", "es6"],
echo     "allowJs": true,
echo     "skipLibCheck": true,
echo     "strict": true,
echo     "forceConsistentCasingInFileNames": true,
echo     "noEmit": true,
echo     "esModuleInterop": true,
echo     "module": "esnext",
echo     "moduleResolution": "node",
echo     "resolveJsonModule": true,
echo     "isolatedModules": true,
echo     "jsx": "preserve",
echo     "incremental": true,
echo     "plugins": [
echo       {
echo         "name": "next"
echo       }
echo     ],
echo     "baseUrl": ".",
echo     "paths": {
echo       "@/*": ["./*"]
echo     }
echo   },
echo   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
echo   "exclude": ["node_modules"]
echo } > tsconfig.json

echo.
echo ✅ 완전한 인증 및 경매 시스템 설정 완료!
echo.
echo 🎯 구현된 기능들:
echo ✅ 이메일 + 전화번호 회원가입
echo ✅ 전화번호 인증 시스템
echo ✅ 로그인 가드 (판매하기 등)
echo ✅ 실시간 경매 입찰 시스템
echo ✅ 사용자 인증 상태 관리
echo ✅ 드롭다운 사용자 메뉴
echo.
echo 🧪 테스트 계정:
echo 📧 이메일: test@marketai.com
echo 🔑 비밀번호: test1234
echo 📱 인증번호: 123456 또는 000000
echo.
echo 🚀 개발 서버 시작 중...
npm run dev

pause
