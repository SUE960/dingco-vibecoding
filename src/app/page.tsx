'use client';

import { useState } from 'react';
import { Camera, Sparkles, Users, Download } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import CompanyPresets, { PhotoSpec } from '@/components/CompanyPresets';
import ImageEditor from '@/components/ImageEditor';
import QuickCustomizer from '@/components/QuickCustomizer';
import PresetStats from '@/components/PresetStats';
import AdminDashboard from '@/components/AdminDashboard';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PhotoSpec>();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    // 실제로는 여기서 이미지 처리나 업로드 로직을 수행할 수 있습니다
    setTimeout(() => {
      setUploadedImage(file);
      setIsUploading(false);
    }, 500);
  };

  const handlePresetSelect = (preset: PhotoSpec) => {
    setSelectedPreset(preset);
  };

  const handleDownload = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `사원증사진_${selectedPreset?.name || '편집본'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-900 rounded-xl">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">사원증 사진 편집기</h1>
                <p className="text-sm text-slate-600">회사별 규격에 맞는 완벽한 사원증 사진</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!uploadedImage ? (
          <div className="space-y-12">
            {/* 소개 섹션 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-slate-900 rounded-2xl">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                간편하고 전문적인 사원증 사진 편집
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                <span className="font-semibold text-slate-700">삼성, LG, 네이버 등 회사별 규격에 딱 맞는</span><br />
                증명사진을 3초만에 무료로 만드세요! ✨
              </p>

              {/* 특징 */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-6 h-6 text-slate-700" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">주요 회사 지원</h3>
                  <p className="text-slate-600 text-sm">삼성, LG, 네이버, 카카오 등 주요 회사 규격 지원</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-slate-700" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">자동 크롭 & 리사이즈</h3>
                  <p className="text-slate-600 text-sm">AI 기반 얼굴 인식으로 최적의 크롭 영역 제안</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Download className="w-6 h-6 text-slate-700" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">고품질 다운로드</h3>
                  <p className="text-slate-600 text-sm">PNG 고화질로 바로 다운로드 가능</p>
                </div>
              </div>
            </div>

            {/* 이미지 업로더 */}
            <ImageUploader onImageUpload={handleImageUpload} isUploading={isUploading} />

            {/* 회사 프리셋 */}
            <CompanyPresets onPresetSelect={handlePresetSelect} selectedPreset={selectedPreset} />
            
            {/* 빠른 커스터마이징 */}
            <QuickCustomizer onCustomPreset={handlePresetSelect} currentPreset={selectedPreset} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* 뒤로 가기 버튼 */}
            <button
              onClick={() => {
                setUploadedImage(null);
                setSelectedPreset(undefined);
              }}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              ← 새 이미지 선택
            </button>

            {/* 회사 프리셋 (간소화된 버전) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <CompanyPresets onPresetSelect={handlePresetSelect} selectedPreset={selectedPreset} />
            </div>

            {/* 빠른 커스터마이징 */}
            <QuickCustomizer onCustomPreset={handlePresetSelect} currentPreset={selectedPreset} />

            {/* 이미지 편집기 */}
            <ImageEditor
              imageFile={uploadedImage}
              selectedPreset={selectedPreset}
              onDownload={handleDownload}
            />
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 사원증 사진 편집기. 무료로 제공되는 온라인 도구입니다.</p>
          </div>
        </div>
      </footer>

      {/* 통계 대시보드 */}
      <PresetStats />
      
      {/* 관리자 대시보드 */}
      <AdminDashboard />
    </div>
  );
}
