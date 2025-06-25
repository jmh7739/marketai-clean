# MarketAI 배포 가이드

## 개요
MarketAI 애플리케이션을 프로덕션 환경에 배포하는 방법을 설명합니다.

## 배포 옵션

### 1. Vercel 배포 (권장)

#### 웹 애플리케이션 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 루트에서 배포
cd apps/web
vercel --prod
```

#### API 서버 배포
```bash
cd apps/api
vercel --prod
```

### 2. Docker 배포

#### Docker Compose 사용
```bash
# 프로덕션 환경 구성
cp .env.example .env
# .env 파일 수정

# 컨테이너 빌드 및 실행
docker-compose -f infrastructure/docker/docker-compose.yml up -d
```

### 3. 클라우드 배포

#### AWS ECS
```bash
# ECR에 이미지 푸시
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com

docker build -t marketai-web apps/web/
docker tag marketai-web:latest <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/marketai-web:latest
docker push <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/marketai-web:latest
```

## 환경 변수 설정

### 필수 환경 변수
```bash
# 데이터베이스
DATABASE_URL=postgresql://user:password@host:5432/marketai
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=your-super-secret-key

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Stripe
STRIPE_SECRET_KEY=sk_live_your-stripe-key
```

## 데이터베이스 마이그레이션

```bash
# Prisma 마이그레이션 실행
cd apps/api
npx prisma migrate deploy
npx prisma db seed
```

## 모니터링 설정

### 로그 수집
- CloudWatch (AWS)
- Vercel Analytics
- Sentry 에러 추적

### 성능 모니터링
- New Relic
- DataDog
- Vercel Speed Insights

## SSL 인증서

### Let's Encrypt 사용
```bash
# Certbot 설치
sudo apt-get install certbot python3-certbot-nginx

# 인증서 발급
sudo certbot --nginx -d marketai.com -d www.marketai.com
```

## 백업 전략

### 데이터베이스 백업
```bash
# 자동 백업 스크립트
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
aws s3 cp backup_*.sql s3://marketai-backups/
```

### 파일 백업
- Supabase Storage 자동 백업
- S3 Cross-Region Replication

## 보안 체크리스트

- [ ] HTTPS 강제 적용
- [ ] 환경 변수 암호화
- [ ] API Rate Limiting 설정
- [ ] CORS 정책 설정
- [ ] SQL Injection 방지
- [ ] XSS 방지 헤더 설정
- [ ] 정기 보안 업데이트

## 성능 최적화

### CDN 설정
- Vercel Edge Network
- CloudFlare
- AWS CloudFront

### 캐싱 전략
- Redis 캐싱
- Next.js ISR
- API 응답 캐싱

## 롤백 전략

### 무중단 배포
```bash
# Blue-Green 배포
# 1. 새 버전 배포
# 2. 헬스체크 확인
# 3. 트래픽 전환
# 4. 이전 버전 종료
```

### 데이터베이스 롤백
```bash
# 마이그레이션 롤백
npx prisma migrate reset
# 백업에서 복원
psql $DATABASE_URL < backup_20241201_120000.sql
```

## 문제 해결

### 일반적인 문제들

1. **메모리 부족**
   - Node.js 힙 크기 증가: `--max-old-space-size=4096`

2. **데이터베이스 연결 오류**
   - 연결 풀 설정 확인
   - 네트워크 보안 그룹 확인

3. **빌드 실패**
   - 의존성 버전 확인
   - 환경 변수 설정 확인

### 로그 확인
```bash
# Docker 로그
docker logs marketai-api

# PM2 로그
pm2 logs marketai

# Vercel 로그
vercel logs
```

## 지원

배포 관련 문제가 있으면 다음으로 연락하세요:
- 이메일: devops@marketai.com
- Slack: #deployment-support