import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">페이지를 찾을 수 없어요</h1>
        <p className="text-slate-600 mb-6">요청하신 페이지가 존재하지 않거나 이동되었어요.</p>
        <Link href="/" className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">홈으로 가기</Link>
      </div>
    </main>
  )
}


