-- 정산 스케줄 테이블
CREATE TABLE settlement_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id),
  seller_id UUID REFERENCES profiles(id),
  amount DECIMAL(12,2) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'processing', 'processed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 정산 기록 테이블
CREATE TABLE settlements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id),
  seller_id UUID REFERENCES profiles(id),
  gross_amount DECIMAL(12,2) NOT NULL,
  fee_amount DECIMAL(12,2) NOT NULL,
  net_amount DECIMAL(12,2) NOT NULL,
  bank_account TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  transferred_at TIMESTAMP WITH TIME ZONE
);

-- 소액 정산 보류 테이블
CREATE TABLE settlement_holds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id),
  amount DECIMAL(12,2) NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  released_at TIMESTAMP WITH TIME ZONE
);

-- 분쟁 테이블
CREATE TABLE disputes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id),
  buyer_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL CHECK (type IN ('defective', 'not_received', 'not_as_described', 'other')),
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  resolution_type TEXT CHECK (resolution_type IN ('refund', 'exchange', 'partial_refund', 'no_action')),
  resolution_amount DECIMAL(12,2),
  resolution_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 인덱스 생성
CREATE INDEX idx_settlement_schedule_date ON settlement_schedule(scheduled_at);
CREATE INDEX idx_settlements_seller ON settlements(seller_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_priority ON disputes(priority);

-- RLS 정책
ALTER TABLE settlement_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlement_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- 정산 관련 정책
CREATE POLICY "판매자는 자신의 정산 정보만 조회" ON settlements
  FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "관리자는 모든 정산 정보 접근" ON settlements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 분쟁 관련 정책
CREATE POLICY "당사자는 자신의 분쟁만 조회" ON disputes
  FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "구매자는 분쟁 생성 가능" ON disputes
  FOR INSERT WITH CHECK (buyer_id = auth.uid());
