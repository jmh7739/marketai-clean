# MarketAI 도메인 연결 가이드

## 1. Vercel 배포

\`\`\`bash
# 프로젝트 배포
npm run deploy

# 또는 직접 명령어
vercel --prod
\`\`\`

## 2. 도메인 연결

### Vercel에서 도메인 추가
\`\`\`bash
vercel domains add marketai.co.kr
\`\`\`

### DNS 설정 (도메인 등록업체에서)
\`\`\`
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
\`\`\`

## 3. SSL 인증서
- Vercel에서 자동으로 Let's Encrypt SSL 인증서 발급
- 24-48시간 내 활성화

## 4. 환경변수 설정
Vercel 대시보드에서 다음 환경변수 추가:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- 기타 Firebase 설정값들

## 5. 배포 확인
- https://marketai.co.kr 접속 확인
- 접근 게이트 페이지 작동 확인
- Firebase 인증 테스트

## 문제 해결
- DNS 전파: 최대 48시간 소요
- SSL 인증서: Vercel 대시보드에서 상태 확인
- 빌드 오류: Vercel 함수 로그 확인
\`\`\`

빠른 배포 명령어:

\`\`\`shellscript file="quick-deploy.sh"
#!/bin/bash

echo "⚡ 빠른 배포 시작..."

# 빌드 및 배포
npm run build && npm run deploy

echo "🎉 배포 완료!"
echo "📱 모바일에서도 테스트해보세요!"
