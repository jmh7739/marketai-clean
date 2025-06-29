-- 배송 파손 케이스 테이블
CREATE TABLE IF NOT EXISTS shipping_damage_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  buyer_id UUID REFERENCES auth.users(id),
  seller_id UUID REFERENCES auth.users(id),
  carrier_id VARCHAR(50),
  tracking_number VARCHAR(100),
  damage_type VARCHAR(20) CHECK (damage_type IN ('packaging', 'product', 'both')),
  damage_description TEXT NOT NULL,
  packaging_photos TEXT[],
  product_photos TEXT[],
  packaging_analysis JSONB,
  carrier_insurance_eligible BOOLEAN DEFAULT FALSE,
  carrier_insurance_claim VARCHAR(100),
  responsibility VARCHAR(20) CHECK (responsibility IN ('carrier', 'seller', 'disputed')),
  status VARCHAR(20) DEFAULT 'investigating' CHECK (status IN ('investigating', 'carrier_liable', 'seller_liable', 'resolved')),
  resolution_type VARCHAR(30),
  resolution_amount DECIMAL(12,2),
  resolution_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_shipping_damage_transaction ON shipping_damage_cases(transaction_id);
CREATE INDEX IF NOT EXISTS idx_shipping_damage_status ON shipping_damage_cases(status);
CREATE INDEX IF NOT EXISTS idx_shipping_damage_created ON shipping_damage_cases(created_at DESC);
