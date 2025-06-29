-- 상품 위치 정보 테이블
CREATE TABLE IF NOT EXISTS product_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT NOT NULL,
  district VARCHAR(50) NOT NULL, -- 구/군
  city VARCHAR(50) NOT NULL, -- 시/도
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 안전거래존 테이블
CREATE TABLE IF NOT EXISTS safe_meeting_spots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('police_station', 'subway_station', 'department_store', 'community_center')),
  operating_hours TEXT,
  facilities TEXT[], -- CCTV, 주차장, 화장실 등
  district VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 직거래 약속 테이블
CREATE TABLE IF NOT EXISTS local_meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  meeting_spot_id UUID REFERENCES safe_meeting_spots(id),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  buyer_confirmed BOOLEAN DEFAULT false,
  seller_confirmed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_product_locations_product_id ON product_locations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_locations_coordinates ON product_locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_product_locations_district ON product_locations(district);

CREATE INDEX IF NOT EXISTS idx_safe_meeting_spots_coordinates ON safe_meeting_spots(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_safe_meeting_spots_district ON safe_meeting_spots(district);
CREATE INDEX IF NOT EXISTS idx_safe_meeting_spots_type ON safe_meeting_spots(type);

CREATE INDEX IF NOT EXISTS idx_local_meetings_product_id ON local_meetings(product_id);
CREATE INDEX IF NOT EXISTS idx_local_meetings_buyer_id ON local_meetings(buyer_id);
CREATE INDEX IF NOT EXISTS idx_local_meetings_seller_id ON local_meetings(seller_id);
CREATE INDEX IF NOT EXISTS idx_local_meetings_status ON local_meetings(status);

-- RLS 정책
ALTER TABLE product_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE safe_meeting_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_meetings ENABLE ROW LEVEL SECURITY;

-- 상품 위치는 모든 사용자가 조회 가능
CREATE POLICY "Anyone can view product locations" ON product_locations
  FOR SELECT USING (true);

-- 상품 소유자만 위치 정보 수정 가능
CREATE POLICY "Product owners can manage locations" ON product_locations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_locations.product_id 
      AND products.seller_id = auth.uid()
    )
  );

-- 안전거래존은 모든 사용자가 조회 가능
CREATE POLICY "Anyone can view safe meeting spots" ON safe_meeting_spots
  FOR SELECT USING (is_active = true);

-- 관리자만 안전거래존 관리 가능
CREATE POLICY "Admins can manage safe meeting spots" ON safe_meeting_spots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 직거래 약속은 관련 당사자만 조회/수정 가능
CREATE POLICY "Meeting participants can view meetings" ON local_meetings
  FOR SELECT USING (
    buyer_id = auth.uid() OR 
    seller_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Meeting participants can manage meetings" ON local_meetings
  FOR ALL USING (
    buyer_id = auth.uid() OR 
    seller_id = auth.uid()
  );

-- 안전거래존 기본 데이터 삽입
INSERT INTO safe_meeting_spots (name, address, latitude, longitude, type, operating_hours, facilities, district, city) VALUES
('강남경찰서', '서울특별시 강남구 테헤란로 114길 11', 37.5013, 127.0396, 'police_station', '24시간', ARRAY['CCTV', '주차장'], '강남구', '서울특별시'),
('강남역 2호선', '서울특별시 강남구 강남대로 지하396', 37.4979, 127.0276, 'subway_station', '05:30-24:00', ARRAY['CCTV', '화장실'], '강남구', '서울특별시'),
('롯데백화점 본점', '서울특별시 중구 남대문로 81', 37.5651, 126.9820, 'department_store', '10:30-20:00', ARRAY['CCTV', '주차장', '화장실', '카페'], '중구', '서울특별시'),
('홍대입구역 2호선', '서울특별시 마포구 양화로 지하160', 37.5571, 126.9240, 'subway_station', '05:30-24:00', ARRAY['CCTV', '화장실'], '마포구', '서울특별시'),
('이태원경찰서', '서울특별시 용산구 이태원로 195', 37.5349, 126.9947, 'police_station', '24시간', ARRAY['CCTV', '주차장'], '용산구', '서울특별시');
