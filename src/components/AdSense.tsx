"use client";

import Script from 'next/script'
import { useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'

type AdSenseProps = {
  adSlot: string
  adFormat?: string
  style?: React.CSSProperties
  className?: string
}

/**
 * Google AdSense 조건부 로딩/렌더러
 * - 콘텐츠가 충분하지 않거나 준비 중인 페이지(`setup`, 404, error 등)에서는 렌더링하지 않음
 * - 클라이언트에서만 로드하여 레이아웃 시점의 CLS를 최소화
 */
export default function AdSense({ adSlot, adFormat = 'auto', style, className }: AdSenseProps) {
  const pathname = usePathname()

  const shouldRender = useMemo(() => {
    if (!pathname) return false
    // 준비/관리 성격 페이지, 오류 페이지 경로 방어
    if (pathname.startsWith('/setup') || pathname.startsWith('/admin')) return false
    // 기타: 콘텐츠가 충분한 홈과 기능 페이지에서만 허용 (필요시 화이트리스트 확장)
    return ['/', '/features'].includes(pathname) || pathname.startsWith('/companies')
  }, [pathname])

  useEffect(() => {
    if (!shouldRender) return
    try {
      // @ts-expect-error: adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // swallow
    }
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <>
      <Script
        id="adsbygoogle-loader"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9910536047131530"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className={`adsbygoogle ${className ?? ''}`.trim()}
        style={style ?? { display: 'block' }}
        data-ad-client="ca-pub-9910536047131530"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </>
  )
}


