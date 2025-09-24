import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/', // 私人仪表盘
          '/sign-in', // 登录页面
          '/sign-up', // 注册页面
          '/user-profile', // 用户资料页
          '/counter', // 计数器页面（不常用）
          '/portfolio', // 作品集页面（已备份）
          '/fr/portfolio', // 法语作品集页面
          '/tools/deduplicate-keep-latest', // 已隐藏的中文工具页
          '/tools/merge-sheets-mapping', // 已隐藏的中文工具页
          '/tools/text-clean-split', // 已隐藏的中文工具页
          '/tools/date-currency-normalize', // 已隐藏的中文工具页
          '/tools/excel-diff', // 已隐藏的中文工具页
          '/_next/', // Next.js 内部文件
          '/api/', // API 路由
        ],
      },
    ],
    sitemap: 'https://www.sheetally.com/sitemap.xml',
    host: 'https://www.sheetally.com',
  };
}
