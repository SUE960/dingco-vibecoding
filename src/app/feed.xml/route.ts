import RSS from 'rss'

export async function GET() {
  const baseUrl = 'https://makeidsajin.com/'
  
  const feed = new RSS({
    title: '사원증 사진 편집기',
    description: '회사별 규격에 맞는 사원증 사진을 무료로 편집하는 온라인 도구',
    site_url: baseUrl,
    feed_url: `${baseUrl}/feed.xml`,
    language: 'ko',
    ttl: 60,
  })

  // 주요 업데이트나 새로운 회사 프리셋 추가 시 피드 아이템 추가
  feed.item({
    title: '사원증 사진 편집기 출시',
    description: '삼성, LG, 네이버 등 주요 회사 규격에 맞는 사원증 사진을 3초만에 무료로 편집하세요!',
    url: baseUrl,
    date: new Date(),
  })

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
