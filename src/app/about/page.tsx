'use client';
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-14">
      {/* Hero */}
      <section className="text-center mb-10">
        <p className="text-sm tracking-wide mb-2" style={{ color: 'var(--muted)' }}>가능성을 찾고, 연결을 만드는 일</p>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6" style={{ color: 'var(--navy)' }}>
          MAKEIDSAJIN이 그려가고 있습니다
        </h1>
        {/* 파트너 배지 */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {['/next.svg','/vercel.svg','/globe.svg','/window.svg','/file.svg'].map((src,i)=> (
            <div key={i} className="px-4 py-2 rounded-full border bg-white" style={{ borderColor: 'var(--line)' }}>
              <Image src={src} alt="logo" width={70} height={20} />
            </div>
          ))}
        </div>
        {/* 히어로 이미지 + 오버레이 타이틀 */}
        <div className="rounded-2xl overflow-hidden border mb-2" style={{ borderColor: 'var(--line)' }}>
          <div className="relative h-56 md:h-80">
            <Image src="/vercel.svg" alt="hero" fill className="object-cover opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-widest" style={{ color: 'var(--navy)' }}>
                Con · nect · Wave
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* 인트로 카피 */}
      <section className="text-center max-w-3xl mx-auto mb-12">
        <p className="text-base md:text-lg text-slate-700 leading-7">
          그동안 회사별 규격의 연결성을 강화하기 위해 독립적이고 자율적으로 움직여 왔지만,
          이제는 정확한 프리셋과 커스텀을 기반으로 한 One Team으로서 시너지를 극대화합니다.
        </p>
      </section>
      {/* 곡선 디바이더 */}
      <div className="mb-12">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-10">
          <path d="M0,0 C300,120 900,-120 1200,0 L1200,120 L0,120 Z" fill="#e8effa" />
        </svg>
      </div>
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--navy)' }}>
          MAKEIDSAJIN 소개
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto">
          회사별 사원증 규격에 맞는 사진을 브라우저에서 즉시 만들 수 있는 경량 편집기입니다.
          설치가 필요 없고, 모든 이미지는 로컬에서 처리되어 안전합니다.
        </p>
      </header>

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


