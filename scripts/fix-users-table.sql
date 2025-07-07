-- MarketAI 사용자 테이블 생성 및 설정
-- 이 스크립트는 Supabase SQL Editor에서 실행하세요

-- 기존 테이블이 있다면 삭제 (주의: 데이터가 모두 삭제됩니다)
DROP TABLE IF EXISTS public.users CASCADE;

-- users 테이블 생성
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firebase_uid TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone_verified BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- 추가 사용자 정보
    birth_date DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    address JSONB,
    preferences JSONB DEFAULT '{}',
    
    -- 계정 상태
    is_active BOOLEAN DEFAULT true,
    is_banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    ban_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- 인증 관련
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    
    -- 제약 조건
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR email IS NULL),
    CONSTRAINT users_phone_format CHECK (phone ~* '^\+[1-9]\d{1,14}$'),
    CONSTRAINT users_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100)
);

-- 인덱스 생성
CREATE INDEX idx_users_firebase_uid ON public.users(firebase_uid);
CREATE INDEX idx_users_email ON public.users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_phone ON public.users(phone);
CREATE INDEX idx_users_created_at ON public.users(created_at);
CREATE INDEX idx_users_is_active ON public.users(is_active);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
-- 1. 사용자는 자신의 데이터만 조회 가능
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = firebase_uid);

-- 2. 사용자는 자신의 데이터만 업데이트 가능
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = firebase_uid);

-- 3. 새 사용자 생성 허용 (회원가입)
CREATE POLICY "Enable insert for authenticated users" ON public.users
    FOR INSERT WITH CHECK (true);

-- 4. 관리자는 모든 데이터 접근 가능 (선택사항)
-- CREATE POLICY "Admin full access" ON public.users
--     FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 사용자 프로필 뷰 생성 (민감한 정보 제외)
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
    id,
    firebase_uid,
    email,
    phone,
    name,
    phone_verified,
    email_verified,
    profile_image_url,
    created_at,
    updated_at,
    birth_date,
    gender,
    is_active,
    last_login_at,
    login_count
FROM public.users
WHERE is_active = true AND is_banned = false;

-- 뷰에 대한 RLS 정책
ALTER VIEW public.user_profiles SET (security_invoker = true);

-- 사용자 통계 함수
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE(
    total_users BIGINT,
    verified_users BIGINT,
    active_users BIGINT,
    new_users_today BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE phone_verified = true) as verified_users,
        COUNT(*) FILTER (WHERE is_active = true AND is_banned = false) as active_users,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as new_users_today
    FROM public.users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 사용자 검색 함수
CREATE OR REPLACE FUNCTION search_users(search_term TEXT)
RETURNS TABLE(
    id UUID,
    firebase_uid TEXT,
    name TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.firebase_uid,
        u.name,
        u.email,
        u.phone,
        u.created_at
    FROM public.users u
    WHERE 
        u.is_active = true 
        AND u.is_banned = false
        AND (
            u.name ILIKE '%' || search_term || '%' 
            OR u.email ILIKE '%' || search_term || '%'
            OR u.phone ILIKE '%' || search_term || '%'
        )
    ORDER BY u.created_at DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 테스트 데이터 삽입 (선택사항)
INSERT INTO public.users (
    firebase_uid,
    email,
    phone,
    name,
    phone_verified,
    email_verified
) VALUES 
(
    'test-firebase-uid-1',
    'test1@example.com',
    '+821012345678',
    '테스트 사용자 1',
    true,
    true
),
(
    'test-firebase-uid-2',
    'test2@example.com',
    '+821087654321',
    '테스트 사용자 2',
    true,
    false
);

-- 테이블 생성 확인
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'users'
ORDER BY ordinal_position;

-- 인덱스 확인
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'users' 
    AND schemaname = 'public';

-- RLS 정책 확인
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users' 
    AND schemaname = 'public';

-- 테스트 쿼리
SELECT 'users 테이블 생성 완료!' as status;
SELECT COUNT(*) as total_rows FROM public.users;

-- 사용자 통계 확인
SELECT * FROM get_user_stats();

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '=== MarketAI Users 테이블 설정 완료 ===';
    RAISE NOTICE '1. users 테이블이 생성되었습니다.';
    RAISE NOTICE '2. 필요한 인덱스가 생성되었습니다.';
    RAISE NOTICE '3. RLS 정책이 설정되었습니다.';
    RAISE NOTICE '4. 유틸리티 함수들이 생성되었습니다.';
    RAISE NOTICE '5. 테스트 데이터가 삽입되었습니다.';
    RAISE NOTICE '이제 애플리케이션에서 사용자 인증을 테스트할 수 있습니다.';
END $$;
