-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar TEXT,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_sales INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  preferences TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 경매 테이블
CREATE TABLE IF NOT EXISTS auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  current_bid DECIMAL(12,2) DEFAULT 0,
  starting_bid DECIMAL(12,2) NOT NULL,
  buy_now_price DECIMAL(12,2),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  seller_id UUID REFERENCES users(id),
  seller_name TEXT NOT NULL,
  category TEXT NOT NULL,
  condition TEXT NOT NULL,
  images TEXT[],
  bid_count INTEGER DEFAULT 0,
  watchers INTEGER DEFAULT 0,
  location TEXT,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended', 'sold')),
  is_live BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 입찰 테이블
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES auctions(id),
  bidder_id UUID REFERENCES users(id),
  bidder_name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_auto_bid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_end_date ON auctions(end_date);
CREATE INDEX IF NOT EXISTS idx_auctions_category ON auctions(category);
CREATE INDEX IF NOT EXISTS idx_auctions_seller_id ON auctions(seller_id);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON bids(bidder_id);

-- RLS (Row Level Security) 정책
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- 사용자 정책
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- 경매 정책
CREATE POLICY "Anyone can view auctions" ON auctions FOR SELECT USING (true);
CREATE POLICY "Users can create auctions" ON auctions FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own auctions" ON auctions FOR UPDATE USING (auth.uid() = seller_id);

-- 입찰 정책
CREATE POLICY "Anyone can view bids" ON bids FOR SELECT USING (true);
CREATE POLICY "Users can create bids" ON bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);
