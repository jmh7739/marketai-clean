-- 로그인 시도 기록 테이블
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_identifier TEXT NOT NULL, -- 이메일 또는 전화번호
  ip_address TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_login_attempts_user_identifier ON login_attempts(user_identifier);
CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at ON login_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_success ON login_attempts(success);

-- RLS 정책
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- 관리자만 접근 가능
CREATE POLICY "관리자만 로그인 시도 기록 조회 가능" ON login_attempts
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 제재 기록 테이블
CREATE TABLE IF NOT EXISTS user_penalties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  penalty_type TEXT NOT NULL, -- 'bid_cancellation', 'payment_default', 'fraudulent_activity'
  penalty_action TEXT NOT NULL, -- 'warning', 'suspension_7_days', 'suspension_30_days', 'permanent_ban'
  reason TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_penalties_user_id ON user_penalties(user_id);
CREATE INDEX IF NOT EXISTS idx_user_penalties_penalty_type ON user_penalties(penalty_type);
CREATE INDEX IF NOT EXISTS idx_user_penalties_expires_at ON user_penalties(expires_at);

-- RLS 정책
ALTER TABLE user_penalties ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 제재 기록만 조회 가능
CREATE POLICY "사용자는 자신의 제재 기록만 조회 가능" ON user_penalties
  FOR SELECT USING (auth.uid() = user_id);

-- 관리자는 모든 제재 기록 관리 가능
CREATE POLICY "관리자는 모든 제재 기록 관리 가능" ON user_penalties
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 제재 횟수 초기화를 위한 함수
CREATE OR REPLACE FUNCTION reset_penalty_count()
RETURNS void AS $$
BEGIN
  -- 6개월 전 제재 기록 삭제
  DELETE FROM user_penalties 
  WHERE created_at < NOW() - INTERVAL '6 months'
    AND penalty_type = 'bid_cancellation';
END;
$$ LANGUAGE plpgsql;

-- 매일 자정에 제재 기록 정리 (cron job으로 실행)
-- SELECT cron.schedule('reset-penalties', '0 0 * * *', 'SELECT reset_penalty_count();');
