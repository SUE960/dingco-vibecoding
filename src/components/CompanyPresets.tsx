'use client';

import { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import CustomPresetForm from './CustomPresetForm';

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
  
  const allPresets = [...COMPANY_PRESETS, ...customPresets];

  const handleCustomPresetAdd = (newPreset: PhotoSpec) => {
    setCustomPresets(prev => [...prev, newPreset]);
    onPresetSelect(newPreset); // 추가 후 바로 선택
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Building2 className="w-6 h-6 text-slate-700 mr-2" />
          <h2 className="text-xl font-semibold text-slate-900">회사별 사원증 규격</h2>
        </div>
        <button
          onClick={() => setShowCustomForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          규격 추가
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allPresets.map((preset, index) => (
          <div
            key={`${preset.name}-${index}`}
            className={`p-5 border rounded-xl cursor-pointer transition-all relative ${
              selectedPreset?.name === preset.name
                ? 'border-slate-900 bg-slate-50 shadow-sm ring-1 ring-slate-900/10'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
            onClick={() => onPresetSelect(preset)}
          >
            {index >= COMPANY_PRESETS.length && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  커스텀
                </span>
              </div>
            )}
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
        ))}
      </div>

      <CustomPresetForm
        isVisible={showCustomForm}
        onClose={() => setShowCustomForm(false)}
        onPresetAdd={handleCustomPresetAdd}
      />
    </div>
  );
}


