import { MetadataRoute } from 'next';
import { locales, host } from '@/config';
import {
  getAllArticlesForSitemap,
  getAllPagesForSitemap,
} from '@/lib/data/loaders';

interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
}

interface StrapiContent {
  slug: string;
  updatedAt: string;
  publishedAt: string;
}

export const revalidate = 300; // Revalidate every 5 minutes

// Fetch all articles from Strapi for all locales
async function getAllArticles(): Promise<
  (StrapiContent & { locale: string })[]
> {
  const allArticles: (StrapiContent & { locale: string })[] = [];

  for (const locale of locales) {
    try {
      const response = await getAllArticlesForSitemap(locale);

      if (response.data) {
        const articles = response.data.map((article: StrapiContent) => ({
          ...article,
          locale,
        }));
        allArticles.push(...articles);
      }
    } catch (error) {
      console.error(`Error fetching articles for locale ${locale}:`, error);
    }
  }

  return allArticles;
}

// Fetch all pages from Strapi for all locales
async function getAllPages(): Promise<(StrapiContent & { locale: string })[]> {
  const allPages: (StrapiContent & { locale: string })[] = [];

  for (const locale of locales) {
    try {
      const response = await getAllPagesForSitemap(locale);

      if (response.data) {
        const pages = response.data.map((page: StrapiContent) => ({
          ...page,
          locale,
        }));
        allPages.push(...pages);
      }
    } catch (error) {
      console.error(`Error fetching pages for locale ${locale}:`, error);
    }
  }

  return allPages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: SitemapEntry[] = [];

  // Static routes for each locale
  const staticRoutes = [
    '', // Home page
    '/blog', // Blog listing page
  ];

  // Add static routes for each locale
  for (const locale of locales) {
    for (const route of staticRoutes) {
      const url = `${host}/${locale}${route}`;

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'daily',
        priority: route === '' ? 0.8 : 1.0,
      });
    }
  }

  try {
    // Fetch and add all articles
    const articles = await getAllArticles();
    for (const article of articles) {
      const url = `${host}/${article.locale}/blog/${article.slug}`;

      sitemapEntries.push({
        url,
        lastModified: new Date(article.updatedAt || article.publishedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }

    // Fetch and add all pages
    const pages = await getAllPages();
    for (const page of pages) {
      // Skip 'blog' page as it's already in static routes
      if (page.slug === 'blog') continue;

      const url = `${host}/${page.locale}/${page.slug}`;

      sitemapEntries.push({
        url,
        lastModified: new Date(page.updatedAt || page.publishedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Continue with static routes only if dynamic content fetch fails
  }

  // Sort by priority (highest first) and then by URL
  sitemapEntries.sort((a, b) => {
    if (a.priority !== b.priority) {
      return (b.priority || 0) - (a.priority || 0);
    }
    return a.url.localeCompare(b.url);
  });

  return sitemapEntries;
}
