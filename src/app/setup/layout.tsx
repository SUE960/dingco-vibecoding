import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: '설정 페이지 (검색 제외)'
}

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return children
}


