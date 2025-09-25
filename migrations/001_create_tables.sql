-- 🚀 사원증 사진 편집기 데이터베이스 마이그레이션
-- 001: 기본 테이블 생성

-- 1️⃣ 회사별 사원증 규격 테이블
CREATE TABLE IF NOT EXISTS company_presets (
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
CREATE TABLE IF NOT EXISTS preset_requests (
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
CREATE TABLE IF NOT EXISTS preset_submissions (
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
CREATE TABLE IF NOT EXISTS modification_requests (
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
CREATE TABLE IF NOT EXISTS custom_presets (
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
