# 🔥 Firebase Authentication 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase 콘솔](https://console.firebase.google.com) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `marketai-auth` (원하는 이름)
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

## 2. Authentication 설정

1. 좌측 메뉴에서 "Authentication" 클릭
2. "시작하기" 버튼 클릭
3. "Sign-in method" 탭 선택
4. "전화" 제공업체 클릭
5. "사용 설정" 토글 ON
6. "저장" 클릭

## 3. 웹 앱 등록

1. 프로젝트 개요 페이지로 이동
2. "웹 앱에 Firebase 추가" 클릭 (</> 아이콘)
3. 앱 닉네임: `MarketAI Web`
4. "앱 등록" 클릭
5. 설정 정보 복사

## 4. 환경변수 설정

`.env.local` 파일에 다음 정보 추가:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

## 5. 테스트 전화번호 설정 (선택사항)

개발 중 실제 SMS 없이 테스트하려면:

1. Authentication > Sign-in method > Phone
2. "테스트용 전화번호" 섹션에서 추가
3. 전화번호: `+82 10 1234 5678`
4. 인증 코드: `123456`

## 6. 할당량 및 요금

- **무료 할당량**: 월 10,000건
- **초과 요금**: $0.05/건
- **한국 SMS**: 지원됨

## 🚀 완료!

설정이 완료되면 `npm run dev`로 실제 전화인증을 테스트할 수 있습니다!
