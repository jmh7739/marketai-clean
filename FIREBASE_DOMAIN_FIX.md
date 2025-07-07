# 🔧 Firebase 승인된 도메인 설정 가이드

## 문제 상황
Firebase Console에서 `localhost:3000` 추가 시 "중복된 도메인" 오류 발생

## ✅ 해결 방법

### 1. 올바른 도메인 형식으로 추가
\`\`\`
localhost:3000  ❌ (포트 포함 불가)
localhost       ✅ (올바른 형식)
\`\`\`

### 2. Firebase Console 설정 순서
1. **Firebase Console** → **Authentication** → **Settings**
2. **승인된 도메인** 섹션에서 **도메인 추가** 클릭
3. 다음 도메인들을 하나씩 추가:
   - `localhost`
   - `127.0.0.1`
   - `marketai.co.kr` (실제 도메인)

### 3. 개발 환경 설정
\`\`\`bash
# 개발 서버 실행 시 포트 명시
npm run dev -- --port 3000

# 또는 package.json에서 설정
"scripts": {
  "dev": "next dev -p 3000"
}
\`\`\`

### 4. reCAPTCHA 설정 변경
- **invisible** → **normal**로 변경하여 사용자가 직접 확인 가능

### 5. 테스트 전화번호 설정 (권장)
Firebase Console → Authentication → Sign-in method → Phone → Test phone numbers:
- **전화번호**: `+82 10-1234-5678`
- **인증번호**: `123456`

## 🚨 주의사항
- 포트 번호는 승인된 도메인에 포함하지 않음
- localhost와 127.0.0.1 모두 추가 권장
- 실제 배포 시 실제 도메인도 추가 필요

## 📱 테스트 방법
1. Firebase 설정 완료 후
2. `http://localhost:3000/auth/signup` 접속
3. 기본 정보 입력 → 전화번호 인증 → 완료
\`\`\`

Firebase 설정 스크립트:

\`\`\`shellscript file="setup-firebase-domains.sh"
#!/bin/bash

echo "🔧 Firebase 도메인 설정 가이드"
echo ""
echo "1. Firebase Console 접속:"
echo "   https://console.firebase.google.com"
echo ""
echo "2. 프로젝트 선택 → Authentication → Settings"
echo ""
echo "3. 승인된 도메인에 다음 추가:"
echo "   ✅ localhost"
echo "   ✅ 127.0.0.1"
echo "   ✅ marketai.co.kr"
echo ""
echo "4. 테스트 전화번호 설정:"
echo "   Sign-in method → Phone → Test phone numbers"
echo "   전화번호: +82 10-1234-5678"
echo "   인증번호: 123456"
echo ""
echo "5. 개발 서버 재시작:"
echo "   npm run dev"
echo ""
echo "🎯 테스트 URL: http://localhost:3000/auth/signup"
