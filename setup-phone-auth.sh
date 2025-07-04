#!/bin/bash

echo "🔥 Firebase 전화번호 인증 설정 가이드"
echo "=================================="
echo ""
echo "1. Firebase 콘솔 접속:"
echo "   https://console.firebase.google.com/project/marketai-auction"
echo ""
echo "2. Authentication > Sign-in method 이동"
echo ""
echo "3. 전화번호 인증 활성화:"
echo "   - Phone 항목 클릭"
echo "   - Enable 토글 ON"
echo "   - Save 클릭"
echo ""
echo "4. 승인된 도메인 추가:"
echo "   - Authentication > Settings > Authorized domains"
echo "   - localhost 추가 (개발용)"
echo "   - 배포 도메인 추가 (운영용)"
echo ""
echo "5. reCAPTCHA 설정:"
echo "   - Google Cloud Console > reCAPTCHA Enterprise"
echo "   - 새 키 생성 (웹사이트용)"
echo "   - 도메인 추가"
echo ""
echo "6. 테스트 전화번호 추가 (선택사항):"
echo "   - Authentication > Sign-in method > Phone"
echo "   - Phone numbers for testing 섹션"
echo "   - +82 10-1234-5678 : 123456 형태로 추가"
echo ""
echo "✅ 설정 완료 후 개발 서버 재시작:"
echo "   npm run dev"
