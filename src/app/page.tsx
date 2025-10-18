'use client';

import { useState } from 'react';
import { Camera, Sparkles, Download, Shield, CheckCircle2, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
  // 샘플 섹션으로 스크롤 이동
  const scrollToSamples = () => {
    const el = document.getElementById('samples');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const handleDownload = (blob: Blob, _mime?: string, ext?: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `사원증사진_${selectedPreset?.name || '편집본'}.${ext || 'png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-slate-900">
              MAKEIDSAJIN
            </Link>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <Link 
                href="/about" 
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors hover:border-b-2 hover:border-slate-300 pb-1"
              >
                ABOUT
              </Link>
              <Link 
                href="/" 
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors border-b-2 border-blue-500 pb-1"
              >
                서비스
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {!uploadedImage ? (
          <div className="space-y-16">
            {/* 소개/가치 제안 */}
            <section className="text-center py-10 bg-gray-50 rounded-xl border" style={{ borderColor: 'var(--line)' }}>
              <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>회사 규격에 딱 맞는 사원증 사진을 3분 안에</h2>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--muted)' }}>
                별도의 설치 없이 브라우저에서 즉시 편집하고, 회사별 규격 프리셋과 커스텀 설정으로 정확한 사이즈를 보장합니다.
                개인정보는 로컬에서 처리되어 안전합니다.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 mt-10">
                <div className="p-6 border rounded" style={{ borderColor: 'var(--line)' }}>
                  <Clock className="w-6 h-6 mx-auto mb-3" />
                  <div className="font-semibold" style={{ color: 'var(--navy)' }}>빠른 편집</div>
                  <div className="text-sm" style={{ color: 'var(--muted)' }}>드래그 없이 자동 크롭·리사이즈</div>
                </div>
                <div className="p-6 border rounded" style={{ borderColor: 'var(--line)' }}>
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-3" />
                  <div className="font-semibold" style={{ color: 'var(--navy)' }}>정확한 규격</div>
                  <div className="text-sm" style={{ color: 'var(--muted)' }}>회사별 프리셋과 세밀한 커스텀</div>
                </div>
                <div className="p-6 border rounded" style={{ borderColor: 'var(--line)' }}>
                  <Shield className="w-6 h-6 mx-auto mb-3" />
                  <div className="font-semibold" style={{ color: 'var(--navy)' }}>개인정보 보호</div>
                  <div className="text-sm" style={{ color: 'var(--muted)' }}>이미지 처리는 브라우저에서만</div>
                </div>
              </div>
            </section>
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

            {/* 사용 방법(3단계) */}
            <section className="py-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 border rounded" style={{ borderColor: 'var(--line)' }}>
                  <Sparkles className="w-6 h-6 mb-3" />
                  <div className="font-semibold" style={{ color: 'var(--navy)' }}>1. 사진 업로드</div>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>원본 사진을 업로드하면 얼굴 위치를 기준으로 자동 크롭을 제안합니다.</p>
                </div>
                <div className="p-6 border rounded" style={{ borderColor: 'var(--line)' }}>
                  <Camera className="w-6 h-6 mb-3" />
                  <div className="font-semibold" style={{ color: 'var(--navy)' }}>2. 규격 선택·수정</div>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>회사 프리셋을 선택하거나 비율·배경색을 직접 조정하세요.</p>
                </div>
                <div className="p-6 border rounded" style={{ borderColor: 'var(--line)' }}>
                  <Download className="w-6 h-6 mb-3" />
                  <div className="font-semibold" style={{ color: 'var(--navy)' }}>3. 고화질 다운로드</div>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>PNG로 바로 저장하거나 프린트용으로 보관할 수 있습니다.</p>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="py-8">
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>자주 묻는 질문</h3>
              <div className="space-y-4">
                <details className="p-5 border rounded" style={{ borderColor: 'var(--line)' }}>
                  <summary className="font-medium" style={{ color: 'var(--navy)' }}>업로드한 사진이 서버로 전송되나요?</summary>
                  <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>아니요. 모든 편집은 브라우저에서만 처리됩니다. 이미지가 서버에 저장되지 않습니다.</p>
                </details>
                <details className="p-5 border rounded" style={{ borderColor: 'var(--line)' }}>
                  <summary className="font-medium" style={{ color: 'var(--navy)' }}>회사 프리셋이 없으면 어떻게 하나요?</summary>
                  <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>커스텀 설정으로 바로 생성할 수 있고, 추후 프리셋 요청 기능을 통해 추가 예정입니다.</p>
                </details>
                <details className="p-5 border rounded" style={{ borderColor: 'var(--line)' }}>
                  <summary className="font-medium" style={{ color: 'var(--navy)' }}>출력 품질은 어느 정도인가요?</summary>
                  <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>고해상도 PNG로 제공되며, 대부분의 사내 시스템 제출 요건을 충족합니다.</p>
                </details>
              </div>
            </section>

            {/* 하단 샘플 섹션 */}
            <section id="samples" className="py-12">
              <hr style={{ borderColor: 'var(--line)' }} />
              <div className="flex items-center justify-between text-xs py-5" style={{ color: 'var(--muted)' }}>
                <span>PRESET SAMPLES</span>
                <button className="px-3 py-2 border rounded" style={{ borderColor: 'var(--line)' }}>All</button>
              </div>
              <hr style={{ borderColor: 'var(--line)' }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i}>
                    <div className="aspect-[4/5] bg-[var(--navy)] rounded-sm flex items-center justify-center overflow-hidden">
                      <Image
                        src={i % 2 === 0 ? '/globe.svg' : '/window.svg'}
                        alt="샘플 아이콘"
                        width={120}
                        height={120}
                        className="opacity-90"
                      />
                    </div>
                    <div className="mt-3 text-center" style={{ color: 'var(--navy)' }}>
                      <div className="text-sm">샘플 카드 {i}</div>
                      <div className="text-2xs tracking-widest uppercase" style={{ color: 'var(--muted)' }}>PRESET</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
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
