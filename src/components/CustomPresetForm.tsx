'use client';

import { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { PhotoSpec } from './CompanyPresets';
import { collectPresetData } from '@/utils/presetStorage';

interface CustomPresetFormProps {
  onPresetAdd: (preset: PhotoSpec) => void;
  onClose: () => void;
  isVisible: boolean;
}

export default function CustomPresetForm({ onPresetAdd, onClose, isVisible }: CustomPresetFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    width: '',
    height: '',
    bgColor: '#ffffff',
    description: '',
    contactEmail: '' // 사용자 연락처 수집용
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = '회사명을 입력해주세요';
    }

    const width = parseInt(formData.width);
    const height = parseInt(formData.height);

    if (!formData.width || width < 100 || width > 2000) {
      newErrors.width = '너비는 100~2000px 사이여야 합니다';
    }

    if (!formData.height || height < 100 || height > 2000) {
      newErrors.height = '높이는 100~2000px 사이여야 합니다';
    }

    if (!formData.description.trim()) {
      newErrors.description = '규격 설명을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const width = parseInt(formData.width);
    const height = parseInt(formData.height);
    const aspectRatio = `${width}:${height}`;

    const newPreset: PhotoSpec = {
      name: formData.companyName,
      width,
      height,
      aspectRatio,
      bgColor: formData.bgColor,
      description: formData.description
    };

    // 사용자가 추가한 규격 정보를 수집
    collectPresetData({
      preset: newPreset,
      contactEmail: formData.contactEmail,
      timestamp: new Date().toISOString()
    });

    onPresetAdd(newPreset);
    
    // 폼 초기화
    setFormData({
      companyName: '',
      width: '',
      height: '',
      bgColor: '#ffffff',
      description: '',
      contactEmail: ''
    });
    
    setErrors({});
    onClose();
  };

  const calculateAspectRatio = (width: number, height: number) => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">사원증 규격 추가</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                회사명 *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="예: 카카오뱅크"
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  너비 (px) *
                </label>
                <input
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="300"
                />
                {errors.width && (
                  <p className="text-red-500 text-xs mt-1">{errors.width}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  높이 (px) *
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="400"
                />
                {errors.height && (
                  <p className="text-red-500 text-xs mt-1">{errors.height}</p>
                )}
              </div>
            </div>

            {formData.width && formData.height && (
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600">
                  계산된 비율: {calculateAspectRatio(parseInt(formData.width), parseInt(formData.height))}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                배경색
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.bgColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, bgColor: e.target.value }))}
                  className="w-12 h-10 border border-slate-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.bgColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, bgColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                규격 설명 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                rows={3}
                placeholder="예: 정장 착용, 흰색 배경, 어깨까지 나오도록"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                이메일 (선택사항)
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="규격 확인이 필요한 경우 연락용"
              />
              <p className="text-xs text-slate-500 mt-1">
                규격 정보 검증이 필요한 경우에만 연락드립니다
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                규격 정보 수집 안내
              </h4>
              <p className="text-xs text-blue-700">
                입력하신 회사 사원증 규격 정보는 다른 사용자들에게도 도움이 되도록 데이터베이스에 추가될 수 있습니다. 
                개인정보는 수집하지 않으며, 회사명과 규격 정보만 활용됩니다.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Save className="w-4 h-4" />
                규격 추가
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
