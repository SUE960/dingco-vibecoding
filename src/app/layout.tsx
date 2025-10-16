import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import Analytics from '@/components/Analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '사원증 사진 편집기 | ID Photo Editor',
  description: '회사별 사원증 규격에 맞게 증명사진을 편집할 수 있는 온라인 도구입니다. 삼성, LG, 네이버 등 회사별 규격에 딱 맞는 사원증 사진을 3초만에 무료로 만드세요!',
  keywords: '사원증, 증명사진, 사진편집, 회사규격, 삼성전자, LG전자, 네이버, 카카오',
  openGraph: {
    title: '사원증 사진 편집기',
    description: '삼성, LG, 네이버 등 회사별 규격에 딱 맞는 사원증 사진을 3초만에 무료로 만드세요!',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
        {/* Google Site Verification Meta Tag */}
        <meta name="google-site-verification" content="xAaFU_LaQnrYJZHpeM3bGKmGoTfm-JFRdkbL4tDm2AY" />
        {/* Naver Site Verification Meta Tag */}
        <meta name="naver-site-verification" content="b29436331b64382b64fdb9d6e1d9d9b919f8e52d" />
        {/* Google AdSense Meta Tag (계정 식별만 유지; 스크립트는 조건부로 개별 컴포넌트에서 로드) */}
        <meta name="google-adsense-account" content="ca-pub-9910536047131530" />
        {/* Google tag (gtag.js) - GA4 */}
        <Script
          id="gtag-loader"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-HWWYS5T4DZ"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'G-HWWYS5T4DZ');
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}

{/* Vercel redeploy trigger */}
{/* Redeploy trigger at Thu Oct 16 2025 */}
