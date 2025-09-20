'use client';

import { useState, useEffect } from 'react';
import { X, Plus, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { requestCompanyPreset, getTopRequestedCompanies } from '@/utils/presetStorage';
import type { CompanyPresetRequest } from '@/utils/presetStorage';

interface CompanyRequestFormProps {
  isVisible: boolean;
  onClose: () => void;
  onRequestSuccess: (request: CompanyPresetRequest) => void;
}

export default function CompanyRequestForm({ 
  isVisible, 
  onClose, 
  onRequestSuccess 
}: CompanyRequestFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [topRequests, setTopRequests] = useState<CompanyPresetRequest[]>([]);

  useEffect(() => {
    // 클라이언트 사이드에서만 로드
    setTopRequests(getTopRequestedCompanies(5));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim()) {
      setError('회사명을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = requestCompanyPreset({
        companyName: companyName.trim(),
        requesterName: requesterName.trim() || undefined,
        requesterEmail: requesterEmail.trim() || undefined,
      });

      if (result.success) {
        onRequestSuccess(result.request);
        onClose();
        
        // 폼 초기화
        setCompanyName('');
        setRequesterName('');
        setRequesterEmail('');
      } else {
        setError(result.error || '요청 저장에 실패했습니다.');
      }
    } catch {
      setError('요청 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">회사 규격 요청</h2>
            <p className="text-sm text-slate-600 mt-1">
              새로운 회사의 사원증 규격이 필요하신가요?
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 가장 많이 요청된 회사들 */}
          {topRequests.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-slate-600" />
                <h3 className="font-medium text-slate-900">가장 많이 요청된 회사</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {topRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="font-medium text-slate-900">{request.companyName}</span>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4" />
                      <span>{request.votes}명 요청</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'verified' ? 'bg-green-100 text-green-800' :
                        request.status === 'collecting' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status === 'verified' ? '검증완료' :
                         request.status === 'collecting' ? '수집중' :
                         '대기중'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 새 요청 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                회사명 *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="예: 롯데그룹, 포스코, 신한은행"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  이름 (선택사항)
                </label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="김철수"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  이메일 (선택사항)
                </label>
                <input
                  type="email"
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">요청 후 진행 과정</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• 다른 사용자들이 해당 회사 규격 정보를 제출할 수 있습니다</li>
                    <li>• 제출된 정보는 검증 과정을 거쳐 공식 프리셋으로 추가됩니다</li>
                    <li>• 이메일을 입력하시면 진행 상황을 알려드립니다</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !companyName.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    요청 중...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    요청 등록
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
