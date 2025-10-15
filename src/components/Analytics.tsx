"use client";

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_MEASUREMENT_ID = 'G-HWWYS5T4DZ'

export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    // 준비/관리 성격 페이지는 추적 제외
    if (pathname.startsWith('/setup') || pathname.startsWith('/admin')) return

    const pagePath = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`

    const gtagFn = (globalThis as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof window !== 'undefined' && typeof gtagFn === 'function') {
      gtagFn('config', GA_MEASUREMENT_ID, {
        page_path: pagePath,
      })
    }
  }, [pathname, searchParams])

  return null
}


