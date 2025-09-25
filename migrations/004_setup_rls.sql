-- 🚀 사원증 사진 편집기 데이터베이스 마이그레이션
-- 004: Row Level Security 설정

-- 🔐 Row Level Security 활성화
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

-- 🔄 업데이트 권한 (투표 등을 위해)
CREATE POLICY "Allow update for preset requests" ON preset_requests FOR UPDATE USING (true);
CREATE POLICY "Allow update for preset submissions" ON preset_submissions FOR UPDATE USING (true);
CREATE POLICY "Allow update for modification requests" ON modification_requests FOR UPDATE USING (true);
CREATE POLICY "Allow update for custom presets usage" ON custom_presets FOR UPDATE USING (true);
