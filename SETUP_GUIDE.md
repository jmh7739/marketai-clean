# MarketAI 설정 가이드

## 🔥 Firebase 설정

### 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `marketai-auction`
4. Google Analytics 활성화 (선택사항)

### 2. Authentication 설정
1. Authentication > Sign-in method
2. "전화번호" 활성화
3. reCAPTCHA 설정 (자동)

### 3. Firestore Database 설정
1. Firestore Database > 데이터베이스 만들기
2. 테스트 모드로 시작 (나중에 보안 규칙 설정)
3. 위치: asia-northeast3 (서울)

### 4. Storage 설정
1. Storage > 시작하기
2. 테스트 모드로 시작
3. 위치: asia-northeast3 (서울)

### 5. 웹 앱 추가
1. 프로젝트 설정 > 일반
2. "앱 추가" > 웹 선택
3. 앱 이름: `MarketAI Web`
4. Firebase Hosting 설정 (선택사항)

### 6. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수 추가:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

## 🛡️ 보안 규칙 설정

### Firestore 보안 규칙
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 문서
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 상품 문서
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 입찰 문서
    match /bids/{bidId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
\`\`\`

### Storage 보안 규칙
\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
\`\`\`

## 📱 SMS 인증 설정

### 1. 테스트 전화번호 추가 (개발용)
1. Authentication > Settings > Phone numbers for testing
2. 테스트 전화번호와 인증 코드 추가
3. 예: +82 10 1234 5678 → 123456

### 2. 실제 SMS 발송 (운영용)
1. Firebase 프로젝트를 Blaze 요금제로 업그레이드
2. Cloud Functions 배포 (필요시)
3. SMS 발송 제한 설정

## 🚀 배포 체크리스트

- [ ] Firebase 프로젝트 생성 완료
- [ ] 환경 변수 설정 완료
- [ ] 보안 규칙 설정 완료
- [ ] 테스트 전화번호 추가 완료
- [ ] HTTPS 도메인 설정 완료
- [ ] 이용약관/개인정보처리방침 실제 내용 작성
- [ ] 고객센터 연락처 설정
