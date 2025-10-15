'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body>
        <main className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">문제가 발생했어요</h1>
            <p className="text-slate-600 mb-6">일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
            <button onClick={reset} className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">새로고침</button>
          </div>
        </main>
      </body>
    </html>
  )
}


