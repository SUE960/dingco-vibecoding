'use client';

import { useState } from 'react';
import { Settings, Palette } from 'lucide-react';
import { PhotoSpec } from './CompanyPresets';

interface QuickCustomizerProps {
  onCustomPreset: (preset: PhotoSpec) => void;
  currentPreset?: PhotoSpec;
}

export default function QuickCustomizer({ onCustomPreset, currentPreset }: QuickCustomizerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickSettings, setQuickSettings] = useState({
    width: currentPreset?.width || 300,
    height: currentPreset?.height || 400,
    bgColor: currentPreset?.bgColor || '#ffffff'
  });

  const handleQuickApply = () => {
    const customPreset: PhotoSpec = {
      name: '빠른 커스텀',
      width: quickSettings.width,
      height: quickSettings.height,
      aspectRatio: `${quickSettings.width}:${quickSettings.height}`,
      bgColor: quickSettings.bgColor,
      description: `${quickSettings.width}×${quickSettings.height}px 커스텀 규격`
    };

    onCustomPreset(customPreset);
  };

  const commonSizes = [
    { name: '정사각형', width: 400, height: 400 },
    { name: '여권용', width: 350, height: 450 },
    { name: '증명사진', width: 300, height: 400 },
    { name: '명함용', width: 250, height: 300 },
    { name: '반명함', width: 200, height: 250 }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full text-left"
      >
        <Settings className="w-5 h-5 text-slate-700" />
        <h3 className="font-semibold text-slate-900">빠른 커스터마이징</h3>
        <div className="ml-auto text-slate-500">
          {isExpanded ? '▲' : '▼'}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              빠른 규격 선택
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonSizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setQuickSettings(prev => ({ 
                    ...prev, 
                    width: size.width, 
                    height: size.height 
                  }))}
                  className={`p-2 text-xs rounded-lg border transition-all ${
                    quickSettings.width === size.width && quickSettings.height === size.height
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium">{size.name}</div>
                  <div className="text-slate-500">{size.width}×{size.height}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                너비 (px)
              </label>
              <input
                type="number"
                value={quickSettings.width}
                onChange={(e) => setQuickSettings(prev => ({ ...prev, width: parseInt(e.target.value) || 300 }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                min="100"
                max="2000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                높이 (px)
              </label>
              <input
                type="number"
                value={quickSettings.height}
                onChange={(e) => setQuickSettings(prev => ({ ...prev, height: parseInt(e.target.value) || 400 }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                min="100"
                max="2000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              배경색
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={quickSettings.bgColor}
                onChange={(e) => setQuickSettings(prev => ({ ...prev, bgColor: e.target.value }))}
                className="w-12 h-10 border border-slate-300 rounded-lg cursor-pointer"
              />
              <div className="flex gap-2">
                {['#ffffff', '#f8f9fa', '#e9ecef', '#f0f8ff', '#fff9e6'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setQuickSettings(prev => ({ ...prev, bgColor: color }))}
                    className="w-8 h-8 rounded-md border border-slate-300 cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="text-sm text-slate-600 mb-1">미리보기 규격</div>
            <div className="font-medium text-slate-900">
              {quickSettings.width} × {quickSettings.height}px
            </div>
            <div className="text-xs text-slate-500">
              비율: {Math.round((quickSettings.width / quickSettings.height) * 100) / 100}:1
            </div>
          </div>

          <button
            onClick={handleQuickApply}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Palette className="w-4 h-4" />
            이 규격 적용하기
          </button>
        </div>
      )}
    </div>
  );
}
