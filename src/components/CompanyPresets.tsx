'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Search, TrendingUp, AlertCircle, Edit3, MessageSquare } from 'lucide-react';
import CustomPresetForm from './CustomPresetForm';
import CompanyRequestForm from './CompanyRequestForm';
import DataSubmissionForm from './DataSubmissionForm';
import ModificationRequestForm from './ModificationRequestForm';
import { getTopRequestedCompanies, getModificationRequestsForPreset } from '@/utils/presetStorage';
import type { CompanyPresetRequest } from '@/utils/presetStorage';

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
  const [customPresets, setCustomPresets] = useState<PhotoSpec[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showModificationForm, setShowModificationForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CompanyPresetRequest | null>(null);
  const [selectedPresetForModification, setSelectedPresetForModification] = useState<PhotoSpec | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [topRequests, setTopRequests] = useState<CompanyPresetRequest[]>([]);
  
  const allPresets = [...COMPANY_PRESETS, ...customPresets];
  const filteredPresets = allPresets.filter(preset => 
    preset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setTopRequests(getTopRequestedCompanies(3));
  }, [showRequestForm, showSubmissionForm, showModificationForm]);

  const handleCustomPresetAdd = (newPreset: PhotoSpec) => {
    setCustomPresets(prev => [...prev, newPreset]);
    onPresetSelect(newPreset); // 추가 후 바로 선택
  };

  const handleRequestSuccess = () => {
    setTopRequests(getTopRequestedCompanies(3));
  };

  const handleSubmissionSuccess = () => {
    setTopRequests(getTopRequestedCompanies(3));
    setShowSubmissionForm(false);
  };

  const handleModificationSuccess = () => {
    setTopRequests(getTopRequestedCompanies(3));
    setShowModificationForm(false);
  };

  const handleRequestClick = (request: CompanyPresetRequest) => {
    setSelectedRequest(request);
    setShowSubmissionForm(true);
  };

  const handleModificationClick = (preset: PhotoSpec) => {
    setSelectedPresetForModification(preset);
    setShowModificationForm(true);
  };

  const getModificationCount = (presetName: string) => {
    if (typeof window === 'undefined') return 0;
    return getModificationRequestsForPreset(presetName).filter(req => req.status === 'pending').length;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Building2 className="w-6 h-6 text-slate-700 mr-2" />
          <h2 className="text-xl font-semibold text-slate-900">회사별 사원증 규격</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRequestForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            회사 요청
          </button>
          <button
            onClick={() => setShowCustomForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            규격 추가
          </button>
        </div>
      </div>

      {/* 검색 바 */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="회사명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
      </div>

      {/* 요청된 회사들 */}
      {topRequests.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-slate-600" />
            <h3 className="font-medium text-slate-900">많이 요청된 회사</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => handleRequestClick(request)}
                className="p-4 border border-orange-200 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900">{request.companyName}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'verified' ? 'bg-green-100 text-green-800' :
                    request.status === 'collecting' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status === 'verified' ? '완료' :
                     request.status === 'collecting' ? '수집중' :
                     '대기중'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>{request.votes}명 요청</span>
                  <span>•</span>
                  <span>{request.submissions.length}개 제출</span>
                </div>
                {request.submissions.length === 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-orange-700">
                    <AlertCircle className="w-3 h-3" />
                    <span>정보 제출 필요</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 기존 프리셋들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPresets.map((preset, index) => {
          const modificationCount = getModificationCount(preset.name);
          const isCustomPreset = allPresets.indexOf(preset) >= COMPANY_PRESETS.length;
          
          return (
            <div
              key={`${preset.name}-${index}`}
              className={`group p-5 border rounded-xl transition-all relative ${
                selectedPreset?.name === preset.name
                  ? 'border-slate-900 bg-slate-50 shadow-sm ring-1 ring-slate-900/10'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* 커스텀 라벨 */}
              {isCustomPreset && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    커스텀
                  </span>
                </div>
              )}

              {/* 수정 의견 알림 */}
              {modificationCount > 0 && (
                <div className="absolute top-2 left-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                    <MessageSquare className="w-3 h-3" />
                    {modificationCount}개 의견
                  </div>
                </div>
              )}

              {/* 메인 콘텐츠 - 클릭 시 선택 */}
              <div
                className="cursor-pointer"
                onClick={() => onPresetSelect(preset)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{preset.name}</h3>
                  <div
                    className="w-4 h-4 rounded-md border border-slate-300"
                    style={{ backgroundColor: preset.bgColor }}
                  />
                </div>
                <p className="text-sm font-medium text-slate-700 mb-2">
                  {preset.width} × {preset.height}px
                </p>
                <p className="text-xs text-slate-500">{preset.description}</p>
              </div>

              {/* 수정 의견 버튼 - 공식 프리셋에만 표시 */}
              {!isCustomPreset && (
                <div className="mt-3 pt-3 border-t border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModificationClick(preset);
                    }}
                    className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 font-medium transition-colors"
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

      {/* 검색 결과가 없을 때 */}
      {searchTerm && filteredPresets.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-medium text-slate-900 mb-2">
            &apos;{searchTerm}&apos; 검색 결과가 없습니다
          </h3>
          <p className="text-slate-600 text-sm mb-4">
            해당 회사의 규격이 아직 등록되지 않았습니다.
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
      <CustomPresetForm
        isVisible={showCustomForm}
        onClose={() => setShowCustomForm(false)}
        onPresetAdd={handleCustomPresetAdd}
      />

      <CompanyRequestForm
        isVisible={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        onRequestSuccess={handleRequestSuccess}
      />

      {selectedRequest && (
        <DataSubmissionForm
          isVisible={showSubmissionForm}
          onClose={() => setShowSubmissionForm(false)}
          request={selectedRequest}
          onSubmissionSuccess={handleSubmissionSuccess}
        />
      )}

      {selectedPresetForModification && (
        <ModificationRequestForm
          isVisible={showModificationForm}
          onClose={() => setShowModificationForm(false)}
          originalPreset={selectedPresetForModification}
          onSubmissionSuccess={handleModificationSuccess}
        />
      )}
    </div>
  );
}


