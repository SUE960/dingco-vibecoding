import fs from 'fs-extra';
import RSS from 'rss';
import path from 'path';

async function generateFeeds() {
  // Next.js App Router에서 sitemap.ts와 feed.xml/route.ts를 사용하므로
  // 정적 파일 생성을 건너뜁니다.
  console.log('✅ RSS feed는 /src/app/feed.xml/route.ts에서 동적 생성됩니다');
  console.log('✅ Sitemap은 /src/app/sitemap.ts에서 동적 생성됩니다');
}

generateFeeds().catch(console.error);
