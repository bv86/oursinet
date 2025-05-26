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

async function loader(locale: Locale) {
  const { data } = await getPageBySlug('blog', locale);
  if (data.length === 0) notFound();
  return { blocks: data[0]?.blocks };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = 'Blog';
  const description = await getTranslation(locale, 'meta.blog.description');

  return {
    title,
    description,
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
