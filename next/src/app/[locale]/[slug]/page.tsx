import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BlockRenderer } from '@/components/BlockRenderer';
import { host, type Locale } from '@/config';
import type { LocalizedStrapiPage } from '@/lib/types';
import { getPageBySlug } from '@/lib/data/loaders';
import { PageAnalytics } from '@/components/PageAnalytics';
import { Suspense } from 'react';

async function loader({ slug, locale }: { slug: string; locale: Locale }) {
  const { data } = await getPageBySlug(slug, locale);
  if (!data) notFound();
  return { blocks: data[0]?.blocks, data: data[0] };
}

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  // This function is used to generate static parameters for dynamic routes.
  // It can be used to pre-render pages at build time.
  return [{ slug: 'about' }];
}

// Generate dynamic metadata for each page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata> {
  try {
    const { locale, slug } = await params;
    const { data } = await loader({ slug, locale });
    const title = `${data.title || slug} | Oursi.net - Benoit Vannesson`;
    const description =
      data.description ||
      'Explore content on Oursi.net, the personal website of Benoit Vannesson';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      },
      alternates: {
        languages: {
          'en-US': `/${locale}/${slug}`,
          'fr-FR': `/${locale}/${slug}`,
        },
        canonical: `${host}/${locale}/${slug}`,
      },
    };
  } catch {
    // Fallback metadata if we can't load the page data
    return {
      title: `Oursi.net - Benoit Vannesson`,
      description:
        'Explore content on Oursi.net, the personal website of Benoit Vannesson',
    };
  }
}

const DynamicPage: LocalizedStrapiPage = async ({ params }) => {
  const settings = await params;
  const { blocks } = await loader(settings);
  return (
    <div className="w-full h-full flex flex-col gap-4 md:gap-8 pb-8">
      <BlockRenderer blocks={blocks} />
      <Suspense>
        <PageAnalytics contentId={settings.slug} contentType="main" />
      </Suspense>
    </div>
  );
};

export default DynamicPage;
