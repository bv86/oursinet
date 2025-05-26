import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BlockRenderer } from '@/components/BlockRenderer';
import { type Locale } from '@/config';
import type { LocalizedStrapiPage } from '@/lib/types';
import { getPageBySlug } from '@/lib/data/loaders';
import { PageAnalytics } from '@/components/PageAnalytics';
import { getTranslation } from '@/i18n.utils';

async function loader({ slug, locale }: { slug: string; locale: Locale }) {
  const { data } = await getPageBySlug(slug, locale);
  if (!data) notFound();
  return { blocks: data[0]?.blocks, data: data[0] };
}

// Generate dynamic metadata for each page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata> {
  try {
    const { locale, slug } = await params;
    const title = await getTranslation(locale, `meta.${slug}.title`);
    const description = await getTranslation(
      locale,
      `meta.${slug}.description`
    );

    return {
      title,
      description,
      openGraph: {
        title: `${title} | Oursi.net - Benoit Vannesson`,
        description,
        type: 'website',
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
      <PageAnalytics contentId={settings.slug} contentType="main" />
    </div>
  );
};

export default DynamicPage;
