#!/bin/bash

echo "⚡ 빠른 수정 (legacy-peer-deps)..."

# .npmrc 파일 생성
echo "legacy-peer-deps=true" > .npmrc

# 기존 정리
rm -rf node_modules package-lock.json

# 재설치
npm install

echo "✅ 수정 완료!"
