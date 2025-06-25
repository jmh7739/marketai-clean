#!/bin/bash

echo "⚡ 빠른 수정..."

# 핵심 패키지만 설치
npm install @radix-ui/react-slot

# 캐시 정리
rm -rf .next

echo "✅ 수정 완료! 이제 npm run dev를 실행하세요."
