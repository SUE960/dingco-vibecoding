'use client';

import { Building2 } from 'lucide-react';

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
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Building2 className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">회사별 사원증 규격</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMPANY_PRESETS.map((preset, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedPreset?.name === preset.name
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onPresetSelect(preset)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{preset.name}</h3>
              <div
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: preset.bgColor }}
              />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {preset.width} × {preset.height}px
            </p>
            <p className="text-xs text-gray-500">{preset.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


