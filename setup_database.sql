-- 🚀 사원증 사진 편집기 데이터베이스 설정 스크립트
-- 새 Supabase 프로젝트에서 SQL Editor에 이 코드를 복사해서 실행하세요!

-- 1️⃣ 회사별 사원증 규격 테이블
CREATE TABLE company_presets (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  aspect_ratio TEXT NOT NULL,
  bg_color TEXT NOT NULL DEFAULT '#ffffff',
  description TEXT,
  is_official BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2️⃣ 사용자들의 회사 규격 요청
CREATE TABLE preset_requests (
  id BIGSERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  requester_name TEXT,
  requester_email TEXT,
  request_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  votes INTEGER DEFAULT 1,
  admin_comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3️⃣ 규격 데이터 제출
CREATE TABLE preset_submissions (
  id BIGSERIAL PRIMARY KEY,
  request_id BIGINT REFERENCES preset_requests(id),
  company_name TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  aspect_ratio TEXT NOT NULL,
  bg_color TEXT DEFAULT '#ffffff',
  submitter_name TEXT,
  submitter_email TEXT,
  evidence TEXT,
  votes INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4️⃣ 기존 규격에 대한 수정 의견
CREATE TABLE modification_requests (
  id BIGSERIAL PRIMARY KEY,
  company_preset_id BIGINT REFERENCES company_presets(id),
  original_preset JSONB NOT NULL,
  proposed_preset JSONB NOT NULL,
  reason TEXT NOT NULL,
  evidence TEXT,
  requester_name TEXT,
  requester_email TEXT,
  votes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'reviewing')),
  admin_comments TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  request_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5️⃣ 사용자가 생성한 커스텀 규격
CREATE TABLE custom_presets (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  aspect_ratio TEXT NOT NULL,
  bg_color TEXT DEFAULT '#ffffff',
  description TEXT,
  creator_name TEXT,
  creator_email TEXT,
  creator_ip TEXT,
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 📝 테이블 코멘트 추가
COMMENT ON TABLE company_presets IS '회사별 사원증 규격 정보';
COMMENT ON TABLE preset_requests IS '사용자들의 회사 규격 요청';
COMMENT ON TABLE preset_submissions IS '사용자들이 제출한 규격 데이터';
COMMENT ON TABLE modification_requests IS '기존 규격에 대한 수정 의견';
COMMENT ON TABLE custom_presets IS '사용자가 생성한 커스텀 규격';

-- ⚡ 수정일시 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 🔄 트리거 생성 (모든 테이블에 자동 updated_at 적용)
CREATE TRIGGER update_company_presets_updated_at 
    BEFORE UPDATE ON company_presets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preset_requests_updated_at 
    BEFORE UPDATE ON preset_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preset_submissions_updated_at 
    BEFORE UPDATE ON preset_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modification_requests_updated_at 
    BEFORE UPDATE ON modification_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_presets_updated_at 
    BEFORE UPDATE ON custom_presets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 🏢 기본 회사 데이터 입력
INSERT INTO company_presets (name, width, height, aspect_ratio, bg_color, description) VALUES
('삼성전자', 300, 400, '3:4', '#ffffff', '3:4 비율, 흰색 배경'),
('LG전자', 350, 450, '7:9', '#ffffff', '7:9 비율, 흰색 배경'),
('SK하이닉스', 300, 400, '3:4', '#f0f8ff', '3:4 비율, 연한 파란색 배경'),
('NAVER', 320, 400, '4:5', '#ffffff', '4:5 비율, 흰색 배경'),
('카카오', 300, 400, '3:4', '#fff9e6', '3:4 비율, 연한 노란색 배경'),
('현대자동차', 350, 450, '7:9', '#ffffff', '7:9 비율, 흰색 배경'),
('표준 사원증', 300, 400, '3:4', '#ffffff', '일반적인 3:4 비율, 흰색 배경');

-- ✅ 완료!
SELECT '🎉 데이터베이스 설정이 완료되었습니다!' as message;
