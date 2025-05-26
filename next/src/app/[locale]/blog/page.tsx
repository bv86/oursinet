import { BlockRenderer } from '@/components/BlockRenderer';
import { BlogCard } from '@/components/BlogCard';
import { ContentList } from '@/components/ContentList';
import { PageAnalytics } from '@/components/PageAnalytics';
import { type Locale } from '@/config';
import { getPageBySlug } from '@/lib/data/loaders';
import { LocalizedPage } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTranslation } from '@/i18n.utils';
import { localizeLink } from '@/lib/utils';

async function loader(locale: Locale) {
  const { data } = await getPageBySlug('blog', locale);
  if (data.length === 0) notFound();
  return { blocks: data[0]?.blocks, data: data[0] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { data } = await loader(locale);

  const title = data.title || 'Blog';
  const description =
    data.description || (await getTranslation(locale, 'meta.blog.description'));

  return {
    title,
    description,
    alternates: {
      languages: {
        'en-US': localizeLink('en', '/blog'),
        'fr-FR': localizeLink('fr', '/blog'),
      },
    },
    openGraph: {
      title: `Blog | Oursi.net - Benoit Vannesson`,
      description,
      type: 'website',
    },
  };
}

const Blog: LocalizedPage<{ page?: string; query?: string }> = async function ({
  params,
  searchParams,
}) {
  const { locale } = await params;
  const { page, query } = await searchParams;
  const { blocks } = await loader(locale);
  return (
    <div className="flex flex-col gap-8 pb-8">
      <BlockRenderer blocks={blocks} />
      <ContentList
        path="/api/articles"
        basePath={localizeLink(locale, '/blog')}
        component={BlogCard}
        showSearch
        query={query}
        showPagination
        page={page}
        locale={locale}
      />
      <PageAnalytics contentId="blog" contentType="main" />
    </div>
  );
};

export default Blog;
