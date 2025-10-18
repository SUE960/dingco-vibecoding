'use client';
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-14">

      {/* 기업 소개 */}
      <section className="max-w-4xl mx-auto mb-12">
        <div className="rounded-2xl border bg-white p-6 md:p-8 shadow-sm" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-start gap-4">
            <div className="hidden md:block w-14 h-14 rounded-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg,#3a5ea9,#86b0ff)' }} />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--navy)' }}>기업 소개</h2>
              <h3 className="text-lg md:text-xl font-semibold mb-3" style={{ color: 'var(--navy)' }}>EaseWorks (이즈웍스)</h3>
              <figure className="bg-gray-50 border rounded-lg p-4 mb-4" style={{ borderColor: 'var(--line)' }}>
                <blockquote className="text-slate-700 italic">&ldquo;일을 덜 하자는 게 아니라, 덜 번거롭게 하자.&rdquo;</blockquote>
              </figure>
              <p className="text-slate-700 leading-7 mb-4">
                Workless는 직장인의 사소한 잡무와 관리 스트레스를 없애주는 스마트 서비스 브랜드입니다.
              </p>
              <div className="flex flex-wrap gap-2">
                {['단순함','자동화','회복'].map((v)=> (
                  <span key={v} className="px-3 py-1 text-sm rounded-full border" style={{ borderColor: 'var(--line)', color:'var(--navy)' }}>{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Makeidsajin 서비스 소개 */}
      <section className="max-w-4xl mx-auto mb-16">
        <div className="rounded-2xl border bg-white p-6 md:p-8 shadow-sm" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-start gap-4">
            <div className="hidden md:block w-14 h-14 rounded-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg,#86b0ff,#3a5ea9)' }} />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--navy)' }}>Makeidsajin 서비스 소개</h2>
              <p className="text-slate-700 italic mb-4">&ldquo;직장인의 시간을 지키는 단 1분의 사진 서비스.&rdquo;</p>
              <p className="text-slate-700 leading-7 mb-3">직장인을 위한 AI 기반 증명사진 자동화 서비스입니다.</p>
              <p className="text-slate-700 leading-7 mb-3">각 기업, 기관, 포트폴리오 규격에 맞춰 <strong>배경·비율·조명·복장·인상</strong>까지 자동 보정하는 맞춤형 ID 포토 생성 플랫폼입니다.</p>
              <p className="text-slate-700 leading-7">면접, 인사, 사내 프로필 등록 등에서 사진 하나 때문에 시간을 낭비하지 않도록 설계되었습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-xl border bg-white" style={{ borderColor: 'var(--line)' }}>
          <div className="font-semibold mb-2" style={{ color: 'var(--navy)' }}>정확한 규격</div>
          <p className="text-sm text-slate-600">회사 프리셋과 커스텀 규격을 제공하여 사이즈·비율을 정확히 맞춥니다.</p>
        </div>
        <div className="p-6 rounded-xl border bg-white" style={{ borderColor: 'var(--line)' }}>
          <div className="font-semibold mb-2" style={{ color: 'var(--navy)' }}>빠른 제작</div>
          <p className="text-sm text-slate-600">자동 크롭·리사이즈와 직관적 컨트롤로 3분 내 완성합니다.</p>
        </div>
        <div className="p-6 rounded-xl border bg-white" style={{ borderColor: 'var(--line)' }}>
          <div className="font-semibold mb-2" style={{ color: 'var(--navy)' }}>개인정보 보호</div>
          <p className="text-sm text-slate-600">이미지는 서버로 업로드되지 않고 브라우저 메모리에서만 처리됩니다.</p>
        </div>
      </section>

      {/* 사용 흐름 */}
      <section className="mb-12 bg-gray-50 rounded-xl border p-8" style={{ borderColor: 'var(--line)' }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--navy)' }}>어떻게 동작하나요?</h2>
        <ol className="grid md:grid-cols-3 gap-6 list-decimal pl-5">
          <li className="text-slate-700">
            회사 프리셋을 선택하거나 원하는 규격을 직접 입력합니다.
          </li>
          <li className="text-slate-700">
            업로드한 사진에서 얼굴 위치를 기준으로 자동 크롭 제안을 확인합니다.
          </li>
          <li className="text-slate-700">
            PNG/JPG/WEBP 형식을 선택하고 화질을 조절해 즉시 다운로드합니다.
          </li>
        </ol>
      </section>

      {/* 로드맵 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--navy)' }}>로드맵</h2>
        <ul className="list-disc pl-6 text-slate-600 space-y-1">
          <li>규격 요청/투표 기능</li>
          <li>프린트용 A4 템플릿(PDF) 자동 배치</li>
          <li>제출 사양 자동 검증 체크리스트</li>
        </ul>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link href="/" className="inline-block px-6 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors">
          지금 편집 시작하기
        </Link>
      </div>
    </main>
  );
}


