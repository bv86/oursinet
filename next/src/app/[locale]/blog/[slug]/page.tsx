import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { BlockRenderer } from '@/components/BlockRenderer';
import { HeroSection } from '@/components/blocks/HeroSection';
import { getAllArticlesForSitemap, getContentBySlug } from '@/lib/data/loaders';
import { ArticleProps } from '@/lib/types';
import { PageAnalytics } from '@/components/PageAnalytics';
import { host, Locale } from '@/config';
import { Suspense } from 'react';

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  try {
    // Fetch articles for both locales
    const [enArticles, frArticles] = await Promise.all([
      getAllArticlesForSitemap('en'),
      getAllArticlesForSitemap('fr'),
    ]);

    const params = [];

    // Generate params for English articles
    if (enArticles.data) {
      params.push(
        ...enArticles.data.map((article: ArticleProps) => ({
          slug: article.slug,
          locale: 'en' as Locale,
        }))
      );
    }

    // Generate params for French articles
    if (frArticles.data) {
      params.push(
        ...frArticles.data.map((article: ArticleProps) => ({
          slug: article.slug,
          locale: 'fr' as Locale,
        }))
      );
    }

    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string; locale: Locale }>;
}

async function loader(slug: string, locale: Locale) {
  const { data } = await getContentBySlug(slug, '/api/articles', locale);
  const article = data[0];
  if (!article) throw notFound();
  return { article: article as ArticleProps, blocks: article?.blocks };
}

// Generate dynamic metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata> {
  try {
    const { slug, locale } = await params;
    const { article } = await loader(slug, locale);
    return {
      title: article.title,
      description:
        article.description ||
        'Read this article on Oursi.net, the personal blog of Benoit Vannesson',
      alternates: {
        languages: {
          'en-US': `/en/blog/${slug}`,
          'fr-FR': `/fr/blog/${slug}`,
        },
        canonical: `${host}/${locale}/blog/${slug}`,
      },
      openGraph: {
        title: `${article.title} | Oursi.net - Benoit Vannesson`,
        description: article.description,
        type: 'article',
        // Add image if available
        ...(article.image?.url
          ? {
              images: [
                {
                  url: article.image.url,
                  width: 1200,
                  height: 630,
                  alt: article.image.alternativeText || article.title,
                },
              ],
            }
          : {}),
      },
    };
  } catch {
    return {
      title: 'Blog Article',
      description:
        'Read this article on Oursi.net, the personal blog of Benoit Vannesson',
    };
  }
}

export default async function SingleBlogRoute({ params }: PageProps) {
  const { slug, locale } = await params;
  const { article, blocks } = await loader(slug, locale);
  const { image } = article;

  return (
    <div className="flex flex-col gap-8">
      {/* Add analytics tracking for this specific blog post */}
      <Suspense>
        <PageAnalytics contentId={slug} contentType="blog" />
      </Suspense>

      <HeroSection id={article.id} title="" image={image} />

      <div className="flex flex-col gap-4">
        <BlockRenderer blocks={blocks} />
      </div>
    </div>
  );
}
