import { host } from '@/config';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      /* Google is picking those as links in blog posts, so we disallow them */
      disallow: [
        '/etc',
        '/boot',
        '/usr',
        '/var',
        '/tmp',
        '/dev',
        '/proc',
        '/sys',
      ],
    },
    sitemap: `${host}/sitemap.xml`,
  };
}
