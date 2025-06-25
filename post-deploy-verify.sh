#!/bin/bash

echo "🔍 배포 후 검증 시작..."

SITE_URL="https://marketai.co.kr"

# 1. 사이트 접근성 체크
echo "🌐 사이트 접근성 체크..."
response=$(curl -s -o /dev/null -w "%{http_code}" $SITE_URL)
if [ $response -eq 200 ]; then
    echo "✅ 메인 페이지 정상 접근"
else
    echo "❌ 메인 페이지 접근 실패 (HTTP $response)"
fi

# 2. 주요 페이지 체크
pages=("/sell" "/search" "/my-account" "/terms" "/privacy")
for page in "${pages[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL$page")
    if [ $response -eq 200 ]; then
        echo "✅ $page 페이지 정상"
    else
        echo "⚠️  $page 페이지 확인 필요 (HTTP $response)"
    fi
done

echo "🎉 배포 검증 완료!"
