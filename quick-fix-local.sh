#!/bin/bash

echo "🚀 빠른 수정 중..."

# 캐시 삭제 및 재시작
rm -rf .next
npm run dev

echo "✅ 완료! localhost:3000/auth/signup 접속하세요"
