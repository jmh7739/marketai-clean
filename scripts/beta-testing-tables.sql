-- 베타 테스터 테이블
CREATE TABLE beta_testers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  testing_start_date TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 베타 피드백 테이블
CREATE TABLE beta_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tester_id UUID REFERENCES beta_testers(id),
  category VARCHAR(20) NOT NULL CHECK (category IN ('bug', 'feature', 'ui', 'performance', 'other')),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  screenshots TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_beta_feedback_tester_id ON beta_feedback(tester_id);
CREATE INDEX idx_beta_feedback_category ON beta_feedback(category);
CREATE INDEX idx_beta_feedback_severity ON beta_feedback(severity);
CREATE INDEX idx_beta_feedback_status ON beta_feedback(status);
