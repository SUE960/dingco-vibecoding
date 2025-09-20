import { supabase } from './supabase'
import type { 
  CompanyPreset, 
  PresetRequest, 
  PresetSubmission, 
  ModificationRequest, 
  CustomPreset 
} from './supabase'

// === 회사 규격 관련 함수 ===

// 모든 회사 규격 가져오기
export const getCompanyPresets = async (): Promise<CompanyPreset[]> => {
  const { data, error } = await supabase
    .from('company_presets')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching company presets:', error)
    return []
  }

  return data || []
}

// 특정 회사 규격 가져오기
export const getCompanyPreset = async (id: number): Promise<CompanyPreset | null> => {
  const { data, error } = await supabase
    .from('company_presets')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching company preset:', error)
    return null
  }

  return data
}

// === 회사 규격 요청 관련 함수 ===

// 새로운 회사 규격 요청
export const requestCompanyPreset = async (request: {
  companyName: string
  requesterEmail?: string
  requesterName?: string
}): Promise<{ success: true; isNew: boolean; request: PresetRequest } | { success: false; error: string }> => {
  try {
    // 이미 요청된 회사인지 확인
    const { data: existingRequests } = await supabase
      .from('preset_requests')
      .select('*')
      .ilike('company_name', request.companyName)

    if (existingRequests && existingRequests.length > 0) {
      // 기존 요청에 투표 추가
      const existingRequest = existingRequests[0]
      const { data: updatedRequest, error } = await supabase
        .from('preset_requests')
        .update({ votes: existingRequest.votes + 1 })
        .eq('id', existingRequest.id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, isNew: false, request: updatedRequest }
    } else {
      // 새로운 요청 추가
      const { data: newRequest, error } = await supabase
        .from('preset_requests')
        .insert({
          company_name: request.companyName,
          requester_email: request.requesterEmail,
          requester_name: request.requesterName,
          votes: 1
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, isNew: true, request: newRequest }
    }
  } catch {
    return { success: false, error: 'Failed to request company preset' }
  }
}

// 가장 많이 요청된 회사들 가져오기
export const getTopRequestedCompanies = async (limit = 5): Promise<PresetRequest[]> => {
  const { data, error } = await supabase
    .from('preset_requests')
    .select('*')
    .eq('status', 'pending')
    .order('votes', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching top requested companies:', error)
    return []
  }

  return data || []
}

// === 규격 데이터 제출 관련 함수 ===

// 회사 규격 데이터 제출
export const submitCompanyPreset = async (submission: {
  requestId?: number
  companyName: string
  preset: {
    width: number
    height: number
    aspectRatio: string
    bgColor: string
  }
  submitterEmail?: string
  submitterName?: string
  evidence?: string
}): Promise<{ success: true; submission: PresetSubmission } | { success: false; error: string }> => {
  try {
    const { data: newSubmission, error } = await supabase
      .from('preset_submissions')
      .insert({
        request_id: submission.requestId,
        company_name: submission.companyName,
        width: submission.preset.width,
        height: submission.preset.height,
        aspect_ratio: submission.preset.aspectRatio,
        bg_color: submission.preset.bgColor,
        submitter_email: submission.submitterEmail,
        submitter_name: submission.submitterName,
        evidence: submission.evidence,
        votes: 0
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, submission: newSubmission }
  } catch {
    return { success: false, error: 'Failed to submit company preset' }
  }
}

// 제출된 규격에 투표
export const voteForSubmission = async (submissionId: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: submission } = await supabase
      .from('preset_submissions')
      .select('votes')
      .eq('id', submissionId)
      .single()

    if (!submission) {
      return { success: false, error: 'Submission not found' }
    }

    const { error } = await supabase
      .from('preset_submissions')
      .update({ votes: submission.votes + 1 })
      .eq('id', submissionId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to vote for submission' }
  }
}

// === 수정 의견 관련 함수 ===

// 규격 수정 의견 제출
export const submitModificationRequest = async (request: {
  companyPresetId: number
  originalPreset: Record<string, unknown>
  proposedPreset: Record<string, unknown>
  requesterEmail?: string
  requesterName?: string
  reason: string
  evidence?: string
}): Promise<{ success: true; request: ModificationRequest } | { success: false; error: string }> => {
  try {
    const { data: newRequest, error } = await supabase
      .from('modification_requests')
      .insert({
        company_preset_id: request.companyPresetId,
        original_preset: request.originalPreset,
        proposed_preset: request.proposedPreset,
        reason: request.reason,
        evidence: request.evidence,
        requester_email: request.requesterEmail,
        requester_name: request.requesterName,
        votes: 0
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, request: newRequest }
  } catch {
    return { success: false, error: 'Failed to submit modification request' }
  }
}

// 수정 의견에 투표
export const voteForModification = async (requestId: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: request } = await supabase
      .from('modification_requests')
      .select('votes')
      .eq('id', requestId)
      .single()

    if (!request) {
      return { success: false, error: 'Modification request not found' }
    }

    const { error } = await supabase
      .from('modification_requests')
      .update({ votes: request.votes + 1 })
      .eq('id', requestId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to vote for modification' }
  }
}

// 특정 회사 규격의 수정 의견들 가져오기
export const getModificationRequestsForPreset = async (presetName: string): Promise<ModificationRequest[]> => {
  const { data, error } = await supabase
    .from('modification_requests')
    .select(`
      *,
      company_presets!inner(name)
    `)
    .eq('company_presets.name', presetName)
    .eq('status', 'pending')

  if (error) {
    console.error('Error fetching modification requests:', error)
    return []
  }

  return data || []
}

// === 커스텀 규격 관련 함수 ===

// 커스텀 규격 저장
export const saveCustomPreset = async (preset: {
  name: string
  width: number
  height: number
  aspectRatio: string
  bgColor: string
  description?: string
  creatorName?: string
  creatorEmail?: string
  isPublic?: boolean
}): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('custom_presets')
      .insert({
        name: preset.name,
        width: preset.width,
        height: preset.height,
        aspect_ratio: preset.aspectRatio,
        bg_color: preset.bgColor,
        description: preset.description,
        creator_name: preset.creatorName,
        creator_email: preset.creatorEmail,
        is_public: preset.isPublic || false,
        usage_count: 0
      })

    if (error) {
      console.error('Error saving custom preset:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to save custom preset:', error)
    return false
  }
}

// 공개 커스텀 규격들 가져오기
export const getPublicCustomPresets = async (): Promise<CustomPreset[]> => {
  const { data, error } = await supabase
    .from('custom_presets')
    .select('*')
    .eq('is_public', true)
    .order('usage_count', { ascending: false })

  if (error) {
    console.error('Error fetching public custom presets:', error)
    return []
  }

  return data || []
}

// 커스텀 규격 사용 횟수 증가
export const incrementPresetUsage = async (presetId: number): Promise<void> => {
  try {
    const { data: preset } = await supabase
      .from('custom_presets')
      .select('usage_count')
      .eq('id', presetId)
      .single()

    if (preset) {
      await supabase
        .from('custom_presets')
        .update({ usage_count: preset.usage_count + 1 })
        .eq('id', presetId)
    }
  } catch (error) {
    console.error('Failed to increment preset usage:', error)
  }
}

// === 관리자 기능 ===

// 대기 중인 검증 항목들
export const getPendingVerifications = async (): Promise<PresetSubmission[]> => {
  const { data, error } = await supabase
    .from('preset_submissions')
    .select('*')
    .eq('is_verified', false)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending verifications:', error)
    return []
  }

  return data || []
}

// 대기 중인 수정 의견들
export const getPendingModificationRequests = async (): Promise<ModificationRequest[]> => {
  const { data, error } = await supabase
    .from('modification_requests')
    .select('*')
    .eq('status', 'pending')
    .order('votes', { ascending: false })

  if (error) {
    console.error('Error fetching pending modification requests:', error)
    return []
  }

  return data || []
}

// 제출물 승인
export const approveSubmission = async (submissionId: number): Promise<{ success: true; submission: PresetSubmission } | { success: false; error: string }> => {
  try {
    const { data: updatedSubmission, error } = await supabase
      .from('preset_submissions')
      .update({ 
        status: 'approved',
        is_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, submission: updatedSubmission }
  } catch {
    return { success: false, error: 'Failed to approve submission' }
  }
}

// 수정 의견 승인
export const approveModificationRequest = async (requestId: number, adminComments?: string): Promise<{ success: true; request: ModificationRequest } | { success: false; error: string }> => {
  try {
    const { data: updatedRequest, error } = await supabase
      .from('modification_requests')
      .update({ 
        status: 'approved',
        admin_comments: adminComments,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, request: updatedRequest }
  } catch {
    return { success: false, error: 'Failed to approve modification request' }
  }
}

// 수정 의견 거부
export const rejectModificationRequest = async (requestId: number, adminComments?: string): Promise<{ success: true; request: ModificationRequest } | { success: false; error: string }> => {
  try {
    const { data: updatedRequest, error } = await supabase
      .from('modification_requests')
      .update({ 
        status: 'rejected',
        admin_comments: adminComments,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, request: updatedRequest }
  } catch {
    return { success: false, error: 'Failed to reject modification request' }
  }
}
