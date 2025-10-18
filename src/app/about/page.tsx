'use client';
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Dark Background */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Who&apos;s the Next
            <span className="block font-light text-blue-300">Makeidsajin?</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            직장인의 시간을 지키는 단 1분의 사진 서비스
          </p>
        </div>
      </section>

      {/* Main Content - Clean White Background */}
      <main className="bg-white">
        {/* Company Introduction */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">기업 소개</h2>
              <p className="text-lg text-slate-600">EaseWorks (이즈웍스)</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 md:p-12 mb-12">
              <blockquote className="text-2xl md:text-3xl font-light text-slate-700 text-center mb-8">
                &ldquo;일을 덜 하자는 게 아니라, 덜 번거롭게 하자.&rdquo;
              </blockquote>
              <p className="text-lg text-slate-600 text-center max-w-4xl mx-auto leading-relaxed mb-8">
                Workless는 직장인의 사소한 잡무와 관리 스트레스를 없애주는 스마트 서비스 브랜드입니다.
              </p>
              <div className="flex justify-center gap-4">
                {['단순함', '자동화', '회복'].map((value) => (
                  <span key={value} className="px-6 py-3 bg-white rounded-full text-slate-700 font-medium border border-slate-200">
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Service Introduction */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Makeidsajin 서비스</h2>
              <p className="text-lg text-slate-600">AI 기반 증명사진 자동화 서비스</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">서비스 특징</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    각 기업, 기관, 포트폴리오 규격에 맞춘 맞춤형 생성
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    배경·비율·조명·복장·인상까지 자동 보정
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    면접, 인사, 사내 프로필 등록에 최적화
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">핵심 가치</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-bold">정</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">정확한 규격</h4>
                      <p className="text-sm text-slate-600">회사 프리셋과 커스텀 규격 제공</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-green-600 font-bold">빠</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">빠른 제작</h4>
                      <p className="text-sm text-slate-600">3분 내 완성 가능</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-purple-600 font-bold">안</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">개인정보 보호</h4>
                      <p className="text-sm text-slate-600">로컬 처리로 안전 보장</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">사용 방법</h2>
              <p className="text-lg text-slate-600">간단한 3단계로 완성</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">규격 선택</h3>
                <p className="text-slate-600">회사 프리셋을 선택하거나 원하는 규격을 직접 입력합니다.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">사진 업로드</h3>
                <p className="text-slate-600">업로드한 사진에서 얼굴 위치를 기준으로 자동 크롭 제안을 확인합니다.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">다운로드</h3>
                <p className="text-slate-600">PNG/JPG/WEBP 형식을 선택하고 화질을 조절해 즉시 다운로드합니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">로드맵</h2>
              <p className="text-lg text-slate-600">향후 계획</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">규격 요청/투표 기능</h3>
                <p className="text-sm text-slate-600">사용자 요청 기반 새로운 규격 추가</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">프린트용 A4 템플릿</h3>
                <p className="text-sm text-slate-600">PDF 자동 배치 기능</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">제출 사양 자동 검증</h3>
                <p className="text-sm text-slate-600">체크리스트 기능</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">지금 시작하세요</h2>
            <p className="text-lg text-slate-600 mb-8">직장인의 시간을 지키는 사진 서비스를 경험해보세요</p>
            <Link 
              href="/" 
              className="inline-block px-8 py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold"
            >
              편집 시작하기 →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}


