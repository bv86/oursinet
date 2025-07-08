import { ArticleProps } from '@/lib/types';
import { Search } from '@/components/Search';
import { getContent } from '@/lib/data/loaders';
import { PaginationComponent } from './PaginationComponent';
import { Locale } from '@/config';
import { Suspense } from 'react';

interface ContentListProps {
  query?: string;
  path: string;
  component: React.ComponentType<ArticleProps & { basePath: string }>;
  showSearch?: boolean;
  page?: string;
  limit?: string;
  showPagination?: boolean;
  locale: Locale;
  basePath: string;
  className?: string;
}

async function loader(
  locale: Locale,
  path: string,
  query?: string,
  page?: string,
  limit?: string
) {
  const { data, meta } = await getContent(locale, path, query, page, limit);
  return {
    articles: (data as ArticleProps[]) || [],
    pageCount: meta?.pagination?.pageCount || 1,
  };
}

export async function ContentList({
  path,
  component,
  showSearch,
  query,
  page,
  limit,
  showPagination,
  locale,
  basePath,
  className = '',
}: Readonly<ContentListProps>) {
  const { articles, pageCount } = await loader(
    locale,
    path,
    query,
    page,
    limit
  );
  const Component = component;

  return (
    <section className={`flex flex-col gap-8 items-center ${className}`}>
      {showSearch && <Search locale={locale} />}
      <div className="w-full flex flex-col gap-4">
        {articles.map((article) => (
          <Component
            key={article.documentId}
            {...article}
            basePath={basePath}
          />
        ))}
      </div>
      {showPagination && (
        <Suspense>
          {/* Suspense is used to handle loading states for the pagination component */}
          <PaginationComponent page={page} pageCount={pageCount} />
        </Suspense>
      )}
    </section>
  );
}
