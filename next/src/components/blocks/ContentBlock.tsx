import { ContentBlockProps } from '@/lib/types';

import { ContentList } from '../ContentList';
import { localizeLink } from '@/lib/utils';
import { BlogCard } from '../BlogCard';
import { Button } from '../ui/button';
import Link from 'next/link';
import { getTranslation } from '@/i18n.utils';

export function ContentBlock({
  title,
  locale,
  limit,
}: Readonly<ContentBlockProps>) {
  return (
    <section className="flex flex-col gap-4 w-full px-4 lg:px-0">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <ContentList
        path="/api/articles"
        basePath={localizeLink(locale, '/blog')}
        component={BlogCard}
        locale={locale}
        limit={limit?.toString() || '3'}
      />
      <Button asChild className="self-end">
        <Link href={localizeLink(locale, '/blog')}>
          {getTranslation(locale, 'blog.see_all')}
        </Link>
      </Button>
    </section>
  );
}
