import RSS from 'rss';
import { NextResponse } from 'next/server';

export async function GET() {
  const feed = new RSS({
    title: '사원증 사진 편집기 | 최신 소식',
    description: '회사별 사원증 규격 가이드, 사진 촬영 팁 등 유용한 정보를 받아보세요.',
    feed_url: 'https://makeidsajin.com/feed.xml',
    site_url: 'https://makeidsajin.com',
    language: 'ko',
  });

  // 나중에 블로그나 가이드 글이 추가되면 이곳에 동적으로 추가합니다.
  // 예시:
  // const posts = await getAllPosts();
  // posts.forEach(post => {
  //   feed.item({
  //     title: post.title,
  //     description: post.summary,
  //     url: `https://makeidsajin.com/blog/${post.slug}`,
  //     date: post.date,
  //   });
  // });

  // 현재는 예시 아이템을 추가합니다.
  feed.item({
    title: '완벽한 사원증 사진을 위한 가이드',
    description: '삼성, LG, 네이버 등 주요 대기업의 사원증 사진 규격과 촬영 팁을 알아보세요. 저희 편집기와 함께라면 규격 걱정 없이 완벽한 사진을 만들 수 있습니다.',
    url: 'https://makeidsajin.com', // 나중에 상세 가이드 페이지 URL로 변경
    guid: 'https://makeidsajin.com/#guide-intro', // 각 아이템의 고유 ID
    date: new Date(),
  });


  const xml = feed.xml({ indent: true });

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
