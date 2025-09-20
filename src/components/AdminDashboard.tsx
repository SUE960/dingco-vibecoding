'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Database,
  Eye,
  EyeOff,
  ThumbsUp,
  X,
  Edit3,
  Vote
} from 'lucide-react';
import { 
  getTopRequestedCompanies, 
  getPendingVerifications, 
  approveSubmission,
  getPresetStats,
  getPendingModificationRequests,
  approveModificationRequest,
  rejectModificationRequest,
  voteForModification
} from '@/utils/presetStorage';
import type { 
  CompanyPresetRequest, 
  CompanyPresetSubmission,
  PresetModificationRequest 
} from '@/utils/presetStorage';

export default function AdminDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'verifications' | 'modifications'>('overview');
  const [requests, setRequests] = useState<CompanyPresetRequest[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<CompanyPresetSubmission[]>([]);
  const [pendingModifications, setPendingModifications] = useState<PresetModificationRequest[]>([]);
  const [stats, setStats] = useState<{
    totalCustomPresets?: number;
    totalCollectedData?: number;
    mostCommonSizes?: { size: string; count: number }[];
    recentAdditions?: unknown[];
  }>({});

  useEffect(() => {
    if (isVisible) {
      loadData();
    }
  }, [isVisible]);

  const loadData = () => {
    setRequests(getTopRequestedCompanies(20));
    setPendingVerifications(getPendingVerifications());
    setPendingModifications(getPendingModificationRequests());
    setStats(getPresetStats());
  };

  const handleApprove = async (submissionId: string) => {
    const result = approveSubmission(submissionId);
    if (result.success) {
      loadData(); // 데이터 새로고침
    }
  };

  const handleApproveModification = async (requestId: string, comments?: string) => {
    const result = approveModificationRequest(requestId, comments);
    if (result.success) {
      loadData(); // 데이터 새로고침
    }
  };

  const handleRejectModification = async (requestId: string, comments?: string) => {
    const result = rejectModificationRequest(requestId, comments);
    if (result.success) {
      loadData(); // 데이터 새로고침
    }
  };

  const handleVoteModification = async (requestId: string) => {
    const result = voteForModification(requestId);
    if (result.success) {
      loadData(); // 데이터 새로고침
    }
  };

  const AdminButton = () => (
    <button
      onClick={() => setIsVisible(!isVisible)}
      className="fixed bottom-4 right-4 p-3 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-colors z-40"
      title="관리자 대시보드"
    >
      {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  );

  if (!isVisible) {
    return <AdminButton />;
  }

  return (
    <>
      <AdminButton />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">관리자 대시보드</h2>
                <p className="text-sm text-slate-600">데이터 수집 및 검증 관리</p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex border-b border-slate-200 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'text-slate-900 border-b-2 border-slate-900' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              개요
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'requests' 
                  ? 'text-slate-900 border-b-2 border-slate-900' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              회사 요청 ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('verifications')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'verifications' 
                  ? 'text-slate-900 border-b-2 border-slate-900' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              검증 대기 ({pendingVerifications.length})
            </button>
            <button
              onClick={() => setActiveTab('modifications')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'modifications' 
                  ? 'text-slate-900 border-b-2 border-slate-900' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              수정 의견 ({pendingModifications.length})
            </button>
          </div>

          {/* 컨텐츠 */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 통계 카드들 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">총 요청 회사</p>
                        <p className="text-2xl font-bold text-blue-900">{requests.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-600 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-900">검증 대기</p>
                        <p className="text-2xl font-bold text-orange-900">{pendingVerifications.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-600 rounded-lg">
                        <Database className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-900">수집된 데이터</p>
                        <p className="text-2xl font-bold text-green-900">{stats.totalCollectedData || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <Edit3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-900">수정 의견</p>
                        <p className="text-2xl font-bold text-purple-900">{pendingModifications.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 가장 인기 있는 규격 */}
                  {stats.mostCommonSizes && stats.mostCommonSizes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">가장 많이 사용되는 규격</h3>
                    <div className="space-y-2">
                      {stats.mostCommonSizes.map((sizeData) => (
                        <div key={sizeData.size} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="font-medium text-slate-900">{sizeData.size}px</span>
                          <span className="text-sm text-slate-600">{sizeData.count}번 사용</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">회사 요청 목록</h3>
                {requests.map((request) => (
                  <div key={request.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900">{request.companyName}</h4>
                      <div className="flex items-center gap-2">
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
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {request.votes}명 요청
                      </span>
                      <span>{request.submissions.length}개 제출</span>
                      <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                    </div>
                    {request.requesterEmail && (
                      <p className="text-sm text-slate-500">
                        요청자: {request.requesterName || '익명'} ({request.requesterEmail})
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'verifications' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">검증 대기 목록</h3>
                {pendingVerifications.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-slate-600">검증 대기 중인 제출물이 없습니다</p>
                  </div>
                ) : (
                  pendingVerifications.map((submission) => (
                    <div key={submission.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-slate-900">
                            {submission.preset.name} - {submission.preset.width} × {submission.preset.height}px
                          </h4>
                          <p className="text-sm text-slate-600 mt-1">
                            {submission.preset.description}
                          </p>
                          {submission.evidence && (
                            <div className="mt-2">
                              <p className="text-xs text-slate-500 mb-1">증거자료:</p>
                              <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded">
                                {submission.evidence}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right text-sm">
                            <div className="text-slate-600">투표</div>
                            <div className="font-medium text-slate-900">
                              {submission.votes}
                            </div>
                          </div>
                          <button
                            onClick={() => handleApprove(submission.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            승인
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>
                          제출자: {submission.submitterName || '익명'} • 
                          {new Date(submission.submissionDate).toLocaleDateString()}
                        </span>
                        <span>신뢰도: {submission.verificationScore}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'modifications' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">수정 의견 목록</h3>
                {pendingModifications.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-slate-600">검토 대기 중인 수정 의견이 없습니다</p>
                  </div>
                ) : (
                  pendingModifications.map((modification) => (
                    <div key={modification.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">
                            {modification.originalPreset.name} 규격 수정 요청
                          </h4>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            {/* 기존 규격 */}
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">현재 규격</h5>
                              <div className="text-sm space-y-1">
                                <div>{modification.originalPreset.width} × {modification.originalPreset.height}px</div>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded border"
                                    style={{ backgroundColor: modification.originalPreset.bgColor }}
                                  />
                                  {modification.originalPreset.bgColor}
                                </div>
                              </div>
                            </div>
                            
                            {/* 제안 규격 */}
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <h5 className="text-sm font-medium text-blue-700 mb-2">제안 규격</h5>
                              <div className="text-sm space-y-1">
                                <div>{modification.proposedPreset.width} × {modification.proposedPreset.height}px</div>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded border"
                                    style={{ backgroundColor: modification.proposedPreset.bgColor }}
                                  />
                                  {modification.proposedPreset.bgColor}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm font-medium text-slate-700 mb-1">수정 사유:</p>
                            <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                              {modification.reason}
                            </p>
                          </div>
                          
                          {modification.evidence && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-slate-700 mb-1">증거자료:</p>
                              <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                                {modification.evidence}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="text-right text-sm mr-4">
                            <div className="text-slate-600">투표</div>
                            <div className="font-medium text-slate-900">
                              {modification.votes}
                            </div>
                          </div>
                          <button
                            onClick={() => handleVoteModification(modification.id)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs transition-colors"
                          >
                            <Vote className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRejectModification(modification.id, '검토 후 거부')}
                            className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm transition-colors"
                          >
                            거부
                          </button>
                          <button
                            onClick={() => handleApproveModification(modification.id, '승인됨')}
                            className="px-3 py-1 bg-green-600 text-white hover:bg-green-700 rounded text-sm transition-colors"
                          >
                            승인
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t">
                        <span>
                          제출자: {modification.requesterName || '익명'} • 
                          {new Date(modification.requestDate).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          modification.status === 'approved' ? 'bg-green-100 text-green-800' :
                          modification.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          modification.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {modification.status === 'approved' ? '승인됨' :
                           modification.status === 'rejected' ? '거부됨' :
                           modification.status === 'reviewing' ? '검토중' :
                           '대기중'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
