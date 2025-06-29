-- 분쟁 테이블
CREATE TABLE IF NOT EXISTS disputes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id),
  buyer_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  type VARCHAR(50) NOT NULL, -- 'defective', 'not_received', 'not_as_described', 'other'
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'investigating', 'mediation', 'resolved', 'closed'
  priority VARCHAR(10) DEFAULT 'medium', -- 'low', 'medium', 'high'
  description TEXT,
  evidence_urls TEXT[],
  proposed_solution JSONB,
  resolution_type VARCHAR(20),
  resolution_amount DECIMAL(10,2),
  resolution_reason TEXT,
  resolved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 분쟁 메시지 테이블
CREATE TABLE IF NOT EXISTS dispute_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dispute_id UUID REFERENCES disputes(id),
  sender_id UUID REFERENCES profiles(id),
  sender_type VARCHAR(10) NOT NULL, -- 'buyer', 'seller', 'admin'
  message TEXT NOT NULL,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 정산 스케줄 테이블 수정
CREATE TABLE IF NOT EXISTS settlement_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id),
  seller_id UUID REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'processed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 정산 테이블 수정
CREATE TABLE IF NOT EXISTS settlements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id),
  seller_id UUID REFERENCES profiles(id),
  gross_amount DECIMAL(10,2) NOT NULL,
  fee_amount DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2) NOT NULL,
  bank_account VARCHAR(50),
  account_holder VARCHAR(100),
  status VARCHAR(20) DEFAULT 'processing', -- 'processing', 'completed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  transferred_at TIMESTAMP WITH TIME ZONE
);

-- 거래 테이블에 자동확정 관련 컬럼 추가
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS auto_confirmed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS confirmation_type VARCHAR(20); -- 'manual', 'auto_with_tracking', 'auto_mandatory'

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_priority ON disputes(priority);
CREATE INDEX IF NOT EXISTS idx_dispute_messages_dispute_id ON dispute_messages(dispute_id);
CREATE INDEX IF NOT EXISTS idx_settlement_schedule_status ON settlement_schedule(status);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON settlements(status);
