import { createClient } from '@supabase/supabase-js'

// Supabase 설정
const supabaseUrl = 'https://jtuirqfuajpbfujctmmn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0dWlycWZ1YWpwYmZ1amN0bW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MTIzMDQsImV4cCI6MjA3MzM4ODMwNH0.CLsZcRRLYeoxoAlm9zOkpAMfOiXfwjLfRVzq6muLme4'

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 데이터베이스 타입 정의
export interface CompanyPreset {
  id: number
  name: string
  width: number
  height: number
  aspect_ratio: string
  bg_color: string
  description?: string
  is_official: boolean
  created_at: string
  updated_at: string
}

export interface PresetRequest {
  id: number
  company_name: string
  requester_name?: string
  requester_email?: string
  request_date: string
  status: 'pending' | 'approved' | 'rejected'
  votes: number
  admin_comments?: string
  created_at: string
  updated_at: string
}

export interface PresetSubmission {
  id: number
  request_id?: number
  company_name: string
  width: number
  height: number
  aspect_ratio: string
  bg_color: string
  submitter_name?: string
  submitter_email?: string
  evidence?: string
  votes: number
  is_verified: boolean
  verified_by?: string
  verified_at?: string
  status: 'pending' | 'approved' | 'rejected'
  admin_comments?: string
  created_at: string
  updated_at: string
}

export interface ModificationRequest {
  id: number
  company_preset_id?: number
  original_preset: Record<string, unknown> // JSON 타입
  proposed_preset: Record<string, unknown> // JSON 타입
  reason: string
  evidence?: string
  requester_name?: string
  requester_email?: string
  votes: number
  status: 'pending' | 'approved' | 'rejected' | 'reviewing'
  admin_comments?: string
  reviewed_by?: string
  reviewed_at?: string
  request_date: string
  created_at: string
  updated_at: string
}

export interface CustomPreset {
  id: number
  name: string
  width: number
  height: number
  aspect_ratio: string
  bg_color: string
  description?: string
  creator_name?: string
  creator_email?: string
  creator_ip?: string
  is_public: boolean
  usage_count: number
  created_at: string
  updated_at: string
}
