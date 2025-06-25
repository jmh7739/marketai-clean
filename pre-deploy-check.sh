#!/bin/bash

echo "🔍 배포 전 체크리스트 실행 중..."

# 1. TypeScript 타입 체크
echo "📝 TypeScript 타입 체크..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript 오류가 있습니다. 수정 후 다시 시도하세요."
    exit 1
fi

# 2. 빌드 테스트
echo "🏗️  빌드 테스트..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 빌드 오류가 있습니다. 수정 후 다시 시도하세요."
    exit 1
fi

# 3. 환경 변수 체크
echo "🔐 환경 변수 체크..."
if [ -z "$NEXT_PUBLIC_FIREBASE_API_KEY" ]; then
    echo "⚠️  NEXT_PUBLIC_FIREBASE_API_KEY가 설정되지 않았습니다."
fi

# 4. 중요 파일 존재 확인
echo "📁 중요 파일 확인..."
files=("package.json" "next.config.js" "tailwind.config.ts" "tsconfig.json")
for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ $file 파일이 없습니다."
        exit 1
    fi
done

echo "✅ 모든 체크 완료! 배포 준비가 되었습니다."
