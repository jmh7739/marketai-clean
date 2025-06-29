-- 관리자 시스템 테이블 생성 스크립트

-- 1. 관리자 사용자 테이블
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role admin_role DEFAULT 'moderator',
  permissions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 관리자 역할 enum
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'moderator');

-- 2. 신고 테이블
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  reason TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status report_status DEFAULT 'pending',
  admin_notes TEXT,
  processed_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);

-- 신고 유형 enum
CREATE TYPE report_type AS ENUM (
  'fake_product',
  'inappropriate_content', 
  'fraud',
  'spam',
  'copyright_violation',
  'harassment',
  'other'
);

-- 신고 상태 enum
CREATE TYPE report_status AS ENUM ('pending', 'investigating', 'resolved', 'dismissed');

-- 3. 환불 요청 테이블
CREATE TABLE refund_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  request_type refund_type NOT NULL,
  reason TEXT NOT NULL,
  amount INTEGER NOT NULL,
  refund_rate DECIMAL(5,2) DEFAULT 100.00,
  fee_deduction INTEGER DEFAULT 0,
  status refund_status DEFAULT 'pending',
  admin_notes TEXT,
  processed_by UUID REFERENCES admin_users(id),
  evidence_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  refunded_at TIMESTAMP
);

-- 환불 유형 enum
CREATE TYPE refund_type AS ENUM (
  'seller_cancel',
  'buyer_cancel', 
  'dispute_resolution',
  'system_error',
  'fraud_protection'
);

-- 환불 상태 enum  
CREATE TYPE refund_status AS ENUM ('pending', 'approved', 'rejected', 'processing', 'completed');

-- 4. 사용자 제재 테이블
CREATE TABLE user_sanctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sanction_type sanction_type NOT NULL,
  reason TEXT NOT NULL,
  duration_days INTEGER, -- NULL이면 영구
  is_active BOOLEAN DEFAULT true,
  applied_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  lifted_at TIMESTAMP,
  lifted_by UUID REFERENCES admin_users(id)
);

-- 제재 유형 enum
CREATE TYPE sanction_type AS ENUM ('warning', 'temporary_ban', 'permanent_ban', 'feature_restriction');

-- 5. 관리자 활동 로그
CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action admin_action NOT NULL,
  target_type target_type,
  target_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 관리자 액션 enum
CREATE TYPE admin_action AS ENUM (
  'user_ban',
  'user_unban', 
  'auction_delete',
  'auction_feature',
  'report_process',
  'refund_approve',
  'refund_reject',
  'system_setting_change',
  'admin_create',
  'admin_delete'
);

-- 대상 유형 enum
CREATE TYPE target_type AS ENUM ('user', 'auction', 'report', 'refund', 'transaction', 'admin');

-- 6. 시스템 설정 테이블
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. 공지사항 테이블
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  type announcement_type DEFAULT 'general',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  target_users TEXT[] DEFAULT '{}', -- 특정 사용자 대상 (빈 배열이면 전체)
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- 공지사항 유형 enum
CREATE TYPE announcement_type AS ENUM ('general', 'maintenance', 'policy', 'event', 'urgent');

-- 8. 통계 캐시 테이블 (성능 최적화용)
CREATE TABLE stats_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) NOT NULL,
  metric_value JSONB NOT NULL,
  date_range VARCHAR(20) NOT NULL, -- 'today', 'week', 'month', 'year'
  calculated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  UNIQUE(metric_name, date_range)
);

-- 인덱스 생성
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_reported_user ON reports(reported_user_id);

CREATE INDEX idx_refund_requests_status ON refund_requests(status);
CREATE INDEX idx_refund_requests_created_at ON refund_requests(created_at DESC);
CREATE INDEX idx_refund_requests_user ON refund_requests(user_id);

CREATE INDEX idx_user_sanctions_user_id ON user_sanctions(user_id);
CREATE INDEX idx_user_sanctions_active ON user_sanctions(is_active) WHERE is_active = true;
CREATE INDEX idx_user_sanctions_expires ON user_sanctions(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX idx_admin_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX idx_admin_logs_action ON admin_activity_logs(action);

CREATE INDEX idx_announcements_active ON announcements(is_active) WHERE is_active = true;
CREATE INDEX idx_announcements_expires ON announcements(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX idx_stats_cache_metric ON stats_cache(metric_name, date_range);
CREATE INDEX idx_stats_cache_expires ON stats_cache(expires_at);

-- RLS 정책 설정
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sanctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats_cache ENABLE ROW LEVEL SECURITY;

-- 관리자만 접근 가능한 정책
CREATE POLICY "Only admins can access admin tables" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.is_active = true
    )
  );

-- 신고는 신고자 본인과 관리자만 조회 가능
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (
    reporter_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.is_active = true
    )
  );

-- 환불 요청은 요청자 본인과 관리자만 조회 가능  
CREATE POLICY "Users can view own refund requests" ON refund_requests
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.is_active = true
    )
  );

-- 공지사항은 모든 사용자가 조회 가능
CREATE POLICY "Anyone can view active announcements" ON announcements
  FOR SELECT USING (
    is_active = true AND 
    (expires_at IS NULL OR expires_at > NOW())
  );

-- 트리거 함수들

-- 1. 관리자 활동 로그 자동 생성
CREATE OR REPLACE FUNCTION log_admin_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_activity_logs (
    admin_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    (SELECT id FROM admin_users WHERE user_id = auth.uid()),
    TG_ARGV[0]::admin_action,
    TG_ARGV[1]::target_type,
    COALESCE(NEW.id, OLD.id),
    to_jsonb(COALESCE(NEW, OLD))
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 사용자 제재 만료 자동 처리
CREATE OR REPLACE FUNCTION expire_user_sanctions()
RETURNS void AS $$
BEGIN
  UPDATE user_sanctions 
  SET is_active = false, lifted_at = NOW()
  WHERE is_active = true 
    AND expires_at IS NOT NULL 
    AND expires_at <= NOW();
END;
$$ LANGUAGE plpgsql;

-- 3. 통계 캐시 정리
CREATE OR REPLACE FUNCTION cleanup_expired_stats()
RETURNS void AS $$
BEGIN
  DELETE FROM stats_cache 
  WHERE expires_at <= NOW();
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_log_report_process
  AFTER UPDATE ON reports
  FOR EACH ROW
  WHEN (OLD.status != NEW.status)
  EXECUTE FUNCTION log_admin_activity('report_process', 'report');

CREATE TRIGGER trigger_log_refund_process  
  AFTER UPDATE ON refund_requests
  FOR EACH ROW
  WHEN (OLD.status != NEW.status)
  EXECUTE FUNCTION log_admin_activity('refund_approve', 'refund');

CREATE TRIGGER trigger_log_user_sanction
  AFTER INSERT ON user_sanctions
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_activity('user_ban', 'user');

-- 기본 시스템 설정 데이터
INSERT INTO system_settings (key, value, description, category, is_public) VALUES
('platform_fee_rates', '[
  {"min": 0, "max": 10000, "rate": 0.15},
  {"min": 10000, "max": 30000, "rate": 0.12},
  {"min": 30000, "max": 50000, "rate": 0.10},
  {"min": 50000, "max": 100000, "rate": 0.08},
  {"min": 100000, "max": 200000, "rate": 0.07},
  {"min": 200000, "max": 300000, "rate": 0.06},
  {"min": 300000, "max": 500000, "rate": 0.055},
  {"min": 500000, "max": 1000000, "rate": 0.05},
  {"min": 1000000, "max": 2000000, "rate": 0.045},
  {"min": 2000000, "max": 5000000, "rate": 0.04},
  {"min": 5000000, "max": 10000000, "rate": 0.035},
  {"min": 10000000, "max": null, "rate": 0.03}
]', '플랫폼 수수료 구조', 'finance', true),

('auction_settings', '{
  "min_auction_duration": 3600,
  "max_auction_duration": 2592000,
  "auto_extend_duration": 600,
  "min_bid_increment": 1000,
  "max_images_per_auction": 10
}', '경매 기본 설정', 'auction', true),

('notification_settings', '{
  "email_enabled": true,
  "sms_enabled": true,
  "push_enabled": true,
  "outbid_notification": true,
  "auction_ending_notification": true,
  "payment_notification": true
}', '알림 설정', 'notification', false),

('security_settings', '{
  "max_login_attempts": 5,
  "account_lockout_duration": 1800,
  "password_min_length": 8,
  "require_phone_verification": true,
  "max_bid_frequency": 10
}', '보안 설정', 'security', false);

-- 기본 공지사항
INSERT INTO announcements (title, content, type, priority, created_by) VALUES
('MarketAI 서비스 오픈', 'MarketAI 실시간 경매 플랫폼이 정식 오픈했습니다. 안전하고 투명한 거래를 경험해보세요!', 'general', 1, 
  (SELECT id FROM admin_users WHERE role = 'super_admin' LIMIT 1)),
  
('이용약관 및 개인정보처리방침 안내', '서비스 이용 전 이용약관과 개인정보처리방침을 반드시 확인해주세요.', 'policy', 2,
  (SELECT id FROM admin_users WHERE role = 'super_admin' LIMIT 1));

-- 첫 번째 슈퍼 관리자 생성 (실제 사용 시 적절한 user_id로 변경)
-- INSERT INTO admin_users (user_id, role, permissions, is_active) VALUES
-- ('your-user-id-here', 'super_admin', ARRAY['*'], true);

COMMENT ON TABLE admin_users IS '관리자 사용자 정보';
COMMENT ON TABLE reports IS '사용자 신고 내역';
COMMENT ON TABLE refund_requests IS '환불 요청 내역';
COMMENT ON TABLE user_sanctions IS '사용자 제재 내역';
COMMENT ON TABLE admin_activity_logs IS '관리자 활동 로그';
COMMENT ON TABLE system_settings IS '시스템 설정';
COMMENT ON TABLE announcements IS '공지사항';
COMMENT ON TABLE stats_cache IS '통계 캐시 (성능 최적화)';
