'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Search, TrendingUp, AlertCircle, Edit3, Check } from 'lucide-react';
import CustomPresetForm from './CustomPresetForm';
import CompanyRequestForm from './CompanyRequestForm';
import DataSubmissionForm from './DataSubmissionForm';
import ModificationRequestForm from './ModificationRequestForm';
import { getModificationRequestsForPreset as getModificationRequestsForPresetLocal } from '@/utils/presetStorage';
import type { CompanyPresetRequest } from '@/utils/presetStorage';
// Supabase 연동
import { getCompanyPresets, getTopRequestedCompanies, getModificationRequestsForPreset } from '@/lib/supabase-storage';
import type { CompanyPreset } from '@/lib/supabase';

// 주요 회사들의 사원증 사진 규격 정보
export interface PhotoSpec {
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  bgColor?: string;
  description: string;
}

export const COMPANY_PRESETS: PhotoSpec[] = [
  {
    name: '삼성전자',
    width: 300,
    height: 400,
    aspectRatio: '3:4',
    bgColor: '#ffffff',
    description: '3:4 비율, 흰색 배경'
  },
  {
    name: 'LG전자',
    width: 350,
    height: 450,
    aspectRatio: '7:9',
    bgColor: '#ffffff',
    description: '7:9 비율, 흰색 배경'
  },
  {
    name: 'SK하이닉스',
    width: 300,
    height: 400,
    aspectRatio: '3:4',
    bgColor: '#f0f8ff',
    description: '3:4 비율, 연한 파란색 배경'
  },
  {
    name: 'NAVER',
    width: 320,
    height: 400,
    aspectRatio: '4:5',
    bgColor: '#ffffff',
    description: '4:5 비율, 흰색 배경'
  },
  {
    name: '카카오',
    width: 300,
    height: 400,
    aspectRatio: '3:4',
    bgColor: '#fff9e6',
    description: '3:4 비율, 연한 노란색 배경'
  },
  {
    name: '현대자동차',
    width: 350,
    height: 450,
    aspectRatio: '7:9',
    bgColor: '#ffffff',
    description: '7:9 비율, 흰색 배경'
  },
  {
    name: '표준 사원증',
    width: 300,
    height: 400,
    aspectRatio: '3:4',
    bgColor: '#ffffff',
    description: '일반적인 3:4 비율, 흰색 배경'
  }
];

interface CompanyPresetsProps {
  onPresetSelect: (preset: PhotoSpec) => void;
  selectedPreset?: PhotoSpec;
}

export default function CompanyPresets({ onPresetSelect, selectedPreset }: CompanyPresetsProps) {
  const [companyPresets, setCompanyPresets] = useState<PhotoSpec[]>(COMPANY_PRESETS);
  const [customPresets, setCustomPresets] = useState<PhotoSpec[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showModificationForm, setShowModificationForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CompanyPresetRequest | null>(null);
  const [selectedPresetForModification, setSelectedPresetForModification] = useState<PhotoSpec | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [topRequests, setTopRequests] = useState<CompanyPresetRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const allPresets = [...companyPresets, ...customPresets];
  const filteredPresets = allPresets.filter(preset => 
    preset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Supabase에서 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // 회사 규격 데이터 로드
      const supabasePresets = await getCompanyPresets();
      if (supabasePresets.length > 0) {
        const convertedPresets: PhotoSpec[] = supabasePresets.map((preset: CompanyPreset) => ({
          name: preset.name,
          width: preset.width,
          height: preset.height,
          aspectRatio: preset.aspect_ratio,
          bgColor: preset.bg_color,
          description: preset.description || ''
        }));
        setCompanyPresets(convertedPresets);
      }

      // 상위 요청 데이터 로드
      const requests = await getTopRequestedCompanies(3);
      const convertedRequests: CompanyPresetRequest[] = requests.map(req => ({
        id: req.id.toString(),
        companyName: req.company_name,
        requesterEmail: req.requester_email,
        requesterName: req.requester_name,
        requestDate: req.request_date,
        status: req.status === 'approved' ? 'verified' : req.status === 'rejected' ? 'pending' : 'pending' as 'pending' | 'collecting' | 'verified' | 'added',
        votes: req.votes,
        submissions: [] // 기본값
      }));
      setTopRequests(convertedRequests);
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleCustomPresetAdd = (newPreset: PhotoSpec) => {
    setCustomPresets(prev => [...prev, newPreset]);
    onPresetSelect(newPreset);
  };

  const handleRequestSuccess = async () => {
    const requests = await getTopRequestedCompanies(3);
      const convertedRequests: CompanyPresetRequest[] = requests.map(req => ({
        id: req.id.toString(),
        companyName: req.company_name,
        requesterEmail: req.requester_email,
        requesterName: req.requester_name,
        requestDate: req.request_date,
        status: req.status === 'approved' ? 'verified' : req.status === 'rejected' ? 'pending' : 'pending' as 'pending' | 'collecting' | 'verified' | 'added',
        votes: req.votes,
        submissions: []
      }));
    setTopRequests(convertedRequests);
  };

  const handleRequestClick = (request: CompanyPresetRequest) => {
    setSelectedRequest(request);
    setShowSubmissionForm(true);
  };

  const handleModificationClick = (preset: PhotoSpec) => {
    setSelectedPresetForModification(preset);
    setShowModificationForm(true);
  };

  const getModificationCount = async (presetName: string) => {
    if (typeof window === 'undefined') return 0;
    try {
      const requests = await getModificationRequestsForPreset(presetName);
      return requests.filter(req => req.status === 'pending').length;
    } catch {
      return getModificationRequestsForPresetLocal(presetName).filter(req => req.status === 'pending').length;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <span className="ml-2 text-slate-600">데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Building2 className="w-6 h-6 text-slate-700 mr-3" />
          <h2 className="text-xl font-semibold text-slate-900">회사별 규격</h2>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowRequestForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            회사 요청
          </button>
          <button
            onClick={() => setShowCustomForm(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            직접 만들기
          </button>
        </div>
      </div>

      {/* 검색 바 */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="회사명으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 많이 요청된 회사들 */}
      {topRequests.length > 0 && !searchTerm && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-medium text-blue-900">많이 요청된 회사</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {topRequests.map((request) => (
              <button
                key={request.id}
                onClick={() => handleRequestClick(request)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <span className="text-sm text-blue-800">{request.companyName}</span>
                <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded-full">
                  {request.votes}표
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 규격 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPresets.map((preset, index) => {
          const isCustomPreset = allPresets.indexOf(preset) >= COMPANY_PRESETS.length;
          
          return (
            <div
              key={`${preset.name}-${index}`}
              className={`group p-5 border rounded-xl transition-all relative cursor-pointer ${
                selectedPreset?.name === preset.name
                  ? 'border-slate-900 bg-slate-50 shadow-sm ring-1 ring-slate-900/10'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
              onClick={() => onPresetSelect(preset)}
            >
              {/* 체크박스 */}
              <div className="absolute top-3 right-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedPreset?.name === preset.name
                    ? 'border-slate-900 bg-slate-900' 
                    : 'border-slate-300 bg-white'
                }`}>
                  {selectedPreset?.name === preset.name && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm font-medium text-slate-900 mb-2">
                  {preset.name}
                </div>
                <div className="text-xs text-slate-600 mb-3">
                  {preset.width} × {preset.height}px
                </div>
                <div 
                  className="w-16 h-20 mx-auto rounded border-2 border-slate-200 mb-3"
                  style={{ backgroundColor: preset.bgColor }}
                />
                <p className="text-xs text-slate-500">{preset.description}</p>
              </div>

              {!isCustomPreset && (
                <div className="mt-3 pt-3 border-t border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModificationClick(preset);
                    }}
                    className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 font-medium transition-colors w-full"
                  >
                    <Edit3 className="w-3 h-3" />
                    수정 의견 제출
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 검색 결과 없음 */}
      {searchTerm && filteredPresets.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-medium text-slate-900 mb-2">
            &apos;{searchTerm}&apos; 검색 결과가 없습니다
          </h3>
          <p className="text-slate-600 mb-4">
            찾으시는 회사의 규격이 없나요? 새로운 회사를 요청해보세요.
          </p>
          <button
            onClick={() => setShowRequestForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            &apos;{searchTerm}&apos; 규격 요청하기
          </button>
        </div>
      )}

      {/* 모달들 */}
      {showCustomForm && (
        <CustomPresetForm
          onPresetAdd={handleCustomPresetAdd}
          onClose={() => setShowCustomForm(false)}
          isVisible={showCustomForm}
        />
      )}

      {showRequestForm && (
        <CompanyRequestForm
          isVisible={showRequestForm}
          onClose={() => setShowRequestForm(false)}
          onRequestSuccess={handleRequestSuccess}
        />
      )}

      {showSubmissionForm && selectedRequest && (
        <DataSubmissionForm
          isVisible={showSubmissionForm}
          onClose={() => setShowSubmissionForm(false)}
          request={selectedRequest}
          onSubmissionSuccess={async () => {
            await handleRequestSuccess();
            setShowSubmissionForm(false);
          }}
        />
      )}

      {showModificationForm && selectedPresetForModification && (
        <ModificationRequestForm
          isVisible={showModificationForm}
          onClose={() => setShowModificationForm(false)}
          originalPreset={selectedPresetForModification}
          onSubmissionSuccess={async () => {
            await handleRequestSuccess();
            setShowModificationForm(false);
          }}
        />
      )}
    </div>
  );
}