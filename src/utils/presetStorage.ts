import { PhotoSpec } from '@/components/CompanyPresets';

// 로컬 스토리지 키
const CUSTOM_PRESETS_KEY = 'custom_presets';
const COLLECTED_DATA_KEY = 'collected_preset_data';
const REQUESTED_COMPANIES_KEY = 'requested_companies';
const VERIFICATION_QUEUE_KEY = 'verification_queue';
const MODIFICATION_REQUESTS_KEY = 'modification_requests';

// 회사 데이터 수집을 위한 인터페이스
export interface CompanyPresetRequest {
  id: string;
  companyName: string;
  requesterEmail?: string;
  requesterName?: string;
  requestDate: string;
  status: 'pending' | 'collecting' | 'verified' | 'added';
  votes: number;
  submissions: CompanyPresetSubmission[];
}

export interface CompanyPresetSubmission {
  id: string;
  requestId: string;
  preset: PhotoSpec;
  submitterEmail?: string;
  submitterName?: string;
  submissionDate: string;
  evidence?: string; // 증거 자료 (링크, 설명 등)
  verificationScore: number; // 0-100
  isVerified: boolean;
  votes: number;
}

// 기존 규격 수정 요청을 위한 인터페이스
export interface PresetModificationRequest {
  id: string;
  originalPreset: PhotoSpec;
  proposedPreset: PhotoSpec;
  requesterEmail?: string;
  requesterName?: string;
  requestDate: string;
  reason: string; // 수정 사유
  evidence?: string; // 증거 자료
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  votes: number;
  adminComments?: string;
}

// 사용자 정의 프리셋 저장
export const saveCustomPreset = (preset: PhotoSpec) => {
  try {
    const existingPresets = getCustomPresets();
    const updatedPresets = [...existingPresets, preset];
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(updatedPresets));
    return true;
  } catch (error) {
    console.error('Failed to save custom preset:', error);
    return false;
  }
};

// 사용자 정의 프리셋 불러오기
export const getCustomPresets = (): PhotoSpec[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_PRESETS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load custom presets:', error);
    return [];
  }
};

// 데이터 수집용 (실제 환경에서는 서버로 전송)
export const collectPresetData = (data: {
  preset: PhotoSpec;
  contactEmail?: string;
  timestamp: string;
}) => {
  try {
    // 로컬에서는 콘솔 로그로 시뮬레이션
    console.log('🔍 새로운 사원증 규격 데이터 수집:', data);
    
    // 실제로는 API 호출
    // await fetch('/api/collect-preset', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });

    // 로컬 저장소에 수집 데이터 기록 (통계용)
    const existingData = getCollectedData();
    const updatedData = [...existingData, data];
    localStorage.setItem(COLLECTED_DATA_KEY, JSON.stringify(updatedData));
    
    return true;
  } catch (error) {
    console.error('Failed to collect preset data:', error);
    return false;
  }
};

// 수집된 데이터 조회 (관리자용)
export const getCollectedData = () => {
  try {
    const stored = localStorage.getItem(COLLECTED_DATA_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load collected data:', error);
    return [];
  }
};

// 통계 조회
export const getPresetStats = () => {
  const collectedData = getCollectedData();
  const customPresets = getCustomPresets();
  
  return {
    totalCustomPresets: customPresets.length,
    totalCollectedData: collectedData.length,
    mostCommonSizes: getMostCommonSizes(collectedData),
    recentAdditions: collectedData.slice(-5)
  };
};

interface CollectedDataItem {
  preset: PhotoSpec;
  contactEmail?: string;
  timestamp: string;
}

// 가장 많이 사용되는 규격 분석
const getMostCommonSizes = (data: CollectedDataItem[]) => {
  const sizeCount: Record<string, number> = {};
  
  data.forEach(item => {
    const key = `${item.preset.width}x${item.preset.height}`;
    sizeCount[key] = (sizeCount[key] || 0) + 1;
  });
  
  return Object.entries(sizeCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([size, count]) => ({ size, count }));
};

// === 회사 규격 요청 및 수집 시스템 ===

// 새로운 회사 규격 요청
export const requestCompanyPreset = (request: {
  companyName: string;
  requesterEmail?: string;
  requesterName?: string;
}) => {
  try {
    const newRequest: CompanyPresetRequest = {
      id: generateId(),
      companyName: request.companyName,
      requesterEmail: request.requesterEmail,
      requesterName: request.requesterName,
      requestDate: new Date().toISOString(),
      status: 'pending',
      votes: 1,
      submissions: []
    };

    const existingRequests = getCompanyRequests();
    
    // 이미 요청된 회사인지 확인
    const existingRequest = existingRequests.find(
      req => req.companyName.toLowerCase() === request.companyName.toLowerCase()
    );
    
    if (existingRequest) {
      // 기존 요청에 투표 추가
      existingRequest.votes += 1;
      saveCompanyRequests(existingRequests);
      return { success: true, isNew: false, request: existingRequest };
    } else {
      // 새로운 요청 추가
      const updatedRequests = [...existingRequests, newRequest];
      saveCompanyRequests(updatedRequests);
      return { success: true, isNew: true, request: newRequest };
    }
  } catch (error) {
    console.error('Failed to request company preset:', error);
    return { success: false, error: 'Failed to save request' };
  }
};

// 회사 규격 데이터 제출
export const submitCompanyPreset = (submission: {
  requestId: string;
  preset: PhotoSpec;
  submitterEmail?: string;
  submitterName?: string;
  evidence?: string;
}) => {
  try {
    const newSubmission: CompanyPresetSubmission = {
      id: generateId(),
      requestId: submission.requestId,
      preset: submission.preset,
      submitterEmail: submission.submitterEmail,
      submitterName: submission.submitterName,
      submissionDate: new Date().toISOString(),
      evidence: submission.evidence,
      verificationScore: 0,
      isVerified: false,
      votes: 1
    };

    // 요청 목록 업데이트
    const requests = getCompanyRequests();
    const targetRequest = requests.find(req => req.id === submission.requestId);
    
    if (targetRequest) {
      targetRequest.submissions.push(newSubmission);
      targetRequest.status = 'collecting';
      saveCompanyRequests(requests);
    }

    // 검증 대기열에 추가
    const verificationQueue = getVerificationQueue();
    verificationQueue.push(newSubmission);
    saveVerificationQueue(verificationQueue);

    console.log('🎯 새로운 회사 규격 제출:', newSubmission);
    return { success: true, submission: newSubmission };
  } catch (error) {
    console.error('Failed to submit company preset:', error);
    return { success: false, error: 'Failed to save submission' };
  }
};

// 제출된 규격에 투표
export const voteForSubmission = (submissionId: string) => {
  try {
    const requests = getCompanyRequests();
    let updated = false;

    requests.forEach(request => {
      const submission = request.submissions.find(sub => sub.id === submissionId);
      if (submission) {
        submission.votes += 1;
        submission.verificationScore = Math.min(100, submission.verificationScore + 10);
        updated = true;
      }
    });

    if (updated) {
      saveCompanyRequests(requests);
      return { success: true };
    }
    return { success: false, error: 'Submission not found' };
  } catch (error) {
    console.error('Failed to vote for submission:', error);
    return { success: false, error: 'Failed to update vote' };
  }
};

// === 저장소 함수들 ===

const getCompanyRequests = (): CompanyPresetRequest[] => {
  try {
    const stored = localStorage.getItem(REQUESTED_COMPANIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load company requests:', error);
    return [];
  }
};

const saveCompanyRequests = (requests: CompanyPresetRequest[]) => {
  try {
    localStorage.setItem(REQUESTED_COMPANIES_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error('Failed to save company requests:', error);
  }
};

const getVerificationQueue = (): CompanyPresetSubmission[] => {
  try {
    const stored = localStorage.getItem(VERIFICATION_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load verification queue:', error);
    return [];
  }
};

const saveVerificationQueue = (queue: CompanyPresetSubmission[]) => {
  try {
    localStorage.setItem(VERIFICATION_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to save verification queue:', error);
  }
};

// 관리용 함수들
export const getTopRequestedCompanies = (limit: number = 10) => {
  const requests = getCompanyRequests();
  return requests
    .sort((a, b) => b.votes - a.votes)
    .slice(0, limit);
};

export const getPendingVerifications = () => {
  return getVerificationQueue().filter(submission => !submission.isVerified);
};

export const approveSubmission = (submissionId: string) => {
  try {
    const requests = getCompanyRequests();
    let approvedSubmission: CompanyPresetSubmission | null = null;

    // 제출물을 승인으로 표시
    requests.forEach(request => {
      const submission = request.submissions.find(sub => sub.id === submissionId);
      if (submission) {
        submission.isVerified = true;
        submission.verificationScore = 100;
        approvedSubmission = submission;
        request.status = 'verified';
      }
    });

    if (approvedSubmission) {
      saveCompanyRequests(requests);
      
      // 검증 대기열에서 제거
      const queue = getVerificationQueue().filter(sub => sub.id !== submissionId);
      saveVerificationQueue(queue);

      return { success: true, submission: approvedSubmission };
    }
    
    return { success: false, error: 'Submission not found' };
  } catch (error) {
    console.error('Failed to approve submission:', error);
    return { success: false, error: 'Failed to approve submission' };
  }
};

// === 기존 규격 수정 요청 시스템 ===

// 규격 수정 의견 제출
export const submitModificationRequest = (request: {
  originalPreset: PhotoSpec;
  proposedPreset: PhotoSpec;
  requesterEmail?: string;
  requesterName?: string;
  reason: string;
  evidence?: string;
}) => {
  try {
    const newRequest: PresetModificationRequest = {
      id: generateId(),
      originalPreset: request.originalPreset,
      proposedPreset: request.proposedPreset,
      requesterEmail: request.requesterEmail,
      requesterName: request.requesterName,
      requestDate: new Date().toISOString(),
      reason: request.reason,
      evidence: request.evidence,
      status: 'pending',
      votes: 1
    };

    const existingRequests = getModificationRequests();
    const updatedRequests = [...existingRequests, newRequest];
    saveModificationRequests(updatedRequests);

    console.log('📝 새로운 규격 수정 의견 제출:', newRequest);
    return { success: true, request: newRequest };
  } catch (error) {
    console.error('Failed to submit modification request:', error);
    return { success: false, error: 'Failed to save modification request' };
  }
};

// 수정 의견에 투표
export const voteForModification = (requestId: string) => {
  try {
    const requests = getModificationRequests();
    const targetRequest = requests.find(req => req.id === requestId);
    
    if (targetRequest) {
      targetRequest.votes += 1;
      saveModificationRequests(requests);
      return { success: true };
    }
    
    return { success: false, error: 'Request not found' };
  } catch (error) {
    console.error('Failed to vote for modification:', error);
    return { success: false, error: 'Failed to update vote' };
  }
};

// 수정 의견 승인 (관리자)
export const approveModificationRequest = (requestId: string, adminComments?: string) => {
  try {
    const requests = getModificationRequests();
    const targetRequest = requests.find(req => req.id === requestId);
    
    if (targetRequest) {
      targetRequest.status = 'approved';
      targetRequest.adminComments = adminComments;
      saveModificationRequests(requests);
      
      // TODO: 실제로는 여기서 기존 프리셋을 업데이트해야 함
      // updateCompanyPreset(targetRequest.originalPreset.name, targetRequest.proposedPreset);
      
      return { success: true, request: targetRequest };
    }
    
    return { success: false, error: 'Request not found' };
  } catch (error) {
    console.error('Failed to approve modification request:', error);
    return { success: false, error: 'Failed to approve request' };
  }
};

// 수정 의견 거부 (관리자)
export const rejectModificationRequest = (requestId: string, adminComments?: string) => {
  try {
    const requests = getModificationRequests();
    const targetRequest = requests.find(req => req.id === requestId);
    
    if (targetRequest) {
      targetRequest.status = 'rejected';
      targetRequest.adminComments = adminComments;
      saveModificationRequests(requests);
      
      return { success: true, request: targetRequest };
    }
    
    return { success: false, error: 'Request not found' };
  } catch (error) {
    console.error('Failed to reject modification request:', error);
    return { success: false, error: 'Failed to reject request' };
  }
};

// === 수정 요청 저장소 함수들 ===

const getModificationRequests = (): PresetModificationRequest[] => {
  try {
    const stored = localStorage.getItem(MODIFICATION_REQUESTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load modification requests:', error);
    return [];
  }
};

const saveModificationRequests = (requests: PresetModificationRequest[]) => {
  try {
    localStorage.setItem(MODIFICATION_REQUESTS_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error('Failed to save modification requests:', error);
  }
};

// 관리용 함수들
export const getPendingModificationRequests = () => {
  return getModificationRequests().filter(req => req.status === 'pending');
};

export const getModificationRequestsForPreset = (presetName: string) => {
  return getModificationRequests().filter(req => 
    req.originalPreset.name === presetName
  );
};

export const getTopModificationRequests = (limit: number = 10) => {
  const requests = getModificationRequests();
  return requests
    .filter(req => req.status === 'pending')
    .sort((a, b) => b.votes - a.votes)
    .slice(0, limit);
};

// 유틸리티 함수
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
