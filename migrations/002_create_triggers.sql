-- 🚀 사원증 사진 편집기 데이터베이스 마이그레이션
-- 002: 트리거 및 함수 생성

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
