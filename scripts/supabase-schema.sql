-- MarketAI 데이터베이스 스키마
-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  nickname VARCHAR(50) UNIQUE,
  profile_image TEXT,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_sales INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 카테고리 테이블
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 경매 상품 테이블
CREATE TABLE IF NOT EXISTS auctions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES users(id) NOT NULL,
  category_id UUID REFERENCES categories(id) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  condition VARCHAR(20) NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
  starting_price INTEGER NOT NULL CHECK (starting_price > 0),
  current_price INTEGER NOT NULL DEFAULT 0,
  buy_now_price INTEGER,
  reserve_price INTEGER,
  total_bids INTEGER DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  location VARCHAR(100),
  shipping_cost INTEGER DEFAULT 0,
  shipping_method VARCHAR(50) DEFAULT 'parcel',
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'ended', 'cancelled', 'sold')),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  auto_extend BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  watch_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 입찰 테이블
CREATE TABLE IF NOT EXISTS bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES auctions(id) NOT NULL,
  bidder_id UUID REFERENCES users(id) NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  is_auto_bid BOOLEAN DEFAULT false,
  max_bid_amount INTEGER,
  is_winning BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 관심 목록 테이블
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  auction_id UUID REFERENCES auctions(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, auction_id)
);

-- 거래 테이블
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES auctions(id) NOT NULL,
  seller_id UUID REFERENCES users(id) NOT NULL,
  buyer_id UUID REFERENCES users(id) NOT NULL,
  final_price INTEGER NOT NULL,
  fee_amount INTEGER NOT NULL,
  seller_amount INTEGER NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  shipping_status VARCHAR(20) DEFAULT 'pending' CHECK (shipping_status IN ('pending', 'shipped', 'delivered', 'returned')),
  tracking_number VARCHAR(100),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 리뷰 테이블
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id) NOT NULL,
  reviewer_id UUID REFERENCES users(id) NOT NULL,
  reviewee_id UUID REFERENCES users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_seller_review BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 신고 테이블
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES users(id) NOT NULL,
  reported_user_id UUID REFERENCES users(id),
  auction_id UUID REFERENCES auctions(id),
  reason VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 알림 테이블
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON auctions(end_time);
CREATE INDEX IF NOT EXISTS idx_auctions_category ON auctions(category_id);
CREATE INDEX IF NOT EXISTS idx_auctions_seller ON auctions(seller_id);
CREATE INDEX IF NOT EXISTS idx_bids_auction ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder ON bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_bids_amount ON bids(amount DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- RLS (Row Level Security) 정책
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 정보만 수정 가능
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 모든 사용자는 다른 사용자의 공개 정보 조회 가능
CREATE POLICY "Users can view public profiles" ON users
  FOR SELECT USING (true);

-- 경매 조회는 모든 사용자 가능
CREATE POLICY "Anyone can view active auctions" ON auctions
  FOR SELECT USING (status = 'active' OR status = 'ended');

-- 경매 생성은 인증된 사용자만
CREATE POLICY "Authenticated users can create auctions" ON auctions
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- 경매 수정은 판매자만
CREATE POLICY "Sellers can update own auctions" ON auctions
  FOR UPDATE USING (auth.uid() = seller_id);

-- 입찰은 인증된 사용자만
CREATE POLICY "Authenticated users can bid" ON bids
  FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- 입찰 조회는 모든 사용자 가능
CREATE POLICY "Anyone can view bids" ON bids
  FOR SELECT USING (true);

-- 관심목록은 본인만 관리
CREATE POLICY "Users can manage own watchlist" ON watchlist
  FOR ALL USING (auth.uid() = user_id);

-- 알림은 본인만 조회
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- 기본 카테고리 데이터 삽입
INSERT INTO categories (name, slug, description) VALUES
('전자제품', 'electronics', '스마트폰, 노트북, 가전제품 등'),
('패션/의류', 'fashion', '의류, 신발, 가방, 액세서리 등'),
('뷰티/화장품', 'beauty', '화장품, 향수, 스킨케어 등'),
('스포츠/레저', 'sports', '운동용품, 아웃도어, 자전거 등'),
('도서/음반', 'books', '책, CD, DVD, 게임 등'),
('가구/인테리어', 'furniture', '가구, 조명, 인테리어 소품 등'),
('생활용품', 'household', '주방용품, 청소용품, 생활잡화 등'),
('취미/수집품', 'hobbies', '피규어, 카드, 골동품 등'),
('자동차/오토바이', 'vehicles', '자동차, 오토바이, 자동차용품 등'),
('기타', 'others', '기타 상품들')
ON CONFLICT (slug) DO NOTHING;

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auctions_updated_at BEFORE UPDATE ON auctions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
