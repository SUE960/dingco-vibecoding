'use client';

import { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, Vote } from 'lucide-react';
import { submitCompanyPreset, voteForSubmission } from '@/utils/presetStorage';
import type { CompanyPresetRequest } from '@/utils/presetStorage';
import { PhotoSpec } from './CompanyPresets';

interface DataSubmissionFormProps {
  isVisible: boolean;
  onClose: () => void;
  request: CompanyPresetRequest;
  onSubmissionSuccess: () => void;
}

export default function DataSubmissionForm({ 
  isVisible, 
  onClose, 
  request,
  onSubmissionSuccess 
}: DataSubmissionFormProps) {
  const [preset, setPreset] = useState<PhotoSpec>({
    name: request.companyName,
    width: 300,
    height: 400,
    aspectRatio: '3:4',
    bgColor: '#ffffff',
    description: ''
  });
  
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [evidence, setEvidence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('existing');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!preset.width || !preset.height) {
      setError('가로, 세로 크기를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = submitCompanyPreset({
        requestId: request.id,
        preset: {
          ...preset,
          description: preset.description || `${preset.aspectRatio} 비율, ${preset.bgColor === '#ffffff' ? '흰색' : '컬러'} 배경`
        },
        submitterName: submitterName.trim() || undefined,
        submitterEmail: submitterEmail.trim() || undefined,
        evidence: evidence.trim() || undefined,
      });

      if (result.success) {
        onSubmissionSuccess();
        onClose();
      } else {
        setError(result.error || '제출에 실패했습니다.');
      }
    } catch {
      setError('제출 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (submissionId: string) => {
    const result = voteForSubmission(submissionId);
    if (result.success) {
      onSubmissionSuccess(); // 리렌더링을 위해 호출
    }
  };

  const calculateAspectRatio = (width: number, height: number) => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  };

  const handleSizeChange = (width: number, height: number) => {
    const aspectRatio = calculateAspectRatio(width, height);
    setPreset(prev => ({
      ...prev,
      width,
      height,
      aspectRatio
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {request.companyName} 규격 정보 제출
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              정확한 사원증 규격 정보를 제공해주세요
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* 탭 네비게이션 */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveTab('existing')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'existing' 
                  ? 'text-slate-900 border-b-2 border-slate-900' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              기존 제출 현황
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'new' 
                  ? 'text-slate-900 border-b-2 border-slate-900' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              새로운 정보 제출
            </button>
          </div>

          {activeTab === 'existing' && (
            <div className="space-y-4">
              {request.submissions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-medium text-slate-900 mb-2">
                    아직 제출된 정보가 없습니다
                  </h3>
                  <p className="text-slate-600 text-sm">
                    첫 번째로 {request.companyName}의 사원증 규격을 제출해보세요!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {request.submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="border border-slate-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-slate-900">
                              {submission.preset.width} × {submission.preset.height}px
                            </h4>
                            {submission.isVerified && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-xs font-medium text-green-700">
                                  검증완료
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">
                            {submission.preset.description}
                          </p>
                          {submission.evidence && (
                            <div className="mt-2">
                              <p className="text-xs text-slate-500 mb-1">증거자료:</p>
                              <p className="text-sm text-slate-700">{submission.evidence}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right text-sm">
                            <div className="text-slate-600">신뢰도</div>
                            <div className="font-medium text-slate-900">
                              {submission.verificationScore}%
                            </div>
                          </div>
                          <button
                            onClick={() => handleVote(submission.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm transition-colors"
                          >
                            <Vote className="w-3 h-3" />
                            {submission.votes}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>
                          {submission.submitterName || '익명'} • 
                          {new Date(submission.submissionDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'new' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 규격 정보 */}
              <div>
                <h3 className="font-medium text-slate-900 mb-4">사원증 규격 정보</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      가로 크기 (px) *
                    </label>
                    <input
                      type="number"
                      value={preset.width}
                      onChange={(e) => handleSizeChange(Number(e.target.value), preset.height)}
                      min="100"
                      max="1000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      세로 크기 (px) *
                    </label>
                    <input
                      type="number"
                      value={preset.height}
                      onChange={(e) => handleSizeChange(preset.width, Number(e.target.value))}
                      min="100"
                      max="1000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      배경색
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={preset.bgColor}
                        onChange={(e) => setPreset(prev => ({ ...prev, bgColor: e.target.value }))}
                        className="w-12 h-10 border border-slate-300 rounded-lg"
                        disabled={isSubmitting}
                      />
                      <input
                        type="text"
                        value={preset.bgColor}
                        onChange={(e) => setPreset(prev => ({ ...prev, bgColor: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      비율 (자동 계산)
                    </label>
                    <input
                      type="text"
                      value={preset.aspectRatio}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              {/* 증거 자료 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  증거 자료 (선택사항)
                </label>
                <textarea
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="공식 웹사이트 링크, 인사팀 확인 사항, 실제 사원증 정보 등을 입력해주세요"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* 제출자 정보 */}
              <div>
                <h3 className="font-medium text-slate-900 mb-4">제출자 정보 (선택사항)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      value={submitterName}
                      onChange={(e) => setSubmitterName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      이메일
                    </label>
                    <input
                      type="email"
                      value={submitterEmail}
                      onChange={(e) => setSubmitterEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

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
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      제출 중...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      정보 제출
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
