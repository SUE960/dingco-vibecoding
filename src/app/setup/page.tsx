'use client';

import { useState } from 'react';
import { Database, Play, CheckCircle, AlertTriangle, Copy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SetupPage() {
  const [status, setStatus] = useState<{
    step: number;
    message: string;
    type: 'info' | 'success' | 'error';
  }>({
    step: 0,
    message: '설정을 시작하려면 아래 버튼을 클릭하세요.',
    type: 'info'
  });

  const [isRunning, setIsRunning] = useState(false);

  const sqlScript = `-- 🚀 사원증 사진 편집기 데이터베이스 설정
-- 아래 코드를 Supabase SQL Editor에 복사해서 실행하세요

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

-- 수정일시 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
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

-- 기본 데이터 삽입
INSERT INTO company_presets (name, width, height, aspect_ratio, bg_color, description) VALUES
('삼성전자', 300, 400, '3:4', '#ffffff', '3:4 비율, 흰색 배경'),
('LG전자', 350, 450, '7:9', '#ffffff', '7:9 비율, 흰색 배경'),
('SK하이닉스', 300, 400, '3:4', '#f0f8ff', '3:4 비율, 연한 파란색 배경'),
('NAVER', 320, 400, '4:5', '#ffffff', '4:5 비율, 흰색 배경'),
('카카오', 300, 400, '3:4', '#fff9e6', '3:4 비율, 연한 노란색 배경'),
('현대자동차', 350, 450, '7:9', '#ffffff', '7:9 비율, 흰색 배경'),
('표준 사원증', 300, 400, '3:4', '#ffffff', '일반적인 3:4 비율, 흰색 배경')
ON CONFLICT (name) DO NOTHING;

-- RLS 설정
ALTER TABLE company_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE modification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_presets ENABLE ROW LEVEL SECURITY;

-- 읽기 권한
CREATE POLICY "Allow read access for all users" ON company_presets FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON preset_requests FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON preset_submissions FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON modification_requests FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON custom_presets FOR SELECT USING (true);

-- 쓰기 권한
CREATE POLICY "Allow insert for all users" ON preset_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON preset_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON modification_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON custom_presets FOR INSERT WITH CHECK (true);

-- 업데이트 권한
CREATE POLICY "Allow update for preset requests" ON preset_requests FOR UPDATE USING (true);
CREATE POLICY "Allow update for preset submissions" ON preset_submissions FOR UPDATE USING (true);
CREATE POLICY "Allow update for modification requests" ON modification_requests FOR UPDATE USING (true);
CREATE POLICY "Allow update for custom presets usage" ON custom_presets FOR UPDATE USING (true);

-- 완료 확인
SELECT '🎉 데이터베이스 설정이 완료되었습니다!' as message;`;

  const checkConnection = async () => {
    setIsRunning(true);
    setStatus({ step: 1, message: '연결을 확인하는 중...', type: 'info' });

    try {
      // 1단계: 기본 연결 확인
      const { data, error } = await supabase
        .from('company_presets')
        .select('count', { count: 'exact', head: true });

      if (error) {
        if (error.message.includes('relation "company_presets" does not exist')) {
          setStatus({
            step: 2,
            message: '테이블이 존재하지 않습니다. 아래 SQL 스크립트를 Supabase에서 실행해주세요.',
            type: 'error'
          });
        } else {
          setStatus({
            step: 2,
            message: `연결 오류: ${error.message}`,
            type: 'error'
          });
        }
        return;
      }

      // 2단계: 데이터 확인
      setStatus({ step: 3, message: '데이터를 확인하는 중...', type: 'info' });
      
      const { data: presets, error: dataError } = await supabase
        .from('company_presets')
        .select('name')
        .limit(3);

      if (dataError) {
        setStatus({
          step: 4,
          message: `데이터 조회 오류: ${dataError.message}`,
          type: 'error'
        });
        return;
      }

      // 3단계: 쓰기 권한 테스트
      setStatus({ step: 5, message: '권한을 테스트하는 중...', type: 'info' });

      const testData = {
        company_name: '테스트회사' + Date.now(),
        requester_name: '연결테스트',
        votes: 1
      };

      const { data: insertData, error: insertError } = await supabase
        .from('preset_requests')
        .insert(testData)
        .select()
        .single();

      if (insertError) {
        setStatus({
          step: 6,
          message: `권한 오류: ${insertError.message}`,
          type: 'error'
        });
        return;
      }

      // 테스트 데이터 정리
      await supabase
        .from('preset_requests')
        .delete()
        .eq('id', insertData.id);

      setStatus({
        step: 7,
        message: `🎉 모든 테스트 완료! ${presets?.length || 0}개의 회사 규격이 등록되어 있습니다.`,
        type: 'success'
      });

    } catch (error) {
      setStatus({
        step: 8,
        message: `예상치 못한 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        type: 'error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript);
      alert('SQL 스크립트가 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('복사 실패:', error);
      alert('복사에 실패했습니다. 수동으로 복사해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* 헤더 */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Database className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Supabase 데이터베이스 설정</h1>
              <p className="text-gray-600">사원증 편집기를 위한 데이터베이스를 설정합니다</p>
            </div>
          </div>

          {/* 상태 표시 */}
          <div className={`
            flex items-center gap-3 p-4 rounded-lg mb-6
            ${status.type === 'success' ? 'bg-green-50 border border-green-200' : 
              status.type === 'error' ? 'bg-red-50 border border-red-200' : 
              'bg-blue-50 border border-blue-200'
            }
          `}>
            {status.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : status.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            ) : (
              <Database className="w-5 h-5 text-blue-600" />
            )}
            <span className={`
              font-medium
              ${status.type === 'success' ? 'text-green-800' : 
                status.type === 'error' ? 'text-red-800' : 
                'text-blue-800'
              }
            `}>
              {status.message}
            </span>
          </div>

          {/* 연결 테스트 버튼 */}
          <div className="mb-8">
            <button
              onClick={checkConnection}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  테스트 중...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  연결 테스트 시작
                </>
              )}
            </button>
          </div>

          {/* SQL 스크립트 섹션 */}
          {status.type === 'error' && (
            <div className="border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">SQL 설정 스크립트</h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  복사
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  1. <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase 대시보드</a>를 열고 프로젝트를 선택하세요<br />
                  2. 좌측 메뉴에서 <strong>SQL Editor</strong>를 클릭하세요<br />
                  3. 아래 스크립트를 복사해서 붙여넣고 실행하세요<br />
                  4. 완료 후 다시 연결 테스트를 실행하세요
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto">
                  <code>{sqlScript}</code>
                </pre>
              </div>
            </div>
          )}

          {/* 성공 시 링크 */}
          {status.type === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">설정 완료! 🎉</h3>
              <p className="text-green-700 mb-3">
                데이터베이스가 성공적으로 설정되었습니다. 이제 사원증 편집기를 사용할 수 있습니다.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                사원증 편집기로 이동 →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
