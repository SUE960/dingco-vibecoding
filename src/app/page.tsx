'use client';

import { useState } from 'react';
import { Camera, Sparkles, Users, Download } from 'lucide-react';
import AdSense from '@/components/AdSense';
import ImageUploader from '@/components/ImageUploader';
import CompanyPresets, { PhotoSpec } from '@/components/CompanyPresets';
import ImageEditor from '@/components/ImageEditor';
import QuickCustomizer from '@/components/QuickCustomizer';
import PresetStats from '@/components/PresetStats';
import AdminDashboard from '@/components/AdminDashboard';
import { ErrorBoundary, DefaultErrorFallback } from '@/components/ErrorBoundary';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  사원증 사진 편집기
                </h1>
                <p className="text-sm text-slate-600 font-medium">회사별 규격에 맞는 완벽한 사원증 사진</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                기능
              </a>
              <a href="#howto" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                사용법
              </a>
              <a href="#companies" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                지원회사
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!uploadedImage ? (
          <div className="space-y-16">
            {/* 히어로 섹션 */}
            <div className="text-center py-16">
              <div className="flex justify-center mb-8">
                <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
              </div>
              <h2 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  간편하고 전문적인
                </span><br />
                <span className="text-slate-800">사원증 사진 편집</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                <span className="font-bold text-slate-800">삼성, LG, 네이버 등 회사별 규격에 딱 맞는</span><br />
                사원증 사진을 <span className="font-bold text-blue-600">3초만에 무료로</span> 만드세요! ✨
              </p>
              
              {/* CTA 버튼 */}
              <div className="flex justify-center mb-16">
                <button 
                  onClick={() => {
                    const uploadSection = document.getElementById('howto');
                    uploadSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  지금 시작하기 →
                </button>
              </div>
            </div>

            {/* 광고: 충분한 안내 콘텐츠 아래에 배치 */}
            <div className="py-4">
              <AdSense adSlot="1234567890" />
            </div>

            {/* 특징 섹션 */}
            <div id="features" className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">왜 우리 서비스를 선택해야 할까요?</h3>
                <p className="text-lg text-slate-600">전문적이고 간편한 사원증 사진 편집 경험을 제공합니다</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="group bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 text-center hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-3 text-lg">주요 회사 지원</h3>
                  <p className="text-slate-600">삼성, LG, 네이버, 카카오 등 주요 회사 규격 지원</p>
                </div>
                <div className="group bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 text-center hover:shadow-xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Camera className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-3 text-lg">자동 크롭 & 리사이즈</h3>
                  <p className="text-slate-600">AI 기반 얼굴 인식으로 최적의 크롭 영역 제안</p>
                </div>
                <div className="group bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 text-center hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Download className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-3 text-lg">고품질 다운로드</h3>
                  <p className="text-slate-600">PNG 고화질로 바로 다운로드 가능</p>
                </div>
              </div>
            </div>

            {/* 이미지 업로더 섹션 */}
            <div id="howto" className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">사진 업로드하기</h3>
                <p className="text-lg text-slate-600">간단한 3단계로 완벽한 사원증 사진을 만들어보세요</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 shadow-lg">
                <ImageUploader onImageUpload={handleImageUpload} isUploading={isUploading} />
              </div>
            </div>

            {/* 회사 프리셋 섹션 */}
            <div id="companies" className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">지원하는 회사들</h3>
                <p className="text-lg text-slate-600">주요 기업들의 사원증 규격을 미리 설정해두었습니다</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 shadow-lg">
                <ErrorBoundary fallback={DefaultErrorFallback}>
                  <CompanyPresets onPresetSelect={handlePresetSelect} selectedPreset={selectedPreset} />
                </ErrorBoundary>
              </div>
            </div>
            
            {/* 빠른 커스터마이징 섹션 */}
            <div className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">커스텀 설정</h3>
                <p className="text-lg text-slate-600">원하는 크기와 비율로 직접 설정할 수 있습니다</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 shadow-lg">
                <ErrorBoundary fallback={DefaultErrorFallback}>
                  <QuickCustomizer onCustomPreset={handlePresetSelect} currentPreset={selectedPreset} />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 뒤로 가기 버튼 */}
            <div className="flex justify-start">
              <button
                onClick={() => {
                  setUploadedImage(null);
                  setSelectedPreset(undefined);
                }}
                className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl px-6 py-3 text-slate-700 hover:text-slate-900 font-medium transition-all duration-300 hover:shadow-lg hover:border-blue-200"
              >
                ← 새 이미지 선택
              </button>
            </div>

            {/* 편집 패널들 */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* 왼쪽: 회사 프리셋 */}
              <div className="lg:col-span-1">
                <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg sticky top-24">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">회사 선택</h3>
                  <ErrorBoundary fallback={DefaultErrorFallback}>
                    <CompanyPresets onPresetSelect={handlePresetSelect} selectedPreset={selectedPreset} />
                  </ErrorBoundary>
                </div>
              </div>

              {/* 오른쪽: 편집기와 커스터마이징 */}
              <div className="lg:col-span-2 space-y-8">
                {/* 이미지 편집기 */}
                <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg">
                  <ErrorBoundary fallback={DefaultErrorFallback}>
                    <ImageEditor
                      imageFile={uploadedImage}
                      selectedPreset={selectedPreset}
                      onDownload={handleDownload}
                    />
                  </ErrorBoundary>
                </div>

                {/* 빠른 커스터마이징 */}
                <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">커스텀 설정</h3>
                  <ErrorBoundary fallback={DefaultErrorFallback}>
                    <QuickCustomizer onCustomPreset={handlePresetSelect} currentPreset={selectedPreset} />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">사원증 사진 편집기</h3>
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                회사별 규격에 맞는 완벽한 사원증 사진을 간편하게 만들어보세요. 
                삼성, LG, 네이버 등 주요 기업의 규격을 지원합니다.
              </p>
              <div className="flex space-x-4">
                <a href="/privacy" className="text-slate-300 hover:text-white transition-colors">
                  개인정보처리방침
                </a>
                <a href="/terms" className="text-slate-300 hover:text-white transition-colors">
                  이용약관
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">지원 회사</h4>
              <ul className="space-y-2 text-slate-300">
                <li>삼성전자</li>
                <li>LG전자</li>
                <li>네이버</li>
                <li>카카오</li>
                <li>SK하이닉스</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">기능</h4>
              <ul className="space-y-2 text-slate-300">
                <li>자동 크롭</li>
                <li>AI 얼굴 인식</li>
                <li>고화질 다운로드</li>
                <li>커스텀 설정</li>
                <li>무료 사용</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 사원증 사진 편집기. 무료로 제공되는 온라인 도구입니다.</p>
          </div>
        </div>
      </footer>

      {/* 통계 대시보드 */}
      <ErrorBoundary fallback={DefaultErrorFallback}>
        <PresetStats />
      </ErrorBoundary>
      
      {/* 관리자 대시보드 */}
      <ErrorBoundary fallback={DefaultErrorFallback}>
        <AdminDashboard />
      </ErrorBoundary>
    </div>
  );
}
