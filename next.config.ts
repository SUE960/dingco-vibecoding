import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // SEO 및 ads.txt 파일 최적화를 위한 헤더 설정
  async headers() {
    return [
      {
        // ads.txt 파일을 위한 적절한 Content-Type 설정
        source: '/ads.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        // robots.txt 파일을 위한 설정
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
