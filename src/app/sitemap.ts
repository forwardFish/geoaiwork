import type { MetadataRoute } from 'next';
import { AppConfig } from '@/utils/AppConfig';
import { getI18nPath } from '@/utils/Helpers';
import { getAllRoutes } from './sitemap-config';

export default function sitemap(): MetadataRoute.Sitemap {
  // 直接使用正确的域名，避免环境变量问题
  const baseUrl = 'https://sheetally.com';
  const currentDate = new Date();

  // 从配置文件获取所有路由
  const allRoutes = getAllRoutes();

  // 为每个语言生成URL
  const sitemapEntries: MetadataRoute.Sitemap = [];

  AppConfig.locales.forEach((locale) => {
    allRoutes.forEach((route) => {
      const localizedPath = getI18nPath(route.path, locale);
      sitemapEntries.push({
        url: `${baseUrl}${localizedPath}`,
        lastModified: route.lastModified || currentDate,
        changeFrequency: route.changeFrequency || 'monthly',
        priority: route.priority || 0.5,
      });
    });
  });

  return sitemapEntries;
}
