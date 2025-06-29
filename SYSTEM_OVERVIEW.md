# MarketAI - 완전한 실시간 경매 플랫폼 시스템 개요

## 📋 목차
1. [시스템 아키텍처](#시스템-아키텍처)
2. [핵심 기능](#핵심-기능)
3. [데이터베이스 구조](#데이터베이스-구조)
4. [인증 시스템](#인증-시스템)
5. [경매 시스템](#경매-시스템)
6. [결제 및 환불](#결제-및-환불)
7. [관리자 시스템](#관리자-시스템)
8. [보안 및 정책](#보안-및-정책)
9. [배포 및 운영](#배포-및-운영)
10. [API 문서](#api-문서)

---

## 🏗️ 시스템 아키텍처

### 기술 스택
\`\`\`
Frontend: Next.js 14 + React 18 + TypeScript
UI: Tailwind CSS + Radix UI + shadcn/ui
Authentication: Firebase Auth (전화번호 인증)
Database: Supabase (PostgreSQL)
Storage: Vercel Blob
Deployment: Vercel
Real-time: Supabase Realtime
\`\`\`

### 폴더 구조
\`\`\`
marketai/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   ├── admin/             # 관리자 페이지
│   ├── auction/           # 경매 상세 페이지
│   └── api/               # API 라우트
├── components/            # 재사용 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   └── ...               # 커스텀 컴포넌트
├── lib/                  # 유틸리티 및 설정
├── types/                # TypeScript 타입 정의
├── contexts/             # React Context
├── hooks/                # 커스텀 훅
├── stores/               # 상태 관리
└── scripts/              # 데이터베이스 스크립트
\`\`\`

---

## 🎯 핵심 기능

### 1. 사용자 기능
- ✅ **전화번호 인증** (Firebase SMS)
- ✅ **실시간 경매 참여**
- ✅ **프록시 입찰 시스템** (eBay 스타일)
- ✅ **즉시구매 옵션**
- ✅ **관심목록 (찜하기)**
- ✅ **실시간 알림**
- ✅ **거래 내역 관리**
- ✅ **사용자 평점 시스템**

### 2. 판매자 기능
- ✅ **상품 등록** (다중 이미지 업로드)
- ✅ **경매 설정** (시작가, 즉시구매가, 예약가)
- ✅ **판매 관리 대시보드**
- ✅ **수수료 계산기**
- ✅ **판매 통계**

### 3. 경매 시스템
- ✅ **실시간 입찰**
- ✅ **자동 연장** (스나이핑 방지)
- ✅ **프록시 입찰**
- ✅ **카테고리별 분류**
- ✅ **고급 검색 필터**

### 4. 관리자 기능
- ✅ **실시간 대시보드**
- ✅ **사용자 관리** (정지/차단)
- ✅ **신고 처리**
- ✅ **환불 관리**
- ✅ **분쟁 해결**
- ✅ **통계 및 분석**

---

## 🗄️ 데이터베이스 구조

### 주요 테이블

#### 1. users (사용자)
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  nickname VARCHAR(50),
  email VARCHAR(255),
  profile_image TEXT,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_sales INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### 2. auctions (경매)
\`\`\`sql
CREATE TABLE auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  condition auction_condition DEFAULT 'good',
  starting_price INTEGER NOT NULL,
  current_price INTEGER DEFAULT 0,
  buy_now_price INTEGER,
  reserve_price INTEGER,
  total_bids INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  location VARCHAR(100),
  shipping_cost INTEGER DEFAULT 0,
  shipping_method VARCHAR(50) DEFAULT 'standard',
  status auction_status DEFAULT 'draft',
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP NOT NULL,
  auto_extend BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  watch_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### 3. bids (입찰)
\`\`\`sql
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES auctions(id),
  bidder_id UUID REFERENCES users(id),
  amount INTEGER NOT NULL,
  is_auto_bid BOOLEAN DEFAULT false,
  max_bid_amount INTEGER,
  is_winning BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### 4. transactions (거래)
\`\`\`sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES auctions(id),
  buyer_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES users(id),
  final_price INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL,
  seller_amount INTEGER NOT NULL,
  payment_method payment_method DEFAULT 'bank_transfer',
  payment_status payment_status DEFAULT 'pending',
  shipping_status shipping_status DEFAULT 'pending',
  escrow_status escrow_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
\`\`\`

### 관리자 테이블

#### 5. admin_users (관리자)
\`\`\`sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  role admin_role DEFAULT 'moderator',
  permissions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### 6. reports (신고)
\`\`\`sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id),
  reported_user_id UUID REFERENCES users(id),
  auction_id UUID REFERENCES auctions(id),
  report_type report_type NOT NULL,
  reason TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status report_status DEFAULT 'pending',
  admin_notes TEXT,
  processed_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);
\`\`\`

#### 7. refund_requests (환불 요청)
\`\`\`sql
CREATE TABLE refund_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  auction_id UUID REFERENCES auctions(id),
  transaction_id UUID REFERENCES transactions(id),
  request_type refund_type NOT NULL,
  reason TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status refund_status DEFAULT 'pending',
  admin_notes TEXT,
  processed_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);
\`\`\`

---

## 🔐 인증 시스템

### Firebase 전화번호 인증
\`\`\`typescript
// lib/auth-service.ts
export class AuthService {
  static async sendVerificationCode(phoneNumber: string) {
    const formattedPhone = phoneNumber.startsWith("010") 
      ? `+82${phoneNumber.substring(1)}` 
      : phoneNumber
    
    this.confirmationResult = await signInWithPhoneNumber(
      auth, 
      formattedPhone, 
      this.recaptchaVerifier
    )
    return { success: true }
  }

  static async verifyCode(code: string) {
    const result = await this.confirmationResult.confirm(code)
    return { success: true, user: result.user }
  }
}
\`\`\`

### 사용자 등록 플로우
1. 전화번호 입력
2. SMS 인증코드 발송
3. 인증코드 확인
4. 사용자 정보 입력 (이름, 닉네임)
5. Supabase에 사용자 데이터 저장
6. 자동 로그인

---

## 🏺 경매 시스템

### 프록시 입찰 시스템 (eBay 스타일)
\`\`\`typescript
// components/RealAuctionSystem.tsx
const processProxyBid = (newBidder: string, newMaxBid: number) => {
  const currentHighestProxy = proxyBids.find(bid => 
    bid.bidder === auction.highestBidder
  )
  
  // 즉시구매가 체크
  if (auction.buyNowPrice && newMaxBid >= auction.buyNowPrice) {
    // 즉시구매 처리
    handleBuyNow(newBidder)
    return
  }
  
  // 프록시 입찰 경쟁 로직
  if (currentHighestProxy && currentHighestProxy.bidder !== newBidder) {
    if (newMaxBid > currentHighestProxy.maxAmount) {
      // 새 입찰자가 승리
      finalBidAmount = Math.min(
        currentHighestProxy.maxAmount + minIncrement, 
        newMaxBid
      )
    } else {
      // 기존 입찰자가 승리
      finalBidAmount = newMaxBid + minIncrement
    }
  }
}
\`\`\`

### 실시간 업데이트
\`\`\`typescript
// Supabase Realtime 구독
const subscribeToAuctionBids = (auctionId: string) => {
  return supabase
    .channel(`auction-${auctionId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'bids',
      filter: `auction_id=eq.${auctionId}`
    }, (payload) => {
      // 실시간 입찰 업데이트
      updateBidHistory(payload.new)
    })
    .subscribe()
}
\`\`\`

### 경매 종료 처리
\`\`\`sql
-- 경매 자동 종료 함수
CREATE OR REPLACE FUNCTION end_expired_auctions()
RETURNS void AS $$
BEGIN
  UPDATE auctions 
  SET status = 'ended'
  WHERE status = 'active' 
    AND end_time <= NOW();
    
  -- 낙찰자 결정 및 거래 생성
  INSERT INTO transactions (auction_id, buyer_id, seller_id, final_price)
  SELECT 
    a.id,
    b.bidder_id,
    a.seller_id,
    a.current_price
  FROM auctions a
  JOIN bids b ON a.id = b.auction_id AND b.is_winning = true
  WHERE a.status = 'ended' AND a.current_price > 0;
END;
$$ LANGUAGE plpgsql;
\`\`\`

---

## 💳 결제 및 환불

### 계좌이체 결제 시스템
\`\`\`typescript
// components/BankTransferPayment.tsx
const bankAccount = {
  bank: "국민은행",
  accountNumber: "123456-78-901234",
  accountHolder: "홍길동",
  amount: paymentInfo.finalPrice,
}

const handleDepositConfirm = () => {
  if (!depositName || !depositDate || !depositTime) {
    alert("모든 정보를 입력해주세요")
    return
  }
  
  // 입금 확인 처리
  setPaymentStatus("completed")
  
  // 관리자에게 알림
  notifyAdmin({
    type: "payment_confirmation",
    data: { depositName, depositDate, depositTime }
  })
}
\`\`\`

### 수수료 계산 시스템
\`\`\`typescript
// lib/fee-calculator.ts
export const FEE_STRUCTURE: FeeStructure[] = [
  { minAmount: 0, maxAmount: 10000, feeRate: 0.15 },      // 15%
  { minAmount: 10000, maxAmount: 30000, feeRate: 0.12 },  // 12%
  { minAmount: 30000, maxAmount: 50000, feeRate: 0.10 },  // 10%
  { minAmount: 50000, maxAmount: 100000, feeRate: 0.08 }, // 8%
  { minAmount: 100000, maxAmount: 200000, feeRate: 0.07 }, // 7%
  { minAmount: 200000, maxAmount: 300000, feeRate: 0.06 }, // 6%
  { minAmount: 300000, maxAmount: 500000, feeRate: 0.055 }, // 5.5%
  { minAmount: 500000, maxAmount: 1000000, feeRate: 0.05 }, // 5%
  { minAmount: 1000000, maxAmount: 2000000, feeRate: 0.045 }, // 4.5%
  { minAmount: 2000000, maxAmount: 5000000, feeRate: 0.04 }, // 4%
  { minAmount: 5000000, maxAmount: 10000000, feeRate: 0.035 }, // 3.5%
  { minAmount: 10000000, maxAmount: Infinity, feeRate: 0.03 }, // 3%
]
\`\`\`

### 환불 정책 시스템
\`\`\`typescript
// lib/refund-system.ts
export const REFUND_POLICIES: RefundPolicy[] = [
  {
    id: "auction_before_bid",
    type: "auction_cancel",
    title: "입찰 전 경매 취소",
    conditions: ["입찰자가 없는 경우", "경매 시작 후 24시간 이내"],
    refundRate: 100,
    processingDays: 1,
    feeDeduction: 0,
  },
  {
    id: "auction_with_bids",
    type: "auction_cancel", 
    title: "입찰 후 경매 취소",
    conditions: ["관리자 승인 필요", "정당한 사유 필요"],
    refundRate: 80,
    processingDays: 3,
    feeDeduction: 20,
  },
  {
    id: "post_auction_buyer",
    type: "post_auction_cancel",
    title: "낙찰 후 구매자 취소", 
    conditions: ["결제 전 24시간 이내만 가능", "취소 수수료 10% 적용"],
    refundRate: 90,
    processingDays: 2,
    feeDeduction: 10,
  },
  {
    id: "dispute_resolution",
    type: "dispute_refund",
    title: "분쟁 해결 환불",
    conditions: ["증빙 자료 제출 필요", "관리자 조사 후 결정"],
    refundRate: 100,
    processingDays: 7,
    feeDeduction: 0,
  }
]
\`\`\`

---

## 👨‍💼 관리자 시스템

### 관리자 권한 체계
\`\`\`typescript
// types/admin.ts
export type AdminRole = 'super_admin' | 'admin' | 'moderator'

export interface AdminPermissions {
  users: {
    view: boolean
    edit: boolean
    ban: boolean
    delete: boolean
  }
  auctions: {
    view: boolean
    edit: boolean
    delete: boolean
    feature: boolean
  }
  reports: {
    view: boolean
    process: boolean
    escalate: boolean
  }
  refunds: {
    view: boolean
    approve: boolean
    reject: boolean
  }
  system: {
    settings: boolean
    analytics: boolean
    logs: boolean
  }
}
\`\`\`

### 실시간 대시보드
\`\`\`typescript
// app/admin/dashboard/page.tsx
const DashboardStats = {
  totalUsers: 1247,
  activeAuctions: 89,
  totalRevenue: 45670000,
  monthlyGrowth: 12.5,
  pendingReports: 3,
  pendingRefunds: 2,
  todayVisitors: 342,
  todayMessages: 156,
  todayOrders: 23,
  totalTransactions: 1834,
}

// 실시간 업데이트 (30초마다)
useEffect(() => {
  const interval = setInterval(loadDashboardData, 30000)
  return () => clearInterval(interval)
}, [])
\`\`\`

### 신고 처리 시스템
\`\`\`typescript
// 신고 유형
export type ReportType = 
  | 'fake_product'      // 가짜 상품
  | 'inappropriate'     // 부적절한 내용
  | 'fraud'            // 사기
  | 'spam'             // 스팸
  | 'copyright'        // 저작권 침해
  | 'other'            // 기타

// 신고 처리 플로우
const processReport = async (reportId: string, action: 'approve' | 'reject') => {
  const report = await getReport(reportId)
  
  if (action === 'approve') {
    // 신고 승인 시 조치
    switch (report.report_type) {
      case 'fake_product':
        await banUser(report.reported_user_id, 7) // 7일 정지
        await deleteAuction(report.auction_id)
        break
      case 'fraud':
        await banUser(report.reported_user_id, 30) // 30일 정지
        break
      case 'spam':
        await warnUser(report.reported_user_id)
        break
    }
  }
}
\`\`\`

---

## 🛡️ 보안 및 정책

### Row Level Security (RLS)
\`\`\`sql
-- 사용자는 자신의 데이터만 조회/수정 가능
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users  
  FOR UPDATE USING (auth.uid() = id);

-- 경매는 모든 사용자가 조회 가능, 소유자만 수정 가능
CREATE POLICY "Anyone can view active auctions" ON auctions
  FOR SELECT USING (status = 'active');

CREATE POLICY "Sellers can update own auctions" ON auctions
  FOR UPDATE USING (auth.uid() = seller_id);

-- 입찰은 인증된 사용자만 가능
CREATE POLICY "Authenticated users can bid" ON bids
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
\`\`\`

### 사기 방지 시스템
\`\`\`typescript
// lib/fraud-detection.ts
export class FraudDetection {
  // 의심스러운 입찰 패턴 감지
  static detectSuspiciousBidding(bids: Bid[]) {
    const patterns = {
      rapidBidding: this.checkRapidBidding(bids),
      selfBidding: this.checkSelfBidding(bids),
      unusualAmounts: this.checkUnusualAmounts(bids),
    }
    
    return patterns
  }
  
  // 빠른 연속 입찰 감지
  static checkRapidBidding(bids: Bid[]) {
    const recentBids = bids.filter(bid => 
      Date.now() - new Date(bid.created_at).getTime() < 60000 // 1분 이내
    )
    
    return recentBids.length > 5 // 1분에 5회 이상 입찰
  }
  
  // 셀프 입찰 감지
  static checkSelfBidding(bids: Bid[], sellerId: string) {
    return bids.some(bid => bid.bidder_id === sellerId)
  }
}
\`\`\`

### 데이터 검증
\`\`\`typescript
// lib/validation.ts
export const auctionSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  starting_price: z.number().min(1000).max(100000000),
  buy_now_price: z.number().optional(),
  end_time: z.date().min(new Date(Date.now() + 3600000)), // 최소 1시간 후
  images: z.array(z.string().url()).min(1).max(10),
  category_id: z.string().uuid(),
})

export const bidSchema = z.object({
  auction_id: z.string().uuid(),
  amount: z.number().min(1000),
  max_bid_amount: z.number().optional(),
})
\`\`\`

---

## 🚀 배포 및 운영

### 환경 변수
\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-blob-token

# 기타
NEXT_PUBLIC_SITE_URL=https://marketai.co.kr
ADMIN_SECRET_KEY=your-admin-secret
\`\`\`

### Vercel 배포 설정
\`\`\`json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "crons": [
    {
      "path": "/api/cron/end-auctions",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/cron/send-notifications", 
      "schedule": "*/10 * * * *"
    }
  ]
}
\`\`\`

### 성능 최적화
\`\`\`typescript
// next.config.js
const nextConfig = {
  images: {
    domains: ['your-blob-domain.vercel-storage.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  compress: true,
  poweredByHeader: false,
}
\`\`\`

---

## 📡 API 문서

### 인증 API
\`\`\`typescript
// POST /api/auth/send-sms
{
  phone: string // "+821012345678"
}

// POST /api/auth/verify-sms  
{
  phone: string,
  code: string // "123456"
}

// POST /api/auth/register
{
  phone: string,
  name: string,
  nickname?: string,
  email?: string
}
\`\`\`

### 경매 API
\`\`\`typescript
// GET /api/auctions
{
  page?: number,
  limit?: number,
  category?: string,
  status?: 'active' | 'ended',
  sort?: 'newest' | 'ending_soon' | 'price_low' | 'price_high'
}

// POST /api/auctions
{
  title: string,
  description: string,
  starting_price: number,
  buy_now_price?: number,
  end_time: string,
  images: string[],
  category_id: string,
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor',
  location?: string,
  shipping_cost: number
}

// POST /api/auctions/:id/bid
{
  amount: number,
  max_bid_amount?: number
}
\`\`\`

### 관리자 API
\`\`\`typescript
// GET /api/admin/stats
{
  range: 'today' | 'week' | 'month' | 'year'
}

// GET /api/admin/reports
{
  status?: 'pending' | 'approved' | 'rejected',
  type?: ReportType,
  page?: number
}

// POST /api/admin/reports/:id/process
{
  action: 'approve' | 'reject',
  notes: string
}

// GET /api/admin/refunds
{
  status?: 'pending' | 'approved' | 'rejected' | 'completed'
}

// POST /api/admin/refunds/:id/process
{
  decision: 'approved' | 'rejected',
  admin_notes: string
}
\`\`\`

---

## 📊 모니터링 및 분석

### 주요 메트릭
- **사용자 지표**: 가입자 수, 활성 사용자, 재방문율
- **경매 지표**: 등록 수, 낙찰률, 평균 낙찰가
- **거래 지표**: 거래 완료율, 평균 거래 금액, 수수료 수익
- **품질 지표**: 신고 건수, 환불 요청, 사용자 만족도

### 알림 시스템
\`\`\`typescript
// lib/notification-service.ts
export class NotificationService {
  // 입찰 알림
  static async notifyOutbid(userId: string, auctionId: string) {
    await this.sendNotification(userId, {
      type: 'outbid',
      title: '더 높은 입찰이 있습니다',
      message: '다른 사용자가 더 높은 가격으로 입찰했습니다.',
      action_url: `/auction/${auctionId}`
    })
  }
  
  // 경매 종료 알림
  static async notifyAuctionEnding(auctionId: string) {
    const watchers = await getAuctionWatchers(auctionId)
    
    for (const watcher of watchers) {
      await this.sendNotification(watcher.user_id, {
        type: 'auction_ending',
        title: '경매가 곧 종료됩니다',
        message: '관심 상품의 경매가 1시간 후 종료됩니다.',
        action_url: `/auction/${auctionId}`
      })
    }
  }
}
\`\`\`

---

## 🔄 업데이트 및 유지보수

### 데이터베이스 마이그레이션
\`\`\`sql
-- scripts/migrations/001_add_auto_extend.sql
ALTER TABLE auctions 
ADD COLUMN auto_extend BOOLEAN DEFAULT true;

-- scripts/migrations/002_add_featured_auctions.sql  
ALTER TABLE auctions
ADD COLUMN featured BOOLEAN DEFAULT false,
ADD COLUMN featured_until TIMESTAMP;
\`\`\`

### 백업 전략
- **자동 백업**: Supabase 자동 백업 (일일)
- **수동 백업**: 중요 업데이트 전 수동 백업
- **데이터 복구**: Point-in-time recovery 지원

### 성능 모니터링
\`\`\`typescript
// lib/performance.ts
export class PerformanceMonitor {
  static trackPageLoad(page: string, loadTime: number) {
    // Google Analytics 또는 다른 분석 도구로 전송
    gtag('event', 'page_load_time', {
      page_title: page,
      value: loadTime
    })
  }
  
  static trackApiCall(endpoint: string, duration: number, status: number) {
    // API 성능 추적
    console.log(`API ${endpoint}: ${duration}ms (${status})`)
  }
}
\`\`\`

---

## 🎯 향후 개발 계획

### Phase 1 (현재)
- ✅ 기본 경매 시스템
- ✅ 사용자 인증
- ✅ 관리자 시스템
- ✅ 환불 시스템

### Phase 2 (다음 단계)
- 🔄 PG사 결제 연동 (토스페이먼츠)
- 🔄 모바일 앱 (React Native)
- 🔄 AI 상품 추천
- 🔄 라이브 스트리밍 경매

### Phase 3 (장기)
- 🔄 글로벌 서비스 확장
- 🔄 NFT 경매 지원
- 🔄 B2B 경매 플랫폼
- 🔄 블록체인 기반 투명성

---

## 📞 지원 및 문의

- **개발팀**: dev@marketai.co.kr
- **고객지원**: support@marketai.co.kr  
- **사업문의**: business@marketai.co.kr
- **전화**: 1588-1234

---

**MarketAI** - 더 스마트한 경매, 더 안전한 거래 🎯

*마지막 업데이트: 2024년 12월*
\`\`\`
