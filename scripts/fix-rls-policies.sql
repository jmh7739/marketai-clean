-- 누락된 RLS 활성화 및 정책 수정

-- categories와 reports 테이블 RLS 활성화
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- categories 테이블 정책 (모든 사용자가 조회 가능)
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- categories 테이블 관리자 정책 (관리 작업용)
CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- reports 테이블 정책 (신고자와 신고당한 사용자만 조회)
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (
    auth.uid() = reporter_id OR 
    auth.uid() = reported_user_id
  );

-- reports 테이블 생성 정책 (인증된 사용자만)
CREATE POLICY "Authenticated users can create reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- reports 테이블 업데이트 정책 (관리자용 - 나중에 관리자 시스템 구현 시 사용)
CREATE POLICY "Service role can update reports" ON reports
  FOR UPDATE USING (auth.role() = 'service_role');
