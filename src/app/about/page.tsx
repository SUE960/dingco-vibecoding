'use client';

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--navy)' }}>About MAKEIDSAJIN</h1>
      <p className="text-slate-600 leading-7 mb-6">
        MAKEIDSAJIN은 회사별 사원증 규격에 맞는 사진을 쉽고 빠르게 만들 수 있는 웹 기반 편집기입니다.
        별도의 설치 없이 브라우저에서 바로 실행되며, 이미지 처리는 로컬에서만 이루어져 개인정보 보호에 유리합니다.
      </p>
      <section className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 border rounded" style={{ borderColor: 'var(--line)' }}>
          <div className="font-semibold mb-2" style={{ color: 'var(--navy)' }}>회사별 프리셋</div>
          <p className="text-sm text-slate-600">주요 회사 규격을 미리 제공하고, 없는 규격은 커스텀으로 생성할 수 있습니다.</p>
        </div>
        <div className="p-6 border rounded" style={{ borderColor: 'var(--line)' }}>
          <div className="font-semibold mb-2" style={{ color: 'var(--navy)' }}>간편한 편집</div>
          <p className="text-sm text-slate-600">자동 크롭·리사이즈와 직관적인 조작으로 3분 내 완성할 수 있습니다.</p>
        </div>
        <div className="p-6 border rounded" style={{ borderColor: 'var(--line)' }}>
          <div className="font-semibold mb-2" style={{ color: 'var(--navy)' }}>보안 중심</div>
          <p className="text-sm text-slate-600">원본 이미지는 서버로 업로드되지 않으며, 브라우저 메모리에서만 처리됩니다.</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>로드맵</h2>
        <ul className="list-disc pl-6 text-slate-600">
          <li>규격 요청/투표 기능</li>
          <li>프린트용 템플릿(PDF) 생성</li>
          <li>제출 사양 자동 검증 체크리스트</li>
        </ul>
      </section>
    </main>
  );
}


