# npm 캐시 정리
npm cache clean --force

# 레지스트리 확인 및 설정
npm config get registry
npm config set registry https://registry.npmjs.org/

# node_modules 삭제 후 재설치
cd apps/web
rm -rf node_modules
rm -rf package-lock.json

# 패키지 재설치
npm install

# checkbox 컴포넌트 설치
npm install @radix-ui/react-checkbox
