# 🚀 Supabase 데이터베이스 설정 가이드

현재 권한 문제로 인해 MCP 도구로 직접 DDL 작업을 수행할 수 없습니다.
아래 단계를 따라 Supabase 웹 대시보드에서 직접 설정해주세요.

## 1️⃣ Supabase 대시보드 접속

1. [Supabase 대시보드](https://app.supabase.com) 접속
2. 프로젝트 `txddvsvhthurtuphmhzw` 선택
3. 좌측 메뉴에서 **SQL Editor** 클릭

## 2️⃣ 데이터베이스 테이블 생성

SQL Editor에서 아래 스크립트를 복사해서 실행하세요:

\`\`\`sql
-- 🚀 사원증 사진 편집기 데이터베이스 설정 스크립트

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

-- 🔐 Row Level Security 설정
ALTER TABLE company_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE modification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_presets ENABLE ROW LEVEL SECURITY;

-- 📖 읽기 권한 (모든 사용자)
CREATE POLICY "Allow read access for all users" ON company_presets FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON preset_requests FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON preset_submissions FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON modification_requests FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON custom_presets FOR SELECT USING (true);

-- ✍️ 쓰기 권한 (익명 사용자도 요청 가능)
CREATE POLICY "Allow insert for all users" ON preset_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON preset_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON modification_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON custom_presets FOR INSERT WITH CHECK (true);

-- ✅ 완료 메시지
SELECT '🎉 데이터베이스 설정이 완료되었습니다!' as message;
\`\`\`

## 3️⃣ 설정 완료 확인

설정이 완료되면 다음 명령어로 테이블이 제대로 생성되었는지 확인하세요:

\`\`\`sql
-- 테이블 목록 확인
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 기본 데이터 확인
SELECT * FROM company_presets;
\`\`\`

## 4️⃣ 연결 테스트

데이터베이스 설정이 완료되면 웹 애플리케이션에서 연결을 테스트하세요:

1. **개발 서버 실행**
   ```bash
   npm run dev
   ```

2. **브라우저에서 확인**
   - `http://localhost:3000` 접속
   - 우측 상단에 "Supabase 연결됨" 상태 확인
   - 회사 규격 요청 기능 테스트
   - 커스텀 규격 생성 기능 테스트

3. **문제 해결**
   - 연결 실패 시: Supabase 프로젝트 URL과 API 키 확인
   - 권한 오류 시: RLS 정책이 올바르게 설정되었는지 확인
   - 테이블 없음 오류 시: 위의 SQL 스크립트를 모두 실행했는지 확인

## 5️⃣ 기능 설명

### 🏢 회사 규격 관리
- **회사 규격 요청**: 사용자가 새로운 회사의 사원증 규격을 요청
- **규격 데이터 제출**: 요청된 회사의 정확한 규격 정보를 제출
- **수정 의견**: 기존 규격에 대한 개선 의견 제출
- **투표 시스템**: 커뮤니티 기반 검증 시스템

### 🛠 커스텀 규격
- **개인용 규격**: 사용자가 직접 만든 사원증 규격
- **공개/비공개**: 다른 사용자와 공유 여부 선택
- **사용 통계**: 각 규격의 인기도 추적

### 📊 관리자 기능
- **검증 대시보드**: 제출된 규격 정보 검토 및 승인
- **통계 조회**: 전체 시스템 사용 현황 모니터링
- **사용자 관리**: 부적절한 제출물 관리

---

## 📋 체크리스트

- [ ] Supabase 대시보드 접속
- [ ] SQL Editor에서 스크립트 실행
- [ ] 테이블 생성 확인 (`SELECT * FROM company_presets;`)
- [ ] 기본 데이터 입력 확인 (7개 회사 규격)
- [ ] RLS 정책 설정 확인
- [ ] 웹 애플리케이션에서 연결 상태 확인
- [ ] 회사 규격 요청 기능 테스트
- [ ] 커스텀 규격 생성 기능 테스트

## 🚀 배포 준비

프로덕션 배포 시 다음 사항을 확인하세요:

1. **환경 변수 설정**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **RLS 정책 검토**
   - 프로덕션 환경에서도 적절한 보안 정책이 적용되는지 확인

3. **성능 최적화**
   - 인덱스 추가 고려
   - 쿼리 성능 모니터링

---

## 🆘 문제 해결

### 연결 실패
```sql
-- Supabase 연결 확인
SELECT 1;
```

### 권한 오류
```sql
-- RLS 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 테이블 확인
```sql
-- 테이블 목록 확인
\dt public.*

-- 또는
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```
