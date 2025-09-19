'use client';

import { useState } from 'react';
import { X, Edit3, ArrowRight, AlertCircle, ExternalLink } from 'lucide-react';
import { submitModificationRequest } from '@/utils/presetStorage';
import type { PhotoSpec } from './CompanyPresets';

interface ModificationRequestFormProps {
  isVisible: boolean;
  onClose: () => void;
  originalPreset: PhotoSpec;
  onSubmissionSuccess: () => void;
}

export default function ModificationRequestForm({ 
  isVisible, 
  onClose, 
  originalPreset,
  onSubmissionSuccess 
}: ModificationRequestFormProps) {
  const [proposedPreset, setProposedPreset] = useState<PhotoSpec>({
    ...originalPreset
  });
  
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const calculateAspectRatio = (width: number, height: number) => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  };

  const handleSizeChange = (width: number, height: number) => {
    const aspectRatio = calculateAspectRatio(width, height);
    setProposedPreset(prev => ({
      ...prev,
      width,
      height,
      aspectRatio
    }));
  };

  const hasChanges = () => {
    return (
      originalPreset.width !== proposedPreset.width ||
      originalPreset.height !== proposedPreset.height ||
      originalPreset.bgColor !== proposedPreset.bgColor ||
      originalPreset.description !== proposedPreset.description
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges()) {
      setError('변경사항이 없습니다. 수정할 내용을 입력해주세요.');
      return;
    }

    if (!reason.trim()) {
      setError('수정 사유를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = submitModificationRequest({
        originalPreset,
        proposedPreset: {
          ...proposedPreset,
          description: proposedPreset.description || `${proposedPreset.aspectRatio} 비율, ${proposedPreset.bgColor === '#ffffff' ? '흰색' : '컬러'} 배경`
        },
        requesterName: requesterName.trim() || undefined,
        requesterEmail: requesterEmail.trim() || undefined,
        reason: reason.trim(),
        evidence: evidence.trim() || undefined,
      });

      if (result.success) {
        onSubmissionSuccess();
        onClose();
        
        // 폼 초기화
        setProposedPreset({ ...originalPreset });
        setRequesterName('');
        setRequesterEmail('');
        setReason('');
        setEvidence('');
      } else {
        setError(result.error || '제출에 실패했습니다.');
      }
    } catch (err) {
      setError('제출 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {originalPreset.name} 규격 수정 의견
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              변경된 사항이 있다면 수정 의견을 제출해주세요
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 변경 전후 비교 */}
            <div>
              <h3 className="font-medium text-slate-900 mb-4">변경 전후 비교</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 기존 규격 */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <h4 className="font-medium text-slate-700">현재 규격</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">크기:</span>
                      <span className="font-medium">{originalPreset.width} × {originalPreset.height}px</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">비율:</span>
                      <span className="font-medium">{originalPreset.aspectRatio}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">배경색:</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border border-slate-300"
                          style={{ backgroundColor: originalPreset.bgColor }}
                        />
                        <span className="font-medium">{originalPreset.bgColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 제안 규격 */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-blue-700">제안 규격</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          가로 (px)
                        </label>
                        <input
                          type="number"
                          value={proposedPreset.width}
                          onChange={(e) => handleSizeChange(Number(e.target.value), proposedPreset.height)}
                          min="100"
                          max="1000"
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          세로 (px)
                        </label>
                        <input
                          type="number"
                          value={proposedPreset.height}
                          onChange={(e) => handleSizeChange(proposedPreset.width, Number(e.target.value))}
                          min="100"
                          max="1000"
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        배경색
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={proposedPreset.bgColor}
                          onChange={(e) => setProposedPreset(prev => ({ ...prev, bgColor: e.target.value }))}
                          className="w-8 h-8 border border-slate-300 rounded"
                          disabled={isSubmitting}
                        />
                        <input
                          type="text"
                          value={proposedPreset.bgColor}
                          onChange={(e) => setProposedPreset(prev => ({ ...prev, bgColor: e.target.value }))}
                          className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      비율: {proposedPreset.aspectRatio}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 수정 사유 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                수정 사유 *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="어떤 이유로 규격이 변경되었는지 설명해주세요. 예: 2024년부터 새로운 규격으로 변경, 공식 홈페이지 업데이트 확인 등"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            {/* 증거 자료 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                증거 자료 (선택사항)
              </label>
              <textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="공식 웹사이트 링크, 공지사항, 인사팀 공문 등 수정 근거가 되는 자료를 입력해주세요"
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">수정 의견 처리 과정</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• 제출된 수정 의견은 관리자가 검토합니다</li>
                    <li>• 다른 사용자들이 투표를 통해 의견에 동의할 수 있습니다</li>
                    <li>• 승인되면 해당 회사의 공식 규격이 업데이트됩니다</li>
                    <li>• 이메일을 입력하시면 처리 결과를 알려드립니다</li>
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
                disabled={isSubmitting || !hasChanges() || !reason.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    제출 중...
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    수정 의견 제출
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
