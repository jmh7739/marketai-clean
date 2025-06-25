# 기존 빌드 파일 정리
cd apps/web
rm -rf .next
rm -rf node_modules
rm -rf package-lock.json

# 필요한 디렉토리 생성
mkdir -p components/ui
mkdir -p lib
mkdir -p app
