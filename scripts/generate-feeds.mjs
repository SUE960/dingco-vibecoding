import fs from 'fs-extra';
import RSS from 'rss';
import path from 'path';

async function generateFeeds() {
  const publicDir = path.join(process.cwd(), 'public');
  const siteUrl = 'https://makeidsajin.com';

  // =================================================================
  // RSS Feed 생성 (feed.xml)
  // =================================================================
  const feed = new RSS({
    title: '사원증 사진 편집기 | 최신 소식',
    description: '회사별 사원증 규격 가이드, 사진 촬영 팁 등 유용한 정보를 받아보세요.',
    feed_url: `${siteUrl}/feed.xml`,
    site_url: siteUrl,
    language: 'ko',
  });

  // TODO: 나중에 블로그 글 목록을 가져와서 여기에 추가
  feed.item({
    title: '완벽한 사원증 사진을 위한 가이드',
    description: '삼성, LG, 네이버 등 주요 대기업의 사원증 사진 규격과 촬영 팁을 알아보세요.',
    url: `${siteUrl}/guide`, // 나중에 실제 가이드 페이지 URL로 변경
    guid: `${siteUrl}/guide-intro`,
    date: new Date(),
  });

  await fs.writeFile(path.join(publicDir, 'feed.xml'), feed.xml({ indent: true }));
  console.log('✅ RSS feed (feed.xml) 생성 완료');

  // =================================================================
  // Sitemap 생성 (sitemap.xml)
  // =================================================================
  const pages = [
    { url: '/', changeFrequency: 'yearly', priority: 1 },
    // { url: '/guide', changeFrequency: 'monthly', priority: 0.8 },
  ];

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
    <url>
      <loc>${siteUrl}${page.url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${page.changeFrequency}</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `
    )
    .join('')}
</urlset>`;

  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemapContent);
  console.log('✅ Sitemap (sitemap.xml) 생성 완료');
}

generateFeeds().catch(console.error);
