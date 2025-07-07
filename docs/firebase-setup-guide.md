# Firebase 설정 가이드

MarketAI 프로젝트에서 Firebase Authentication을 설정하는 방법을 안내합니다.

## 1. Firebase 프로젝트 생성

### 1.1 Firebase 콘솔 접속
- [Firebase Console](https://console.firebase.google.com)에 접속
- Google 계정으로 로그인

### 1.2 새 프로젝트 생성
1. "프로젝트 추가" 클릭
2. 프로젝트 이름 입력 (예: marketai-project)
3. Google Analytics 설정 (선택사항)
4. 프로젝트 생성 완료

## 2. Firebase Authentication 설정

### 2.1 Authentication 활성화
1. 좌측 메뉴에서 "Authentication" 선택
2. "시작하기" 버튼 클릭

### 2.2 로그인 방법 설정
1. "Sign-in method" 탭 선택
2. "전화" 제공업체 선택
3. "사용 설정" 토글 활성화
4. "저장" 클릭

### 2.3 승인된 도메인 설정
1. "Settings" 탭 선택
2. "Authorized domains" 섹션에서 다음 도메인 추가:
   - \`localhost\` (개발용)
   - 배포 도메인 (예: \`your-app.vercel.app\`)

## 3. 웹 앱 설정

### 3.1 웹 앱 추가
1. 프로젝트 개요 페이지에서 웹 아이콘(\`</>\`) 클릭
2. 앱 닉네임 입력 (예: MarketAI Web)
3. Firebase Hosting 설정 (선택사항)
4. "앱 등록" 클릭

### 3.2 구성 정보 복사
Firebase SDK 구성 정보를 복사하여 \`.env.local\` 파일에 추가:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

## 4. 전화번호 인증 설정

### 4.1 테스트 전화번호 설정 (선택사항)
개발 중 실제 SMS를 보내지 않고 테스트하려면:
1. Authentication > Settings > Phone numbers for testing
2. 테스트용 전화번호와 인증 코드 추가

### 4.2 SMS 할당량 확인
- Firebase 프로젝트는 일일 SMS 전송 제한이 있습니다
- 프로덕션 환경에서는 결제 계정 설정이 필요할 수 있습니다

## 5. 보안 규칙 설정

### 5.1 Firestore 보안 규칙 (사용 시)
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

## 6. 문제 해결

### 6.1 일반적인 오류

#### \`auth/unauthorized-domain\`
- 해결: Authorized domains에 현재 도메인 추가

#### \`auth/invalid-phone-number\`
- 해결: 전화번호를 E.164 형식으로 변환 (+82로 시작)

#### \`auth/too-many-requests\`
- 해결: 잠시 후 다시 시도하거나 다른 전화번호 사용

#### \`auth/captcha-check-failed\`
- 해결: reCAPTCHA 설정 확인 및 재시도

### 6.2 디버깅 팁
1. 브라우저 개발자 도구에서 네트워크 탭 확인
2. Firebase 콘솔에서 Authentication 로그 확인
3. 환경 변수가 올바르게 설정되었는지 확인

## 7. 프로덕션 배포 시 주의사항

### 7.1 환경 변수 보안
- API 키는 공개되어도 안전하지만, 도메인 제한 설정 권장
- 서버 사이드 작업에는 Admin SDK 사용

### 7.2 할당량 관리
- SMS 전송 할당량 모니터링
- 필요시 Firebase Blaze 플랜으로 업그레이드

### 7.3 모니터링
- Firebase Console에서 사용량 및 오류 모니터링
- 사용자 인증 통계 확인

## 8. 추가 리소스

- [Firebase Auth 공식 문서](https://firebase.google.com/docs/auth)
- [전화번호 인증 가이드](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase 보안 규칙](https://firebase.google.com/docs/rules)
- [Firebase 할당량 및 제한](https://firebase.google.com/docs/auth/limits)

---

이 가이드를 따라 설정하면 MarketAI에서 전화번호 인증을 사용할 수 있습니다.
문제가 발생하면 Firebase Console의 로그를 확인하거나 공식 문서를 참조하세요.
